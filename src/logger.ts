import { This } from '@vodyani/utils';
import { createLogger, Logger as Base, LoggerOptions } from 'winston';

import { Logger } from './common';

export class Winston implements Logger {
  private readonly instance: Base;

  constructor(options: LoggerOptions) {
    this.instance = createLogger(options);
  }

  @This
  public log(data: any, source?: string) {
    this.instance.info({ data, source, isError: false });
  }

  @This
  public info(data: any, source?: string) {
    this.instance.info({ data, source, isError: false });
  }

  @This
  public warn(data: any, source?: string) {
    this.instance.warn({ data, source, isError: false });
  }

  @This
  public debug(data: any, source?: string) {
    this.instance.debug({ data, source, isError: false });
  }

  @This
  public error(error: Error, extra?: any, source?: any) {
    const data = {
      extra: extra || '',
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    this.instance.error({ data, source, isError: true });
  }
}
