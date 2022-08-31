import { This } from '@vodyani/class-decorator';

import { CreateOptions, ILoggerFactory } from '../common';

import { Logger } from './logger';
import { LoggerOptionBuilder } from './builder';

export class LoggerFactory implements ILoggerFactory {
  @This
  public create(createOptions: CreateOptions) {
    const options = new LoggerOptionBuilder().build(createOptions);
    return new Logger(options);
  }
}
