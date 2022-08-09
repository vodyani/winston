import { format, Logform } from 'winston';
import { isValidString } from '@vodyani/validator';
import { isDictionary, This } from '@vodyani/utils';

import { LogFormatter } from './common';

export class ConsoleLogFormatter implements LogFormatter {
  @This
  public build(name: string, env: string) {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(message => this.format(name, env, message)),
      format.colorize({ all: true }),
    );
  }

  @This
  private format(name: string, env: string, info: Logform.TransformableInfo) {
    const level = info.level.toLocaleLowerCase();
    const output = `[${name}] - ${info.timestamp} [${env} ${process.pid}] ${level}`;

    if (isDictionary(info.message)) {
      return `${output}: ${JSON.stringify(info.message)}`;
    }

    if (isValidString(info.message)) {
      return `${output}: ${info.message}`;
    }
  }
}

export class FileLogFormatter implements LogFormatter {
  @This
  public build(name: string, env: string) {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(message => this.format(name, env, message)),
    );
  }

  @This
  private format(name: string, env: string, info: Logform.TransformableInfo) {
    const level = info.level.toLocaleLowerCase();

    return JSON.stringify({
      env,
      name,
      level,
      pid: process.pid,
      timestamp: info.timestamp,
      message: info,
    });
  }
}
