
import { test } from 'ava';
import * as intercept from 'intercept-stdout';
import {
  // Formatter,
  init,
  TimeFormat
} from '..';


// const JSON2 = j => JSON.stringify(j, null, 2);

test(`timeFormat - none`, async t => {
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
        type: 'console',
        level: 'info',
        timeFormat: <TimeFormat>'none',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message - none`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.regex(stdoutCache, /info.* Just an info message.*/)
});

test(`timeFormat - locale-date`, async t => {
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
        type: 'console',
        level: 'info',
        timeFormat: <TimeFormat>'locale-date',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message - locale-date`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.regex(stdoutCache, /info.*\d{4}-\d{1,2}-\d{1,2}.* Just an info message.*/)
});

test(`timeFormat - locale-time`, async t => {
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
        type: 'console',
        level: 'info',
        timeFormat: <TimeFormat>'locale-time',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message - locale-time`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.regex(stdoutCache, /info.*\d{1,2}:\d{1,2}:\d{1,2}.\d{3}.* Just an info message.*/)
});


test(`timeFormat - utc`, async t => {
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
        type: 'console',
        level: 'info',
        timeFormat: <TimeFormat>'utc',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message - utc`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.regex(stdoutCache, /info.*[a-zA-Z]{3}, \d{1,2} [a-zA-Z]{3} \d{4} \d{1,2}:\d{1,2}:\d{1,2} GMT.* Just an info message.*/)
});

test(`timeFormat - ms`, async t => {
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
        type: 'console',
        level: 'info',
        timeFormat: <TimeFormat>'ms',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message - ms`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.regex(stdoutCache, /info.*\[\d+\].* Just an info message.*/)
});

test(`timeFormat - iso`, async t => {
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
        type: 'console',
        level: 'info',
        timeFormat: <TimeFormat>'iso',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message - iso`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  // 2018-04-20T21:20:16.602Z
  t.regex(stdoutCache, /info.*\[[\d-]{10}T[\d:\.]{12}Z\].* Just an info message.*/)
});

test(`throws on unknown timeFormat`, t => {
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
        type: 'console',
        level: 'info',
        timeFormat: <TimeFormat>'junk',
        loggers: ['default']
      }
    }
  }
  let log;
  try {
    const instances = init(cfg);
    log = instances.loggers['default'].log;
    log.info(`Just an info message - junk`)
  } catch (err) {
    t.is(stdoutCache, '');
    t.regex(err.message, /Unknown timeFormat 'junk'/);
  } finally {
    log && log.end(); // need to trigger wind-up because process is not exiting
  }
  unhook();
});
