import { This, toDeepMerge } from '@vodyani/utils';
import { isValid, isValidArray } from '@vodyani/validator';

import { ConsoleTransport, FileTransport, DailyRotateFileTransport } from './transport';
import { CreateOptions, defaultLevelDict, LogOptions, LogOptionsBuilder, Transport } from './common';

export class LoggerOptionBuilder implements LogOptionsBuilder {
  private options: LogOptions;

  private source: CreateOptions;

  private errorTransport: Transport = null;

  @This
  public build(createOptions: CreateOptions) {
    this.init(createOptions);
    this.assembleTransports();
    this.assembleExceptionHandlers();
    this.assembleRejectionHandlers();

    return this.options;
  }

  @This
  private init(createOptions: CreateOptions) {
    const {
      levels, silent, transports, exitOnError, defaultMeta,
      handleExceptions, handleRejections, exceptionHandlers, rejectionHandlers,
    } = createOptions;

    this.source = toDeepMerge(
      {
        mode: [],
        fileOptions: {},
        consoleOptions: {},
        dailyRotateFileOptions: {},
        levelDict: defaultLevelDict,
      },
      createOptions,
    );

    this.options = {
      levels,
      silent,
      exitOnError,
      defaultMeta,
      exceptionHandlers,
      rejectionHandlers,
      transports: transports || [],
      handleExceptions: isValid(handleExceptions) ? handleExceptions : !exitOnError,
      handleRejections: isValid(handleRejections) ? handleRejections : !exitOnError,
    };
  }

  @This
  private assembleTransports() {
    const { mode } = this.source;

    new Set(mode).forEach(type => {
      if (type === 'Console') this.assembleConsole();
      if (type === 'File') this.assembleFile();
      if (type === 'DailyRotateFile') this.assembleDailyRotateFile();
    });
  }

  @This
  private assembleConsole() {
    const { env, name, consoleOptions, levelDict } = this.source;

    Object.keys(levelDict).forEach(key => {
      const level = levelDict[key];
      const transport = new ConsoleTransport().build(name, env, level, consoleOptions);

      if (level === 'error') this.errorTransport = transport;
      (this.options.transports as Transport[]).push(transport);
    });
  }

  @This
  private assembleFile() {
    const { env, name, levelDict, fileOptions } = this.source;

    Object.keys(levelDict).forEach(key => {
      const level = levelDict[key];

      fileOptions.dirname = fileOptions.dirname || './logs';
      fileOptions.filename = fileOptions.customFilename
        ? fileOptions.customFilename(key)
        : `${name}.${key}.log`;

      const transport = new FileTransport().build(name, env, level, fileOptions);

      if (level === 'error') this.errorTransport = transport;
      (this.options.transports as Transport[]).push(transport);
    });
  }

  @This
  private assembleDailyRotateFile() {
    const { env, name, levelDict, dailyRotateFileOptions } = this.source;

    Object.keys(levelDict).forEach(key => {
      const level = levelDict[key];

      dailyRotateFileOptions.dirname = dailyRotateFileOptions.dirname || './logs';
      dailyRotateFileOptions.filename = dailyRotateFileOptions.customFilename
        ? dailyRotateFileOptions.customFilename(key)
        : `%DATE%-${name}.${key}.log`;

      const transport = new DailyRotateFileTransport().build(name, env, level, dailyRotateFileOptions);

      if (level === 'error') this.errorTransport = transport;
      (this.options.transports as Transport[]).push(transport);
    });
  }

  @This
  private assembleExceptionHandlers() {
    if (this.options.handleExceptions) {
      const handlers: Transport[] = [];

      if (isValidArray(this.options.exceptionHandlers)) {
        handlers.push(...this.options.exceptionHandlers);
      } else {
        handlers.push(this.errorTransport);
      }

      if (isValidArray(handlers)) {
        this.options.exceptionHandlers = toDeepMerge(this.options.exceptionHandlers, handlers);
      }
    }
  }

  @This
  private assembleRejectionHandlers() {
    if (this.options.handleRejections) {
      const handlers: Transport[] = [];

      if (isValidArray(this.options.rejectionHandlers)) {
        handlers.push(...this.options.rejectionHandlers);
      } else {
        handlers.push(this.errorTransport);
      }

      if (isValidArray(handlers)) {
        this.options.rejectionHandlers = toDeepMerge(this.options.rejectionHandlers, handlers);
      }
    }
  }
}
