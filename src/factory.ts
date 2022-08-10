import { This } from '@vodyani/utils';

import { Winston } from './logger';
import { LoggerOptionBuilder } from './builder';
import { CreateOptions, LogFactory } from './common';

export class LoggerFactory implements LogFactory {
  @This
  public create(createOptions: CreateOptions) {
    const options = new LoggerOptionBuilder().build(createOptions);
    return new Winston(options);
  }
}
