import { LoggerConfig, TransportConfig } from './index';
export { Logger, LoggerConfig, LogData } from './logger';
export { ConsoleTransport, coreTransports, FileTransport, TimeFormat, Transport, TransportConfig, TransportData } from './transport';
export { Formatter, formatters } from './formatter';
export { Levels, coreLevels } from './levels';
import { Formatter, Levels } from '.';
export interface LoggersConfig {
    loggers: {
        default?: LoggerConfig;
        [name: string]: LoggerConfig;
    };
    transports: {
        default: TransportConfig;
        [name: string]: TransportConfig;
    };
    formatters?: {
        [name: string]: string | Formatter;
    };
    levels?: {
        [name: string]: Levels;
    };
}
export declare const init: (cfg: LoggersConfig, transportMap?: {
    [name: string]: string;
}) => {
    loggers: {};
    transports: {};
};
