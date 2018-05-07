
import * as _ from 'lodash';
// import * as logupdate from 'log-update';
import {
  Transport,
  TransportConfig,
  TransportData
} from './base';
import {
  formatters
} from '../formatter';

export class SpinnerTransport extends Transport {
  extra: any;
  constructor(cfg: TransportConfig) {
    super(_.defaults(cfg, {
      type: 'console',
      name: 'default',
      level: 'info',
      // name:
      // loggers:
      // levels:
      colorize: true,
      timeFormat: 'iso',
      formatter: formatters['string'],
      // stream
    }));
    const {
      type,
      level,
      name,
      loggers,
      levels,
      colorize,
      timeFormat,
      formatter,
      stream,
      ...extra // this assignment is meant to pick out 'extra'
    } = cfg;
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
    this.extra = extra; // NOTE: this assignment is needed. Why?
  };

  serialize(data: TransportData): void {
    // data overwrites this.extra when there is overlap. Favour freshness.
    const str = super.serialize({ ...this.extra, ...data });
    process.stdout.write(<string>str);
  }
}
