"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmLevels = {
    silent: 'none',
    error: 'red',
    warn: 'yellow',
    notice: 'green',
    http: 'green',
    timing: 'green',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta'
};
exports.syslogLevels = {
    emerg: 'red',
    alert: 'yellow',
    crit: 'red',
    error: 'red',
    warning: 'red',
    notice: 'yellow',
    info: 'green',
    debug: 'blue'
};
exports.pythonLevels = {
    notset: 'none',
    critical: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    debug: 'blue'
};
exports.rubyLevels = {
    unknown: 'white',
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue'
};
exports.log4jLevels = {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'cyan'
};
exports.coreLevels = {
    npm: exports.npmLevels,
    npmLevels: exports.npmLevels,
    syslog: exports.syslogLevels,
    syslogLevels: exports.syslogLevels,
    python: exports.pythonLevels,
    pythonLevels: exports.pythonLevels,
    ruby: exports.rubyLevels,
    rubyLevels: exports.rubyLevels,
    log4j: exports.log4jLevels,
    log4jLevels: exports.log4jLevels
};
