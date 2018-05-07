
import { test } from 'ava';
import {
  init,
  Logger,
  TimeFormat
} from '..';


test(`invalid loglevel on logger`, async t => {
  const cfg = {
    loggers: {
      default: {
        name: 'default',
        levels: { end: 'pink', info: 'green' }
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
  try {
    init(cfg);
    t.fail(`expected failure here`)
  } catch (err) {
    t.snapshot(err.message);
  }
});

test(`out-of-order logger reuse`, async t => {
  const cfg = {
    loggers: {
      default: {
        stream: 'app'
      },
      app: {
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
  try {
    init(cfg);
    t.fail(`expected failure here`)
  } catch (err) {
    t.snapshot(err.message);
  }
});

test(`invalid logger stream`, async t => {
  const cfg = {
    name: 'default',
    stream: 'a stream'
  };
  try {
    new Logger(cfg);
    t.fail(`expected failure here`)
  } catch (err) {
    t.snapshot(err.message);
  }
});


test(`non-existant loglevel on transport`, async t => {
  const cfg = {
    loggers: {
      default: {
        name: 'default'
      }
    },
    transports: {
      default: {
        type: 'console',
        level: 'imaginary-level',
        timeFormat: <TimeFormat>'none',
        loggers: ['default']
      }
    }
  }
  try {
    init(cfg);
    t.fail(`expected failure here`)
  } catch (err) {
    t.snapshot(err.message);
  }
});

// test(`Unresolved logger`, async t => {
//   let stdoutCache = '';
//   const unhook = intercept(txt => {
//     stdoutCache += txt
//   });

//   const cfg = {
//     loggers: {
//       default: {
//         name: 'default'
//       }
//     },
//     transports: {
//       default: {
//         type: 'console',
//         level: 'info',
//         formatter: 'other',
//         timeFormat: <TimeFormat>'none',
//         loggers: ['default']
//       }
//     }
//   }

//   try {
//     new ConsoleTransport(<TransportConfig>cfg.transports.default);
//   } catch (err) {
//     t.regex(err.message, /Unresolved logger 'default'/, JSON2({err}));
//   }

//   unhook();
//   t.snapshot(stdoutCache, JSON2({stdoutCache}))
// });

// test(`Unknown formatter`, async t => {
//   let stdoutCache = '';
//   const unhook = intercept(txt => {
//     stdoutCache += txt
//   });

//   const cfg = {
//     loggers: {
//       default: {
//         name: 'default'
//       }
//     },
//     transports: {
//       default: {
//         type: 'console',
//         level: 'info',
//         formatter: 'other',
//         timeFormat: <TimeFormat>'none',
//         loggers: ['default']
//       }
//     }
//   }

//   try {
//     const logger = new Logger(cfg.loggers.default);
//     const transportCfg = <TransportConfig> cfg.transports.default;
//     transportCfg.loggers = [logger];
//     new ConsoleTransport(transportCfg);
//   } catch (err) {
//     t.regex(err.message, /Unknown formatter 'other'/, JSON2({err}));
//   }

//   unhook();
//   t.snapshot(stdoutCache, JSON2({stdoutCache}))
// });
