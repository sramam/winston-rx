import { TransportData } from '../transport/base';
export declare type Formatter = ((data: TransportData) => string);
export { stringFormatter } from './string';
export declare const formatters: {
    'json': (data: TransportData) => string;
    'string': (data: TransportData) => string;
};
