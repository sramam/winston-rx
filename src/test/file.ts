
import { test } from 'ava';
import * as delay from 'delay';
import * as _tmp from 'tmp';
import * as pify from 'pify';
import * as intercept from 'intercept-stdout';
import {
  // Formatter,
  init,
  TimeFormat
} from '..';

import * as _fs from 'fs-extra';

const tmp = pify(_tmp);
const fs = pify(_fs);

const JSON2 = j => JSON.stringify(j, null, 2);

test.serial(`logger - file transport - warn`, async t => {
  const path = await tmp.dir({ prefix: 'logger-rx' });
  const fname = `${path}/junk.log`
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {
        name: 'default',
      },
      app: {
        name: 'app'
      }
    },
    transports: {
      default: {
        type: 'file',
        fname,
        size: '200B',
        level: 'warn',
        timeFormat: <TimeFormat>'none',
        formatter: 'json',
        loggers: ['default', 'app']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  const app = instances.loggers['app'].log;
  log.error(`this is a mock error for testing`)
  app.error(`mock error from app`)
  // these will not be logged
  log.info(`Just an info message`)
  log.silly(`It' silly how much information one can log`, { a: 1 })
  log.silly(`It' silly how much information one can log`, { b: 2 })
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  await delay(100);
  const data = fs.readFileSync(fname, 'utf8');
  t.snapshot({ stdoutCache, data }, JSON2({ stdoutCache, data, path }));
});

test.serial(`logger - file transport - silly`, async t => {
  const path = await tmp.dir({ prefix: 'logger-rx' });
  const fname = `${path}/junk.log`
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {
        name: 'default'
      }
    },
    transports: {
      default: {
        type: 'file',
        fname,
        size: '200B',
        level: 'silly',
        timestamp: false,
        timeFormat: <TimeFormat>'none',
        formatter: 'string',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message`)
  log.error(`this is a mock error for testing`)
  log.silly(`It' silly how much information one can log`, { a: 1 })
  log.silly(`It' silly how much information one can log`, { b: 2 })
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  await delay(20);
  const data = fs.readFileSync(fname, 'utf8');
  t.snapshot(data, JSON2({ stdoutCache, data, path }));
});

test.serial(`logger - file transport - warn - w/ timestamp`, async t => {
  const path = await tmp.dir({ prefix: 'logger-rx' });
  const fname = `${path}/junk.log`
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {
        name: 'default'
      }
    },
    transports: {
      default: {
        type: 'file',
        fname,
        size: '200B',
        level: 'info',
        timestamp: true,
        timeFormat: <TimeFormat>'ms',
        formatter: 'string',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message`);
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  await delay(20);
  t.snapshot(stdoutCache, JSON2({ stdoutCache, path }));
  const data = fs.readFileSync(fname, 'utf8');
  t.is(data.length, 43, JSON2({ stdoutCache, data, path }));
  t.regex(data, /.*info.*\d.*Just an info message/)
});

test.serial(`logger - file transport - warn - w/ timestamp and rotation`, async t => {
  const path = await tmp.dir({ prefix: 'logger-rx' });
  const fname = `${path}/junk.log`
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {
        name: 'default'
      }
    },
    transports: {
      default: {
        type: 'file',
        fname,
        size: '200B',
        level: 'info',
        timestamp: false,
        timeFormat: <TimeFormat>'ms',
        formatter: 'string',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message 0`);
  log.info(`Just an info message 1`);
  log.info(`Just an info message 2`);
  log.info(`Just an info message 3`);
  log.info(`Just an info message 4`);
  await delay(50);
  log.info(`Just an info message 6`);
  await delay(50);
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  await delay(100); // needs more time for the rotation to take effect.
  const data = fs.readFileSync(fname, 'utf8');
  t.regex(data, /info.*Just an info message 6/, JSON2({ stdoutCache, data, path }));
});

test.serial.skip(`logger - file transport - force logger error`, async t => {
  const path = await tmp.dir({ prefix: 'logger-rx' });
  const fname = `${path}/junk.log`
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {
        name: 'default'
      }
    },
    transports: {
      default: {
        type: 'file',
        fname,
        size: '200B',
        level: 'info',
        timestamp: false,
        timeFormat: <TimeFormat>'ms',
        formatter: 'json',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  // const transport = instances.transports['default'];
  // force close the fstream here. Does it trigger an upstream logger error?
  // transport.fstream.end();
  fs.removeSync(fname);
  log.info(`Just an info message 0`);
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  await delay(20);
  const data = fs.readFileSync(fname, 'utf8');
  t.snapshot({ stdoutCache, data }, JSON2({ stdoutCache, data, path }));
});

test.serial(`logger - file transport - unsubscribe`, async t => {
  const path = await tmp.dir({ prefix: 'logger-rx' });
  const fname = `${path}/junk.log`
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {
        name: 'default'
      },
      app: {
        name: 'app'
      }
    },
    transports: {
      default: {
        type: 'file',
        fname,
        size: '200B',
        level: 'warn',
        timeFormat: <TimeFormat>'none',
        formatter: 'json',
        loggers: ['default', 'app']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  const app = instances.loggers['app'];
  const transport = instances.transports['default'];
  transport.unsubscribe(app);
  log.info(`Just an info message`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  await delay(20);
  const data = fs.readFileSync(fname, 'utf8');
  t.snapshot({ stdoutCache, data }, JSON2({ stdoutCache, data, path }));
});

