import { Subject, Subscription } from 'rxjs';
import * as _ from 'lodash';
import {
  Levels,
  npmLevels,
  coreLevels
} from './levels';

export interface LoggerConfig {
  levels?: string | Levels;
  name?: string;
  paused?: boolean;
  [k: string]: any;
  stream?: string | Subject<LogData>;
}

export interface LogData {
  level: string;
  timestamp: number | string;
  msg: string;
  [k: string]: any;
}

type LogFn = (msg: string, data?: any) => void;
type LogMethods = {
  end: () => any,
  pause: () => void,
  resume: () => void,
  [name: string]: LogFn
};
export class Logger {

  levels: Levels;
  name: string;
  extra: any;
  stream: Subject<LogData>;
  private paused: boolean;

  private logger: LogMethods;

  constructor(cfg: LoggerConfig) {
    let { levels, name, stream, paused, ...extra } = cfg;
    levels = typeof levels === 'string' ? coreLevels[levels] : levels;

    _.defaults(this, {
      levels,
      name,
      stream,
      paused,
      extra
    }, {
        stream: new Subject<LogData>(),
        levels: npmLevels,
        paused: false
      });

    if (typeof this.stream === 'string') {
      throw new Error(`Please resolve logger stream to reuse. '${this.stream}'`)
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
            this.stream.next({
              level,
              name,
              msg,
              timestamp: Date.now(),
              ...extra, //  pass the extra context back in.
              ...data // data overwrites any overlap w/ extra. favour freshness.
            });
          }
        }
        return logger;
      }, <LogMethods>{
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

  subscribe({
    next,
    error,
    complete
  }: {
      next: (value: LogData) => void,
      error?: (error: any) => void,
      complete?: () => void
    }
  ): Subscription {
    return this.stream.subscribe(next, error, complete);
  }


  clone(cfg: LoggerConfig): Logger {
    cfg.stream = this.stream;
    return new Logger(cfg);
  }

}
