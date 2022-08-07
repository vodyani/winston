import { This } from '@vodyani/utils';
import { Logger, LoggerOptions, createLogger } from 'winston';

export class BaseLogger {
  private readonly instance: Logger;

  constructor(options: LoggerOptions) {
    this.instance = createLogger(options);
  }

  @This
  public log(message: any) {
    this.instance.log(message);
  }

  @This
  public info(message: any) {
    this.instance.info(message);
  }

  @This
  public warn(message: any) {
    this.instance.warn(message);
  }

  @This
  public debug(message: any) {
    this.instance.debug(message);
  }

  @This
  public error(error: Error, extra = Object()) {
    const message = {
      extra,
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    };

    this.instance.error(message);
  }
}
