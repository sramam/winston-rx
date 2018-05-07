"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const base_1 = require("./base");
const formatter_1 = require("../formatter");
class SpinnerTransport extends base_1.Transport {
    constructor(cfg) {
        super(_.defaults(cfg, {
            type: 'console',
            name: 'default',
            level: 'info',
            colorize: true,
            timeFormat: 'iso',
            formatter: formatter_1.formatters['string'],
        }));
        const { type, level, name, loggers, levels, colorize, timeFormat, formatter, stream } = cfg, extra = __rest(cfg, ["type", "level", "name", "loggers", "levels", "colorize", "timeFormat", "formatter", "stream"]);
        _.defaults(this, {
            type,
            level,
            name,
            loggers,
            levels,
            colorize,
            timeFormat,
            formatter,
            stream,
            extra
        });
        this.extra = extra;
    }
    ;
    serialize(data) {
        const str = super.serialize(Object.assign({}, this.extra, data));
        process.stdout.write(str);
    }
}
exports.SpinnerTransport = SpinnerTransport;
