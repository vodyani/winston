import { format, Logform } from 'winston';
import { FixedContext, toStringify, isValidString, isValidObject } from '@vodyani/core';

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
  private createMessageFormat(details: Logform.TransformableInfo) {
    const { message, timestamp } = details;
    const level = details.level.toLocaleLowerCase();

    if (this.enableConsoleLog) {
      return `[${this.name}] - ${timestamp} [${this.env}] ${level}: ${toStringify(message, null, 4)}`;
    }

    let messageData = null;

    if (isValidString(message) || !message) {
      messageData = { data: message };
    }

    if (isValidObject(message as unknown as object)) {
      messageData = { env: this.env, timestamp, ...(message as unknown as object) };
    }

    return toStringify({ level, message: messageData });
  }
}
