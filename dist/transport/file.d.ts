import { Transport, TransportConfig, TransportData } from './base';
import { Formatter } from '../formatter';
import { Logger } from '../Logger';
export interface FileTransportConfig extends TransportConfig {
    fname: string;
    autoclose?: boolean;
    encoding?: string;
    fstream?: any;
    suffix?: string;
    size?: string;
    compress?: 'gzip';
}
export declare class FileTransport extends Transport {
    fname: string;
    encoding: string;
    fstream: any;
    suffix: string;
    size: string;
    compress: 'gzip';
    autoclose: boolean;
    formatter: Formatter;
    extra: any;
    constructor(cfg: FileTransportConfig);
    serialize(data: TransportData): void;
    unsubscribe(logger: Logger): boolean;
}
