import { FixedContext } from '@vodyani/core';
import { LoggerService } from '@nestjs/common';
import { Logger, createLogger } from 'winston';
import { convert, convertString } from '@vodyani/transformer';

import { BaseLoggerOptions } from '../common';

import { LoggerConsoleHandler } from './logger-console-handler';
import { LoggerDailyRotateFileHandler } from './logger-daily-rotate-file-handler';

export class BaseLogger implements LoggerService {
  private readonly name?: string;

  private readonly instance: Logger;

  constructor(options: BaseLoggerOptions) {
    const winstonOptions = this.getOptions(options);

    this.instance = createLogger(winstonOptions);

    this.name = convertString(options.name, 'FROM_BASE_LOGGER');
  }

  @FixedContext
  public log(data: any, source?: string) {
    this.info(data, source);
  }

  @FixedContext
  public info(data: any, source?: string) {
    this.instance.info({ source: this.getSource(source), data });
  }

  @FixedContext
  public warn(data: any, source?: string) {
    this.instance.warn({ source: this.getSource(source), data });
  }

  @FixedContext
  public error(error: Error, source?: string, extra?: any) {
    const { name, stack, message } = error;
    const data = { name, stack, message, extra };
    this.instance.error({ source: this.getSource(source), data });
  }

  @FixedContext
  private getOptions(options: BaseLoggerOptions) {
    const exitOnError = false;
    let transports: any[] = [];
    const { env, name, rotateFileLevel, enableRotateLog, enableConsoleLog, rotateFileDirPath, rotateFileOptions } = options;

    let handleExceptions = false;
    let exceptionHandlers: any = null;

    if (enableRotateLog) {
      const { loggers, errorLogger } = new LoggerDailyRotateFileHandler(
        env,
        name,
        rotateFileDirPath,
        rotateFileLevel,
        rotateFileOptions,
      ).create();

      transports = loggers;

      if (errorLogger) {
        handleExceptions = true;
        exceptionHandlers = errorLogger;
      }
    }

    if (enableConsoleLog) {
      transports.push(new LoggerConsoleHandler(env, name).create());
    }

    return { transports, exitOnError, handleExceptions, exceptionHandlers };
  }

  @FixedContext
  private getSource(source?: string) {
    return convert(source, this.name);
  }
}
