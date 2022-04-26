import { FixedContext } from '@vodyani/core';

import { LevelConfig, DailyRotateFile } from '../common';

import { LoggerFormatHandler } from './logger-format-handler';

export class LoggerDailyRotateFileHandler {
  constructor(
    private readonly env: string,
    private readonly name: string,
    private readonly rotateFileDirPath: string,
    private readonly rotateFileLevel: LevelConfig,
    private readonly options?: DailyRotateFile.DailyRotateFileTransportOptions,
  ) {}

  @FixedContext
  public create() {
    this.validateParam();
    return this.createTransports();
  }

  @FixedContext
  private validateParam() {
    if (!this.rotateFileLevel) {
      throw new Error('To enable local file logging you must specify the level config!');
    }

    if (!this.rotateFileDirPath) {
      throw new Error('To enable local file logging you must specify the log output directory!');
    }

    const list: DailyRotateFile[] = [];

    Object.keys(this.rotateFileLevel).forEach(key => {
      const item = this.rotateFileLevel[key];
      item.forEach(level => {
        if (list.find(e => e.level === level)) {
          throw new Error(`The "${level}" level is already exists!`);
        }
      });
    });
  }

  @FixedContext
  private createTransports() {
    let maxFiles = '14d';
    let zippedArchive = true;
    let datePattern = 'YYYY-MM-DD-HH';
    let errorLogger: DailyRotateFile = null;

    if (this.options) {
      datePattern = this.options.datePattern;
      maxFiles = this.options.maxFiles as any;
      zippedArchive = this.options.zippedArchive;
    }

    const loggers: DailyRotateFile[] = [];

    Object.keys(this.rotateFileLevel).forEach(key => {
      const item = this.rotateFileLevel[key];
      const filename = `%DATE%-${this.name}.${key}.log`;

      item.forEach(level => {
        const logger = new DailyRotateFile({
          level,
          filename,
          maxFiles,
          datePattern,
          zippedArchive,
          dirname: this.rotateFileDirPath,
          format: new LoggerFormatHandler(this.env, this.name, false).create(),
        });

        if (level === 'error') {
          errorLogger = logger;
        }

        loggers.push(logger);
      });
    });

    return {
      loggers,
      errorLogger,
    };
  }
}
