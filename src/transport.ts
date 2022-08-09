import 'winston-daily-rotate-file';
import { transports } from 'winston';

import { DailyRotateFile, LogTransport } from './common';
import { ConsoleLogFormatter, FileLogFormatter } from './formatter';

export class ConsoleTransport implements LogTransport {
  public build(
    name: string,
    env: string,
    level: string,
    options?: transports.ConsoleTransportOptions,
  ) {
    const currentOptions = options || Object();
    const format = new ConsoleLogFormatter().build(name, env);

    return new transports.Console({ format, level, ...currentOptions });
  }
}

export class FileTransport implements LogTransport {
  public build(
    name: string,
    env: string,
    level: string,
    options?: transports.FileTransportOptions,
  ) {
    const currentOptions = options || Object();
    const format = new FileLogFormatter().build(name, env);

    return new transports.File({ format, level, ...currentOptions });
  }
}

export class DailyRotateFileTransport implements LogTransport {
  public build(
    name: string,
    env: string,
    level: string,
    options?: DailyRotateFile.DailyRotateFileTransportOptions,
  ) {
    const currentOptions = options || Object();
    const format = new FileLogFormatter().build(name, env);

    return new transports.DailyRotateFile({ format, level, ...currentOptions });
  }
}
