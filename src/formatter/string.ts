import { TransportData } from "../transport";
import * as chalk from 'chalk';
export function stringFormatter(data: TransportData): string {
  let { level, timestamp, name, color, msg, ...rest } = data;
  level = color ? chalk[color](`[${level}]`) : `[${level}]`;
  timestamp = timestamp ? `[${timestamp}]` : ``;
  // do not print the default logger name
  name = !name || name === 'default' ? `` : `[${name}]`;
  const rest_ = Object.keys(rest).length ? `  ${JSON.stringify(rest)}` : ``;
  return `${level}${timestamp}${name} ${msg}${rest_}\n`;
}
