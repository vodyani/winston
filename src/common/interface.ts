import { Logform, LoggerOptions, transports } from 'winston';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

import { Transport } from './declare';

export interface LogFormatter {
  build: (name: string, env: string) => Logform.Format;
}

export interface LogTransport {
  build: (name: string, env: string, level: string, options?: Transport.TransportStreamOptions) => Transport;
}

export interface LogLevelDict {
  [key: string]: 'info' | 'debug' | 'warn' | 'error';
}

export interface LogMessage {
  data: any;
  isError: boolean;
}

export interface CreateOptions extends LoggerOptions {
  env: string;
  name: string;
  mode: ('Console' | 'File' | 'DailyRotateFile')[];
  fileLevelDict?: LogLevelDict;
  fileNameCallback?: (fileKey: string) => string;
  transportOptions?: transports.ConsoleTransportOptions | transports.FileTransportOptions | DailyRotateFileTransportOptions;
}
