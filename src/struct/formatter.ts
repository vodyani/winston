import { format, Logform } from 'winston';
import { isValidDict } from '@vodyani/utils';
import { This } from '@vodyani/class-decorator';

import { ILoggerFormatter, LogMessage } from '../common';

export class ConsoleLogFormatter implements ILoggerFormatter {
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
    const label = `[${name}] - ${info.timestamp} [${env} ${process.pid}] ${level}`;

    if (isValidDict(info.message)) {
      const message = (info.message as unknown as LogMessage);

      if (message.isError) {
        let output = `${label}`;

        output += `: ${message.data.message}`;

        output += `\n ${message.data.stack}}`;

        if (message.data.extra) {
          output += `\n Error Extra: ${JSON.stringify(message.data.extra)}`;
        }

        if (message.source) {
          output += `\n Error Source: ${JSON.stringify(message.source)}`;
        }

        return output;
      }

      return `${label}: ${JSON.stringify(message.data, null, 4)}`;
    }
  }
}

export class FileLogFormatter implements ILoggerFormatter {
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
    const message = (info.message as unknown as LogMessage);

    return JSON.stringify({
      env,
      name,
      level,
      pid: process.pid,
      timestamp: info.timestamp,
      source: message.source || name,
      message: message.data,
    });
  }
}