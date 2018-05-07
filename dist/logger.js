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
const rxjs_1 = require("rxjs");
const _ = require("lodash");
const levels_1 = require("./levels");
class Logger {
    constructor(cfg) {
        let { levels, name, stream, paused } = cfg, extra = __rest(cfg, ["levels", "name", "stream", "paused"]);
        levels = typeof levels === 'string' ? levels_1.coreLevels[levels] : levels;
        _.defaults(this, {
            levels,
            name,
            stream,
            paused,
            extra
        }, {
            stream: new rxjs_1.Subject(),
            levels: levels_1.npmLevels,
            paused: false
        });
        if (typeof this.stream === 'string') {
            throw new Error(`Please resolve logger stream to reuse. '${this.stream}'`);
        }
        for (let kw of ['end', 'resume', 'pause']) {
            if (-1 < Object.keys(this.levels).indexOf(kw)) {
                throw new Error(`'${kw}' is a reserved word for log levels.`);
            }
        }
        this.logger = Object.keys(this.levels)
            .reduce((logger, level) => {
            logger[level] = (msg, data) => {
                if (!this.paused) {
                    this.stream.next(Object.assign({ level,
                        name,
                        msg, timestamp: Date.now() }, extra, data));
                }
            };
            return logger;
        }, {
            end: () => {
                this.stream.complete();
            },
            pause: () => this.pause(),
            resume: () => this.resume(),
        });
    }
    pause() {
        this.paused = true;
    }
    resume() {
        this.paused = false;
    }
    get log() {
        return this.logger;
    }
    subscribe({ next, error, complete }) {
        return this.stream.subscribe(next, error, complete);
    }
    clone(cfg) {
        cfg.stream = this.stream;
        return new Logger(cfg);
    }
}
exports.Logger = Logger;
