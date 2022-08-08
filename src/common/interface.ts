import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

export interface LevelDict {
  [key: string]: ('log' | 'info' | 'debug' | 'warn' | 'error')[];
}

export interface LoggerCreateOptions {
  env: string;
  name: string;
  enableFile: boolean;
  enableConsole: boolean;
  fileLevelDict?: LevelDict;
  fileNameCallback?: (fileKey: string) => string;
  fileTransportOptions?: DailyRotateFileTransportOptions;
}

export interface LoggerFormatOptions {
  env: string;
  name: string;
  isConsole: boolean;
}
