import { This } from '@vodyani/utils';
import { createLogger, Logger as Base, LoggerOptions } from 'winston';

import { Logger } from './common';

export class Winston implements Logger {
  private readonly instance: Base;

  constructor(options: LoggerOptions) {
    this.instance = createLogger(options);
  }

  @This
  public log(data: any) {
    this.instance.info({ data, isError: false });
  }

  @This
  public info(data: any) {
    this.instance.info({ data, isError: false });
  }

  @This
  public warn(data: any) {
    this.instance.warn({ data, isError: false });
  }

  @This
  public debug(data: any) {
    this.instance.debug({ data, isError: false });
  }

  @This
  public error(error: Error, extra = Object()) {
    const data = {
      extra,
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    this.instance.error({ data, isError: true });
  }
}
