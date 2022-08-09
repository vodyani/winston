import { This, toDeepMerge } from '@vodyani/utils';
import { LoggerOptions, transports } from 'winston';

import { ConsoleTransport, FileTransport, DailyRotateFileTransport } from './transport';
import { CreateOptions, DailyRotateFile, defaultLevelDict, LogLevelDict, Transport } from './common';

export class LoggerOptionBuilder {
  private instance: LoggerOptions;

  constructor(createOptions: CreateOptions) {
    const { levels, silent, transports, exitOnError, defaultMeta, handleExceptions, handleRejections } = createOptions;
    this.instance = { levels, silent, exitOnError, defaultMeta, handleExceptions, handleRejections, transports: transports || [] };
    this.build(createOptions);
  }

  @This
  public output() {
    return this.instance;
  }

  @This
  private build(createOptions: CreateOptions) {
    const { env, name, mode, fileLevelDict, fileNameCallback, transportOptions } = createOptions;

    mode.forEach(type => {
      if (type === 'Console') {
        this.assembleConsole(
          name,
          env,
          fileLevelDict,
          (transportOptions as transports.FileTransportOptions),
        );
      }

      if (type === 'File') {
        this.assembleFile(
          name,
          env,
          fileLevelDict,
          (transportOptions as transports.FileTransportOptions),
          fileNameCallback,
        );
      }

      if (type === 'DailyRotateFile') {
        this.assembleDailyRotateFile(
          name,
          env,
          fileLevelDict,
          (transportOptions as DailyRotateFile.DailyRotateFileTransportOptions),
          fileNameCallback,
        );
      }
    });
  }

  @This
  private assembleConsole(
    name: string,
    env: string,
    levelDict: LogLevelDict,
    options?: transports.ConsoleTransportOptions,
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
    options: transports.FileTransportOptions,
    fileNameCallback?: (fileKey: string) => string,
  ) {
    const dict = toDeepMerge(defaultLevelDict, levelDict);

    Object.keys(dict).forEach(key => {
      options.filename = fileNameCallback
        ? fileNameCallback(key)
        : `${name}.${key}.log`;

      const level = dict[key];
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
    options: DailyRotateFile.DailyRotateFileTransportOptions,
    fileNameCallback?: (fileKey: string) => string,
  ) {
    const dict = toDeepMerge(defaultLevelDict, levelDict);

    Object.keys(dict).forEach(key => {
      options.filename = fileNameCallback
        ? fileNameCallback(key)
        : `%DATE%-${name}.${key}.log`;

      const level = dict[key];
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
