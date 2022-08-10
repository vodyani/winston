import 'winston-daily-rotate-file';
import { transports } from 'winston';

import { DailyRotateFile, DailyRotateFileOptions, LogTransport } from './common';
import { ConsoleLogFormatter, FileLogFormatter } from './formatter';

export class ConsoleTransport implements LogTransport {
  public build(
    name: string,
    env: string,
    level: string,
    options?: transports.ConsoleTransportOptions,
  ) {
    const format = new ConsoleLogFormatter().build(name, env);
    return new transports.Console({ format, level, ...options });
  }
}

export class FileTransport implements LogTransport {
  public build(
    name: string,
    env: string,
    level: string,
    options: transports.FileTransportOptions,
  ) {
    const format = new FileLogFormatter().build(name, env);
    return new transports.File({ format, level, ...options });
  }
}

export class DailyRotateFileTransport implements LogTransport {
  public build(
    name: string,
    env: string,
    level: string,
    options: DailyRotateFileOptions,
  ) {
    const format = new FileLogFormatter().build(name, env);
    return new transports.DailyRotateFile({ format, level, ...options } as unknown as DailyRotateFile.DailyRotateFileTransportOptions);
  }
}
