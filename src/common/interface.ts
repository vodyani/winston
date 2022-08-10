import { Logform, transports } from 'winston';
import { GeneralDailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

import { LogOptions } from './type';
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
  build: (options: CreateOptions) => LogOptions;
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

export interface FileOptions extends Omit<transports.FileTransportOptions, 'level'> {
  customFilename?: (fileKey: string) => string;
}

export interface DailyRotateFileOptions extends Omit<GeneralDailyRotateFileTransportOptions, 'level'> {
  customFilename?: (fileKey: string) => string;
}

export interface CreateOptions extends LogOptions {
  /**
   * The server-side environment variable to which the log belongs.
   */
  env: string;
  /**
   * The name of the log, which will be used in some default value assignment.
   */
  name: string;
  /**
   * Log output mode (allowing combined use), currently only supported:
   *
   * 1. 'Console' output to console.
   * 2. 'File' output to log file.
   * 3. 'DailyRotateFile' output to log file (collected daily).
   */
  mode: ('Console' | 'File' | 'DailyRotateFile')[];
  /**
   * Log level dictionary, allowing you to use custom aliases to describe the corresponding levels.
   *
   * This parameter is useful in scenarios where custom log file names are needed!
   *
   * @default
   * ```ts
   *  { error: 'error', access: 'debug' };
   * ```
   */
  levelDict?: LogLevelDict;
  /**
   * Configuration options for exporting to the console.
   */
  consoleOptions?: Omit<transports.ConsoleTransportOptions, 'level'>;
  /**
   * Configuration options for exporting to the specified file.
   *
   * @tips If dirname is not specified, then the default output is in the `./logs` directory
   */
  fileOptions?: FileOptions;
  /**
   * Configuration options for exporting to the specified file.
   *
   * Logs are divided by day dimension and log files can be compressed
   *
   * @tips If dirname is not specified, then the default output is in the `./logs` directory
   */
  dailyRotateFileOptions?: DailyRotateFileOptions;
}
