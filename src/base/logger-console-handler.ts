import { transports } from 'winston';
import { FixedContext } from '@vodyani/core';

import { LoggerFormatHandler } from './logger-format-handler';

export class LoggerConsoleHandler {
  constructor(
    private readonly env: string,
    private readonly name: string,
  ) {}

  @FixedContext
  public create() {
    return new transports.Console({
      format: new LoggerFormatHandler(this.env, this.name, true).create(),
    });
  }
}
