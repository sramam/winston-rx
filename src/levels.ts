
export interface Levels {
  [level: string]: string;
}

// relies on ES6 properties that keys are iterated in order inserted.
// see if all levels are not strings: https://bit.ly/2JYIvwm
export const npmLevels: Levels = {
  silent: 'none',
  error: 'red',
  warn: 'yellow',
  notice: 'green',
  http: 'green',
  timing: 'green',
  info: 'green',
  verbose: 'cyan',
  silly: 'magenta'
}

export const syslogLevels: Levels = {
  emerg: 'red',
  alert: 'yellow',
  crit: 'red',
  error: 'red',
  warning: 'red',
  notice: 'yellow',
  info: 'green',
  debug: 'blue'
}

// https://docs.python.org/2/library/logging.html#logging-levels
export const pythonLevels: Levels = {
  notset: 'none',
  critical: 'red',
  error: 'red',
  warning: 'yellow',
  info: 'green',
  debug: 'blue'
}

// https://ruby-doc.org/stdlib-2.1.0/libdoc/logger/rdoc/Logger.html#class-Logger-label-Description
export const rubyLevels: Levels = {
  unknown: 'white',  // An unknown message that should always be logged.
  fatal: 'red',  // An unhandleable error that results in a program crash.
  error: 'red', // A handleable error condition.
  warn: 'yellow', // A warning.
  info: 'green', // Generic (useful) information about system operation.
  debug: 'blue' // Low-level information for developers.
}


export const log4jLevels: Levels = {
  fatal: 'red',
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
  trace: 'cyan'
}

// https://en.wikipedia.org/wiki/Java_logging_framework
export const coreLevels = {
  npm: npmLevels,
  npmLevels,
  syslog: syslogLevels,
  syslogLevels,
  python: pythonLevels,
  pythonLevels,
  ruby: rubyLevels,
  rubyLevels,
  log4j: log4jLevels,
  log4jLevels
}
