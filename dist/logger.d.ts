import { Subject, Subscription } from 'rxjs';
import { Levels } from './levels';
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
export declare class Logger {
    levels: Levels;
    name: string;
    extra: any;
    stream: Subject<LogData>;
    private paused;
    private logger;
    constructor(cfg: LoggerConfig);
    pause(): void;
    resume(): void;
    readonly log: {
        [name: string]: (msg: string, data?: any) => void;
        end: () => any;
        pause: () => void;
        resume: () => void;
    };
    subscribe({next, error, complete}: {
        next: (value: LogData) => void;
        error?: (error: any) => void;
        complete?: () => void;
    }): Subscription;
    clone(cfg: LoggerConfig): Logger;
}
