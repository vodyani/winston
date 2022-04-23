import { format, Logform } from 'winston';
import { isValidObject } from '@vodyani/validator';
import { FixedContext, toStringify } from '@vodyani/core';

export class LoggerFormatHandler {
  constructor(
    private readonly env: string,
    private readonly name: string,
    private readonly enableConsoleLog = false,
  ) {}

  @FixedContext
  public create() {
    const args = this.createCombineArgs();
    return format.combine(...args);
  }

  @FixedContext
  private createCombineArgs() {
    const combineArgs = [];

    combineArgs.push(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }));
    combineArgs.push(format.printf(message => this.createMessageFormat(message)));

    if (this.enableConsoleLog) {
      combineArgs.push(format.colorize({ all: true }));
    }

    return combineArgs;
  }

  @FixedContext
  private createMessageFormat(info: Logform.TransformableInfo) {
    const level = info.level.toLocaleLowerCase();
    const { data, source } = info.message as unknown as { source: string, data?: any };

    if (this.enableConsoleLog) {
      const message = isValidObject(data) ? toStringify(data) : data;
      const output = `[${this.name}] - ${info.timestamp} [${this.env}-${process.pid}] ${level}`;

      return level === 'error'
        ? `${output}: ${data.name} ${data.message} \n${data.stack}`
        : `${output}: ${message}`;
    }

    return toStringify({
      level,
      message: {
        data,
        source,
        env: this.env,
        pid: process.pid,
        timestamp: info.timestamp,
      },
    });
  }
}
