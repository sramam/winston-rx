
import { test } from 'ava';
import * as intercept from 'intercept-stdout';
import {
  init,
  TimeFormat,
  Logger,
  ConsoleTransport,
  TransportConfig
} from '..';

const JSON2 = j => JSON.stringify(j, null, 2);

test(`logger - console transport - info`, async t => {
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
  log.info(`Just an info message`)
  log.error(`this is a mock error for testing`)
  log.silly(`It' silly how much information one can log`, { a: 1 })
  log.silly(`It' silly how much information one can log`, { b: 2 })
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.snapshot(stdoutCache, JSON2({ stdoutCache }));
});

test(`logger - console transport - silly`, async t => {
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
        level: 'silly',
        timeFormat: <TimeFormat>'none',
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
  t.snapshot(stdoutCache, JSON2({ stdoutCache }));
});

test(`multiple loggers and transports (m:n)`, async t => {
  // let stdoutCache = '';
  // const unhook = intercept(txt => {
  //   stdoutCache += txt
  // });

  const cfg = {
    loggers: {
      default: {
        name: 'default'
      },
      app: {
        name: 'app',
        logger: 'app extra',
        logger2: 'app',
        stream: 'default'
      },
      debugLog: {
        name: 'debugLog'
      }
    },
    transports: {
      default: {
        type: 'console',
        level: 'silly',
        name: 'console2',
        timeFormat: <TimeFormat>'none',
        formatter: 'string',
        colorize: true,
        loggers: ['default'],
        transport: 'console2 extra',
        transport1: 'console2'
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  const app = instances.loggers['app'].log;
  log.info(`Just an info message`)
  app.info(`App logger message`)
  log.end(); // need to trigger wind-up because process is not exiting
  // unhook();
  // t.snapshot(stdoutCache, JSON2({ stdoutCache }));
  t.pass();
});

test(`unsubscribe all`, async t => {
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
        name: 'app',
        logger: 'app extra',
        logger2: 'app'
      },
      debugLog: {
        name: 'debugLog'
      }
    },
    transports: {
      default: {
        type: 'console',
        level: 'silly',
        name: 'console2',
        timeFormat: <TimeFormat>'none',
        formatter: 'string',
        colorize: true,
        loggers: ['default', 'app'],
        transport: 'console2 extra',
        transport1: 'console2'
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  const app = instances.loggers['app'].log;
  const transport = instances.transports['default'];
  transport.unsubscribeAll();
  log.info(`Just an info message`)
  app.info(`App logger message`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  // should see no stdout/stderr on stdout
  t.is(stdoutCache, '');
});

test(`pause/resume`, async t => {
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
  log.info(`Just an info message 1`)
  log.pause();
  log.info(`Just an info message 2`)
  log.resume();
  log.info(`Just an info message 3`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.snapshot(stdoutCache, JSON2({ stdoutCache }));
});


test(`clone`, async t => {
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
  const logger = instances.loggers['default'];
  const log = logger.log;
  log.info(`Just an info message 1`)
  const app = logger.clone({
    name: 'app',
    extra: 'extra info'
  }).log
  app.info(`App message`);
  log.info(`Just an info message 2`);
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.snapshot(stdoutCache, JSON2({ stdoutCache }));
});

test(`explicitly set logger in transport`, async t => {
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {}
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
  const logger = new Logger(cfg.loggers.default);
  const transportCfg = <TransportConfig>cfg.transports.default;
  transportCfg.loggers = [logger];
  /* const transport = */ new ConsoleTransport(transportCfg);
  const log = logger.log;
  log.info(`Just an info message`, {});
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.snapshot(stdoutCache, JSON2({ stdoutCache }));
});


test(`reuse transport stream`, async t => {
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {
      },
      app: {
        stream: 'default'
      }
    },
    transports: {
      default: {
        type: 'console',
        level: 'info',
        timeFormat: <TimeFormat>'none',
        loggers: ['default']
      },
      transport2: {
        type: 'console',
        name: 'transport2',
        level: 'error',
        timeFormat: <TimeFormat>'none',
        loggers: [],
        stream: 'default'
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.info(`Just an info message`);
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.snapshot(stdoutCache, JSON2({ stdoutCache }));
});

test(`loglevels - syslogLevels - direct initialization`, async t => {
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {
        levels: 'syslogLevels'
      }
    },
    transports: {
      default: {
        type: 'console',
        level: 'alert',
        timeFormat: <TimeFormat>'none',
        loggers: ['default']
      }
    }
  }
  const logger = new Logger(cfg.loggers.default);
  const transportCfg = <TransportConfig>cfg.transports.default;
  transportCfg.loggers = [logger];
  /* const transport = */ new ConsoleTransport(transportCfg);
  const log = logger.log;
  log.alert(`this is a mock alert for testing`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.snapshot(stdoutCache, JSON2({ stdoutCache }));
});

test(`loglevels - syslogLevels - init()`, async t => {
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
      default: {
        levels: 'syslogLevels'
      }
    },
    transports: {
      default: {
        type: 'console',
        level: 'alert',
        timeFormat: <TimeFormat>'none',
        loggers: ['default']
      }
    }
  }
  const instances = init(cfg);
  const log = instances.loggers['default'].log;
  log.alert(`this is a mock alert for testing`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.snapshot(stdoutCache, JSON2({ stdoutCache }));
});

test(`init with externally created log`, async t => {
  let stdoutCache = '';
  const unhook = intercept(txt => {
    stdoutCache += txt
  });

  const cfg = {
    loggers: {
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
  const logger = new Logger({name: 'otherLogger'});
  const transportCfg = <TransportConfig>cfg.transports.default;
  transportCfg.loggers = [logger];
  /* const instances = */ init(cfg);
  const log = logger.log;
  log.info(`Just a info log`)
  log.end(); // need to trigger wind-up because process is not exiting
  unhook();
  t.snapshot(stdoutCache, JSON2({ stdoutCache }));
});
