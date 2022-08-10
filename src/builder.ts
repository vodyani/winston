import { isValidArray } from '@vodyani/validator';
import { This, toDeepMerge } from '@vodyani/utils';
import { LoggerOptions, transports } from 'winston';

import { ConsoleTransport, FileTransport, DailyRotateFileTransport } from './transport';
import { CreateOptions, DailyRotateFileOptions, defaultLevelDict, FileOptions, LogLevelDict, LogOptionsBuilder, Transport } from './common';

export class LoggerOptionBuilder implements LogOptionsBuilder {
  private instance: LoggerOptions;

  @This
  public build(options: CreateOptions) {
    this.init(options);

    this.assembleTransports(options);

    return this.instance;
  }

  @This
  private init(options: CreateOptions) {
    const {
      levels, silent, transports, exitOnError, defaultMeta, handleExceptions, handleRejections,
    } = options;

    this.instance = {
      levels,
      silent,
      exitOnError,
      defaultMeta,
      handleExceptions,
      handleRejections,
      transports: transports || [],
    };
  }

  @This
  private assembleTransports(options: CreateOptions) {
    const {
      env, name, mode, levelDict, consoleOptions, fileOptions, dailyRotateFileOptions,
    } = options;

    const transportModes = isValidArray(mode) ? new Set(mode) : new Set([]);

    transportModes.forEach(type => {
      if (type === 'Console') {
        this.assembleConsole(name, env, levelDict, consoleOptions);
      }

      if (type === 'File') {
        this.assembleFile(name, env, levelDict, fileOptions);
      }

      if (type === 'DailyRotateFile') {
        this.assembleDailyRotateFile(name, env, levelDict, dailyRotateFileOptions);
      }
    });
  }

  @This
  private assembleConsole(
    name: string,
    env: string,
    levelDict: LogLevelDict,
    options: transports.ConsoleTransportOptions = {},
  ) {
    const dict = toDeepMerge(defaultLevelDict, levelDict);

    Object.keys(dict).forEach(key => {
      const level = dict[key];
      const transport = new ConsoleTransport().build(name, env, level, options);

      if (level === 'error') {
        if (this.instance.handleExceptions) {
          this.instance.exceptionHandlers = transport;
        }

        if (this.instance.handleRejections) {
          this.instance.rejectionHandlers = transport;
        }
      } else {
        (this.instance.transports as Transport[]).push(transport);
      }
    });
  }

  @This
  private assembleFile(
    name: string,
    env: string,
    levelDict: LogLevelDict,
    options: FileOptions = {},
  ) {
    const dict = toDeepMerge(defaultLevelDict, levelDict);

    Object.keys(dict).forEach(key => {
      const level = dict[key];

      options.dirname = options.dirname || './logs';
      options.filename = options.createFilename ? options.createFilename(key) : `${name}.${key}.log`;

      const transport = new FileTransport().build(name, env, level, options);

      if (this.instance.handleExceptions && level === 'error') {
        this.instance.exceptionHandlers = transport;
      }

      if (this.instance.handleRejections && level === 'error') {
        this.instance.rejectionHandlers = transport;
      }

      (this.instance.transports as Transport[]).push(transport);
    });
  }

  @This
  private assembleDailyRotateFile(
    name: string,
    env: string,
    levelDict: LogLevelDict,
    options: DailyRotateFileOptions = {},
  ) {
    const dict = toDeepMerge(defaultLevelDict, levelDict);

    Object.keys(dict).forEach(key => {
      const level = dict[key];

      options.dirname = options.dirname || './logs';
      options.filename = options.createFilename ? options.createFilename(key) : `%DATE%-${name}.${key}.log`;

      const transport = new DailyRotateFileTransport().build(name, env, level, options);

      if (this.instance.handleExceptions && level === 'error') {
        this.instance.exceptionHandlers = transport;
      }

      if (this.instance.handleRejections && level === 'error') {
        this.instance.rejectionHandlers = transport;
      }

      (this.instance.transports as Transport[]).push(transport);
    });
  }
}
