
import * as node_path from 'path';
import * as _ from 'lodash';
import * as rfs from 'rotating-file-stream';
import {
  Transport,
  TransportConfig,
  TransportData
} from './base';
import {
  formatters,
  Formatter
} from '../formatter';
import {
  Logger
} from '../Logger';


export interface FileTransportConfig extends TransportConfig {
  fname: string,
  autoclose?: boolean;
  encoding?: string,
  fstream?: any,
  suffix?: string,
  size?: string,
  compress?: 'gzip'
}

export class FileTransport extends Transport {
  fname: string;
  encoding: string;
  fstream: any; // rfs stream
  suffix: string;
  size: string;
  compress: 'gzip';
  autoclose: boolean;
  formatter: Formatter;
  extra: any;

  constructor(cfg: FileTransportConfig) {

    super(_.defaults(cfg, {
      type: 'file',
      name: 'default',
      level: 'warn',
      // name:
      // loggers:
      // levels:
      colorize: false,
      timeFormat: 'iso',
      formatter: formatters['json'],
      // stream
      // fname,
      autoclose: true,
      encoding: 'utf8',
      // fstream,
      suffix: '-rotations',
      size: '10M',
      compress: 'gzip'
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
      fname,
      autoclose,
      encoding,
      fstream,
      suffix,
      size,
      compress,
      ...extra
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

    const { base, dir } = node_path.parse(fname)
    const pad = n => `${(n > 9 ? '' : '0')}${n}`;
    const path = dir;
    this.fstream = fstream || rfs((time, index) => {
      if (!time) return base;
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
    /* istanbul ignore next */
    this.fstream.on('error', err => {
      err.fname = this.fname;
      console.error(`FileTransport: ${err}`, JSON.stringify(err, null, 2));
    });
  };

  serialize(data: TransportData): void {
    this.fstream.write(super.serialize({...this.extra, ...data}));
  }

  unsubscribe(logger: Logger): boolean {
    const wasLastLogger = super.unsubscribe(logger);
    if (wasLastLogger && this.autoclose) {
      // close the file stream
      this.fstream.end();
    }
    return wasLastLogger;
  };
}
