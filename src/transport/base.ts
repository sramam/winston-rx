import { BehaviorSubject, Subscription } from 'rxjs';
import * as _ from 'lodash';
import {
  Logger,
  LogData
} from '../logger';
import {
  Formatter
} from '../formatter';
import {
  Levels
} from '../levels';

export interface TransportData extends LogData {
  color?: string;
}

export type TimeFormat =
  'none' |
  'locale-date' |
  'locale-time' |
  'utc' |
  'ms' |
  'iso';

export interface TransportConfig {
  type: string;
  level: string;
  loggers: (string | Logger)[];
  name?: string;
  levels?: Levels;
  colorize?: boolean;
  timeFormat?: TimeFormat;
  formatter?: string | Formatter;
  stream?: BehaviorSubject<TransportData> | string;

  // any other transport config
  [k: string]: any;
}

export class Transport {
  level: string;
  levels: string | Levels;
  timeFormat: TimeFormat;
  colorize: boolean;
  private subscriptions: {
    [name: string]: Subscription;
  }
  name: string;
  formatter: Formatter;

  constructor(cfg: TransportConfig) {
    const {
      // type,
      // level,
      loggers,
      // name,
      // levels,
      // colorize,
      // timeFormat,
      // formatter,
      // stream,
      // ...rest
    } = cfg;

    // ensure all logger names have been mapped back to their instances
    // loggers.forEach(l => {
    //   if (typeof l === 'string') {
    //     throw new Error(`Unresolved logger '${l}'`);
    //   }
    // });

    _.defaults(this, cfg, {
      // level,
      timeFormat: 'utc',
      colorize: true,
      name: this.constructor.name,
      subscriptions: []
    });
    // subscriptions should be done after the object is initialized
    (<Logger[]>loggers).forEach(l => this.subscribe(l));
  }

  serialize(data: TransportData): string | void {
    data.timestamp = this.timestamp(data);
    return (this.formatter)(data);
  }

  protected timestamp(data): string {
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

  subscribe(logger: Logger) {
    const levels = Object.keys(logger.levels);
    if (-1 === levels.indexOf(this.level)) {
      throw new Error(
        `logger level mismatch '${levels}' is missing '${this.level}'`);
    }

    this.subscriptions[logger.name] = logger.subscribe({
      next: logData => {
        //
        this.levels = logger.levels;
        const { level } = logData;
        const colors = logger.levels;
        // NOTE: Relies on object key order.
        const color = this.colorize
          ? colors[level]
          : null;
        const loggerLevel = levels.indexOf(logData.level);
        const transportLevel = levels.indexOf(this.level);
        if (loggerLevel <= transportLevel) {
          this.serialize({ ...logData, color, })
        }
      },
      error:
        /* istanbul ignore next */
        err => this.unsubscribe(logger),
      complete: () => this.unsubscribe(logger)
    });
  }

  unsubscribe(logger: Logger): boolean {
    return this._unsubscribe(logger.name);
  }

  private _unsubscribe(name: string): boolean {
    const subscription = this.subscriptions[name];
    subscription.unsubscribe();
    delete this.subscriptions[name];
    return Object.keys(this.subscriptions).length === 0;
    // in derived classes, if we have no more loggers.
    // close/complete any down-'streams' as needed.
    // typically, unsubscribes should happen on error(s) or process.exit.
  }

  unsubscribeAll() {
    return Object.keys(this.subscriptions).reduce(
      (sum: { [name: string]: boolean }, name: string) => {
        sum[name] = this._unsubscribe(name);
        return sum;
      }, <{ [name: string]: boolean }>{});
  }
}
