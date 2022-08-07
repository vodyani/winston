import { format, Logform } from 'winston';
import { isValidString } from '@vodyani/validator';
import { isDictionary, This } from '@vodyani/utils';

import { LoggerFormatOptions } from './common';

export class LoggerFormatter {
  constructor(private readonly options: LoggerFormatOptions) {}

  @This
  public create() {
    return format.combine(...this.getCombineArgs());
  }

  @This
  private getCombineArgs() {
    const args = [];
    args.push(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }));
    args.push(format.printf(message => this.format(message)));

    if (this.options.isConsole) {
      args.push(format.colorize({ all: true }));
    }

    return args;
  }

  @This
  private format(info: Logform.TransformableInfo) {
    const level = info.level.toLocaleLowerCase();
    const { isConsole, name, env } = this.options;

    if (isConsole) {
      const output = `[${name}] - ${info.timestamp} [${env}-${process.pid}] ${level}`;

      if (isDictionary(info.message)) {
        return `${output}: ${JSON.stringify(info.message)}`;
      }

      if (isValidString(info.message)) {
        return `${output}: ${info.message}`;
      }
    }

    return JSON.stringify({
      env,
      level,
      pid: process.pid,
      message: info.message,
      timestamp: info.timestamp,
    });
  }
}
