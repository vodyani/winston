import { This } from '@vodyani/class-decorator';

import { CreateOptions, ILoggerFactory } from '../common';

import { Logger } from './logger';
import { LoggerOptionBuilder } from './logger-builder';

export class LoggerFactory implements ILoggerFactory {
  @This
  public create(createOptions: CreateOptions) {
    const options = new LoggerOptionBuilder()
      .init(createOptions)
      .assembleTransports()
      .assembleExceptionHandlers()
      .assembleRejectionHandlers()
      .export();

    return new Logger(options);
  }
}
