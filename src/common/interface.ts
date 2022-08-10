import { Logform, LoggerOptions, transports } from 'winston';
import { GeneralDailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

import { Transport } from './declare';

export interface Logger {
  log: (data: any, source: any) => void;
  info: (data: any, source: any) => void;
  debug: (data: any, source: any) => void;
  warn: (data: any, source: any) => void;
  error: (error: Error, extra: any, source: any) => void;
}

export interface LogFormatter {
  build: (name: string, env: string) => Logform.Format;
}

export interface LogTransport {
  build: (name: string, env: string, level: string, options?: Transport.TransportStreamOptions) => Transport;
}

export interface LogOptionsBuilder {
  build: (options: CreateOptions) => LoggerOptions;
}

export interface LogFactory {
  create: (options: CreateOptions) => Logger;
}

export interface LogLevelDict {
  [key: string]: 'info' | 'debug' | 'warn' | 'error';
}

export interface LogMessage {
  data: any;
  source?: string;
  isError: boolean;
}

export interface FileOptions extends transports.FileTransportOptions {
  createFilename?: (fileKey: string) => string;
}

export interface DailyRotateFileOptions extends GeneralDailyRotateFileTransportOptions {
  createFilename?: (fileKey: string) => string;
}

export interface CreateOptions extends LoggerOptions {
  env: string;
  name: string;
  mode: ('Console' | 'File' | 'DailyRotateFile')[];
  levelDict?: LogLevelDict;
  fileOptions?: FileOptions;
  dailyRotateFileOptions?: DailyRotateFileOptions;
  consoleOptions?: transports.ConsoleTransportOptions;
}
