import { This } from '@vodyani/utils';

import { Winston } from './logger';
import { CreateOptions } from './common';
import { LoggerOptionBuilder } from './builder';

export class LoggerFactory {
  @This
  public create(createOptions: CreateOptions) {
    const options = new LoggerOptionBuilder(createOptions).output();
    return new Winston(options);
  }
}
