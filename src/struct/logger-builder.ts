import { This } from '@vodyani/class-decorator';
import { toDeepMerge, isValidArray } from '@vodyani/utils';

import { CreateOptions, defaultLevelInfos, LogOptions, Transport } from '../common';

import { ConsoleTransport, FileTransport, DailyRotateFileTransport } from './log-transport';

export class LoggerOptionBuilder {
  private options: LogOptions;

  private source: CreateOptions;

  private errorTransport: Transport[] = [];

  @This
  public export() {
    return this.options;
  }

  @This
  public init(createOptions: CreateOptions) {
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
        levelInfos: defaultLevelInfos,
      } as CreateOptions,
      createOptions,
    );

    this.options = {
      levels,
      silent,
      exitOnError,
      defaultMeta,
      exceptionHandlers,
      rejectionHandlers,
      handleExceptions,
      handleRejections,
      transports: transports || [],
    };

    return this;
  }

  @This
  public assembleTransports() {
    const { mode } = this.source;

    new Set(mode).forEach(type => {
      if (type === 'Console') this.assembleConsole();
      if (type === 'File') this.assembleFile();
      if (type === 'DailyRotateFile') this.assembleDailyRotateFile();
    });

    return this;
  }

  @This
  public assembleExceptionHandlers() {
    if (this.options.handleExceptions) {
      const handlers: Transport[] = [];

      if (isValidArray(this.options.exceptionHandlers)) {
        handlers.push(...this.options.exceptionHandlers);
      } else {
        handlers.push(...this.errorTransport);
      }

      if (isValidArray(handlers)) {
        this.options.exceptionHandlers = toDeepMerge(this.options.exceptionHandlers, handlers);
      }
    }

    return this;
  }

  @This
  public assembleRejectionHandlers() {
    if (this.options.handleRejections) {
      const handlers: Transport[] = [];

      if (isValidArray(this.options.rejectionHandlers)) {
        handlers.push(...this.options.rejectionHandlers);
      } else {
        handlers.push(...this.errorTransport);
      }

      if (isValidArray(handlers)) {
        this.options.rejectionHandlers = toDeepMerge(this.options.rejectionHandlers, handlers);
      }
    }

    return this;
  }

  @This
  private assembleConsole() {
    const { env, name, consoleOptions } = this.source;
    const transport = new ConsoleTransport().build(name, env, 'debug', consoleOptions);

    this.errorTransport.push(transport);

    (this.options.transports as Transport[]).push(transport);

    return this;
  }

  @This
  private assembleFile() {
    const { env, name, levelInfos, fileOptions } = this.source;

    levelInfos.forEach(({ level, filename }) => {
      fileOptions.dirname = fileOptions.dirname || './logs';
      fileOptions.filename = fileOptions.customFilename
        ? fileOptions.customFilename(level)
        : `${name}.${filename}.log`;

      const transport = new FileTransport().build(name, env, level, fileOptions);

      if (level === 'error') {
        this.errorTransport.push(transport);
      }

      (this.options.transports as Transport[]).push(transport);
    });

    return this;
  }

  @This
  private assembleDailyRotateFile() {
    const { env, name, levelInfos, dailyRotateFileOptions } = this.source;

    levelInfos.forEach(({ level, filename }) => {
      dailyRotateFileOptions.dirname = dailyRotateFileOptions.dirname || './logs';
      dailyRotateFileOptions.filename = dailyRotateFileOptions.customFilename
        ? dailyRotateFileOptions.customFilename(level)
        : `%DATE%-${name}.${filename}.log`;

      const transport = new DailyRotateFileTransport().build(name, env, level, dailyRotateFileOptions);

      if (level === 'error') {
        this.errorTransport.push(transport);
      }

      (this.options.transports as Transport[]).push(transport);
    });

    return this;
  }
}
