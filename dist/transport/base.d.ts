import { BehaviorSubject } from 'rxjs';
import { Logger, LogData } from '../logger';
import { Formatter } from '../formatter';
import { Levels } from '../levels';
export interface TransportData extends LogData {
    color?: string;
}
export declare type TimeFormat = 'none' | 'locale-date' | 'locale-time' | 'utc' | 'ms' | 'iso';
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
    [k: string]: any;
}
export declare class Transport {
    level: string;
    levels: string | Levels;
    timeFormat: TimeFormat;
    colorize: boolean;
    private subscriptions;
    name: string;
    formatter: Formatter;
    constructor(cfg: TransportConfig);
    serialize(data: TransportData): string | void;
    protected timestamp(data: any): string;
    subscribe(logger: Logger): void;
    unsubscribe(logger: Logger): boolean;
    private _unsubscribe(name);
    unsubscribeAll(): {
        [name: string]: boolean;
    };
}
