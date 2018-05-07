"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
var logger_1 = require("./logger");
exports.Logger = logger_1.Logger;
var transport_1 = require("./transport");
exports.ConsoleTransport = transport_1.ConsoleTransport;
exports.coreTransports = transport_1.coreTransports;
exports.FileTransport = transport_1.FileTransport;
exports.Transport = transport_1.Transport;
var formatter_1 = require("./formatter");
exports.formatters = formatter_1.formatters;
var levels_1 = require("./levels");
exports.coreLevels = levels_1.coreLevels;
exports.init = (cfg, transportMap) => {
    const allTransports = Object.assign({}, index_1.coreTransports, transportMap);
    const allFormatters = Object.assign({}, index_1.formatters, cfg.formatters);
    const allLevels = Object.assign({}, index_1.coreLevels, cfg.levels);
    let loggers = {};
    for (let name in cfg.loggers) {
        const l = cfg.loggers[name];
        l.name = name;
        let { stream, levels } = l;
        l.levels = typeof levels === 'string' ? allLevels[levels] : levels;
        if (stream && typeof stream === 'string') {
            if (!(stream in loggers)) {
                throw new Error(`To reuse logger streams, '${stream}' has to preceed '${name}'`);
            }
            l.stream = loggers[stream].stream;
        }
        loggers[l.name] = new index_1.Logger(l);
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
};
