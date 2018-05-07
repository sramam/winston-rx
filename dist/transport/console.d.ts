import { Transport, TransportConfig, TransportData } from './base';
export declare class ConsoleTransport extends Transport {
    extra: any;
    constructor(cfg: TransportConfig);
    serialize(data: TransportData): void;
}
