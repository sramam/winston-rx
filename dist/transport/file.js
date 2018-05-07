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
const node_path = require("path");
const _ = require("lodash");
const rfs = require("rotating-file-stream");
const base_1 = require("./base");
const formatter_1 = require("../formatter");
class FileTransport extends base_1.Transport {
    constructor(cfg) {
        super(_.defaults(cfg, {
            type: 'file',
            name: 'default',
            level: 'warn',
            colorize: false,
            timeFormat: 'iso',
            formatter: formatter_1.formatters['json'],
            autoclose: true,
            encoding: 'utf8',
            suffix: '-rotations',
            size: '10M',
            compress: 'gzip'
        }));
        const { type, level, name, loggers, levels, colorize, timeFormat, formatter, stream, fname, autoclose, encoding, fstream, suffix, size, compress } = cfg, extra = __rest(cfg, ["type", "level", "name", "loggers", "levels", "colorize", "timeFormat", "formatter", "stream", "fname", "autoclose", "encoding", "fstream", "suffix", "size", "compress"]);
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
            fname,
            autoclose,
            encoding,
            fstream,
            suffix,
            size,
            compress,
            extra
        });
        this.extra = extra;
        const { base, dir } = node_path.parse(fname);
        const pad = n => `${(n > 9 ? '' : '0')}${n}`;
        const path = dir;
        this.fstream = fstream || rfs((time, index) => {
            if (!time)
                return base;
            time = new Date(time);
            const month = `${time.getFullYear()}${pad(parseInt(time.getMonth()) + 1)}`;
            const [day, hour, minute, seconds] = [
                pad(time.getDate()),
                pad(time.getHours()),
                pad(time.getMinutes()),
                pad(time.getSeconds())
            ];
            return `${base}${suffix}/${month}${day}_${hour}.${minute}.${seconds}.zip`;
        }, { size: this.size, compress: this.compress, path });
        this.fstream.on('error', err => {
            err.fname = this.fname;
            console.error(`FileTransport: ${err}`, JSON.stringify(err, null, 2));
        });
    }
    ;
    serialize(data) {
        this.fstream.write(super.serialize(Object.assign({}, this.extra, data)));
    }
    unsubscribe(logger) {
        const wasLastLogger = super.unsubscribe(logger);
        if (wasLastLogger && this.autoclose) {
            this.fstream.end();
        }
        return wasLastLogger;
    }
    ;
}
exports.FileTransport = FileTransport;
