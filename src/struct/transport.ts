import 'winston-daily-rotate-file';
import { transports } from 'winston';

import { DailyRotateFile, DailyRotateFileOptions, ILoggerTransport } from '../common';

import { ConsoleLogFormatter, FileLogFormatter } from './formatter';

export class ConsoleTransport implements ILoggerTransport {
  public build(
    name: string,
    env: string,
    level: string,
    options?: transports.ConsoleTransportOptions,
  ) {
    const format = new ConsoleLogFormatter().build(name, env);
    return new transports.Console({ ...options, format, level });
  }
}

export class FileTransport implements ILoggerTransport {
  public build(
    name: string,
    env: string,
    level: string,
    options: transports.FileTransportOptions,
  ) {
    const format = new FileLogFormatter().build(name, env);
    return new transports.File({ ...options, format, level });
  }
}

export class DailyRotateFileTransport implements ILoggerTransport {
  public build(
    name: string,
    env: string,
    level: string,
    options: DailyRotateFileOptions,
  ) {
    const format = new FileLogFormatter().build(name, env);
    return new transports.DailyRotateFile({ ...options, format, level } as unknown as DailyRotateFile.DailyRotateFileTransportOptions);
  }
}
