import { transports } from 'winston';
import { This } from '@vodyani/utils';

import { DailyRotateFile } from './common';
import { LoggerFormatter } from './logger-formatter';

export class LoggerBuilder {
  @This
  public assembleConsole(env: string, name: string) {
    const formatOptions = {
      env,
      name,
      isConsole: true,
    };

    return new transports.Console({
      format: new LoggerFormatter(formatOptions).create(),
    });
  }

  @This
  public assembleFile(
    env: string,
    name: string,
    level: string,
    options: DailyRotateFile.DailyRotateFileTransportOptions,
  ) {
    const formatOptions = {
      env,
      name,
      isConsole: false,
    };

    return new DailyRotateFile({
      ...options,
      level,
      format: new LoggerFormatter(formatOptions).create(),
    });
  }
}
