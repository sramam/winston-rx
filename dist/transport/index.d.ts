import { ConsoleTransport, FileTransport } from './index';
export { Transport, TransportConfig, TransportData, TimeFormat } from './base';
export { ConsoleTransport } from './console';
export { FileTransport } from './file';
export declare const coreTransports: {
    'file': typeof FileTransport;
    'console': typeof ConsoleTransport;
};
