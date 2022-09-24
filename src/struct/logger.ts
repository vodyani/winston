import { This } from '@vodyani/class-decorator';
import { createLogger, Logger as Base } from 'winston';

import { ILogger, LogOptions } from '../common';

export class Logger implements ILogger {
  private readonly instance: Base;

  constructor(options: LogOptions) {
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
  public error(error: Error, source?: any, extra?: any) {
    const data = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      extra: extra || '',
    };

    this.instance.error({ data, source, isError: true });
  }
}
