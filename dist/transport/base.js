"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Transport {
    constructor(cfg) {
        const { loggers, } = cfg;
        _.defaults(this, cfg, {
            timeFormat: 'utc',
            colorize: true,
            name: this.constructor.name,
            subscriptions: []
        });
        loggers.forEach(l => this.subscribe(l));
    }
    serialize(data) {
        data.timestamp = this.timestamp(data);
        return (this.formatter)(data);
    }
    timestamp(data) {
        const { timestamp } = data;
        switch (this.timeFormat) {
            case 'none':
                return undefined;
            case 'locale-date':
                return new Date(timestamp).toLocaleDateString();
            case 'locale-time': {
                const date = new Date(timestamp);
                const ms = `000${date.getMilliseconds()}`.split('').splice(-3).join('');
                return `${date.toLocaleTimeString()}.${ms}`;
            }
            case 'utc':
                return new Date(timestamp).toUTCString();
            case 'ms':
                return (new Date(timestamp).getTime()).toString();
            case 'iso':
                return new Date(timestamp).toISOString();
            default:
                throw new Error(`Unknown timeFormat '${this.timeFormat}'`);
        }
    }
    subscribe(logger) {
        const levels = Object.keys(logger.levels);
        if (-1 === levels.indexOf(this.level)) {
            throw new Error(`logger level mismatch '${levels}' is missing '${this.level}'`);
        }
        this.subscriptions[logger.name] = logger.subscribe({
            next: logData => {
                this.levels = logger.levels;
                const { level } = logData;
                const colors = logger.levels;
                const color = this.colorize
                    ? colors[level]
                    : null;
                const loggerLevel = levels.indexOf(logData.level);
                const transportLevel = levels.indexOf(this.level);
                if (loggerLevel <= transportLevel) {
                    this.serialize(Object.assign({}, logData, { color }));
                }
            },
            error: err => this.unsubscribe(logger),
            complete: () => this.unsubscribe(logger)
        });
    }
    unsubscribe(logger) {
        return this._unsubscribe(logger.name);
    }
    _unsubscribe(name) {
        const subscription = this.subscriptions[name];
        subscription.unsubscribe();
        delete this.subscriptions[name];
        return Object.keys(this.subscriptions).length === 0;
    }
    unsubscribeAll() {
        return Object.keys(this.subscriptions).reduce((sum, name) => {
            sum[name] = this._unsubscribe(name);
            return sum;
        }, {});
    }
}
exports.Transport = Transport;
