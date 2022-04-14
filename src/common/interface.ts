import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

export interface LevelConfig {
  [key: string]: ('log' | 'info' | 'warn' | 'error')[];
}

export interface BaseLoggerOptions {
  env: string;
  name: string;
  enableRotateLog?: boolean;
  enableConsoleLog?: boolean;
  rotateFileDirPath?: string;
  rotateFileLevel?: LevelConfig;
  rotateFileOptions?: DailyRotateFileTransportOptions;
}
