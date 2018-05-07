import {
  coreLevels,
  coreTransports,
  formatters,
  Logger,
  LoggerConfig,
  TransportConfig
} from './index';

export {
  Logger,
  LoggerConfig,
  LogData
} from './logger';
export {
  ConsoleTransport,
  coreTransports,
  FileTransport,
  TimeFormat,
  Transport,
  TransportConfig,
  TransportData
} from './transport';
export {
  Formatter,
  formatters
} from './formatter';
export {
  Levels,
  coreLevels
} from './levels';

import { Formatter, Levels } from '.';

export interface LoggersConfig {
  loggers: {
    default?: LoggerConfig;
    [name: string]: LoggerConfig;
  },
  transports: {
    default: TransportConfig;
    [name: string]: TransportConfig;
  },
  formatters?: {
    [name: string]: string | Formatter;
  },
  levels?: {
    [name: string]: Levels;
  }
}

type TransportMap = {
  [name: string]: string | Transport;
}
export const init = (cfg: LoggersConfig, transportMap?: TransportMap) => {

  const allTransports = { ...coreTransports, ...transportMap };
  const allFormatters = { ...formatters, ...cfg.formatters };
  const allLevels = { ...coreLevels, ...cfg.levels };
  let loggers = {};
  for (let name in cfg.loggers) {
    const l = cfg.loggers[name];
    l.name = name;
    let { stream, levels } = l;
    l.levels = typeof levels === 'string' ? allLevels[levels] : levels;
    if (stream && typeof stream === 'string') {
      if (!(stream in loggers)) {
        throw new Error(`To reuse logger streams, '${stream}' has to preceed '${name}'`)
      }
      l.stream = loggers[stream].stream;
    }
    loggers[l.name] = new Logger(l);
  }

  let transports = {};
  for (let name in cfg.transports) {
    const t = cfg.transports[name];
    const { stream, formatter } = t;
    t.name = name;
    t.formatter = typeof formatter === 'string'
      ? allFormatters[formatter]
      : t.formatter;
    t.stream = typeof stream === 'string'
      ? transports[stream].stream
      : stream;
    t.loggers = t.loggers.map(l => {
      return (typeof l === 'string') ? loggers[l] : l;
    });
    transports[name] = new allTransports[t.type](t);
  }
  return { loggers, transports };
}
