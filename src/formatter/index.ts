
import { TransportData } from '../transport/base';

export type Formatter = ((data: TransportData) => string);
import { jsonFormatter } from './json';
import { stringFormatter } from './index';
export { stringFormatter } from './string';

export const formatters = {
  'json': jsonFormatter,
  'string': stringFormatter
};
