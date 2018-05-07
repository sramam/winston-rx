import { Transport, TransportConfig, TransportData } from './base';
export declare class SpinnerTransport extends Transport {
    extra: any;
    constructor(cfg: TransportConfig);
    serialize(data: TransportData): void;
}
