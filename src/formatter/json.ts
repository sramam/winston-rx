import { TransportData } from "../transport";

export function jsonFormatter(data: TransportData): string {
  let { name, ...rest } = data;
  name = name === 'default' ? undefined : name;
  return JSON.stringify({ name, ...rest });
}
