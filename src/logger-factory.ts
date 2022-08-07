import { isDictionary, This } from '@vodyani/utils';

import { BaseLogger } from './logger';
import { LoggerBuilder } from './logger-builder';
import { LevelDict, LoggerCreateOptions } from './common';

export class LoggerFactory {
  @This
  public create(createOptions: LoggerCreateOptions) {
    const {
      env,
      name,
      enableFile,
      enableConsole,
      fileLevelDict,
      fileNameCallback,
      fileTransportOptions,
    } = createOptions;

    const loggerOptions = {
      exitOnError: false,
      handleExceptions: true,
      handleRejections: true,
      transports: [] as any[],
      exceptionHandlers: null as any,
      rejectionHandlers: null as any,
    };

    const builder = new LoggerBuilder();

    if (enableConsole) {
      const transport = builder.assembleConsole(env, name);
      loggerOptions.exceptionHandlers = transport;
      loggerOptions.rejectionHandlers = transport;
      loggerOptions.transports.push(transport);
    }

    if (enableFile) {
      const dict: LevelDict = isDictionary(fileLevelDict)
        ? fileLevelDict
        : {
          access: ['log', 'info', 'warn', 'debug'],
          error: ['error'],
        };

      Object.keys(dict).forEach(key => {
        dict[key].forEach(level => {
          fileTransportOptions.filename = fileNameCallback(key);
          const transport = builder.assembleFile(env, name, level, fileTransportOptions);

          if (key === 'error' && level === 'error') {
            loggerOptions.exceptionHandlers = transport;
            loggerOptions.rejectionHandlers = transport;
          }

          loggerOptions.transports.push(transport);
        });
      });
    }

    const logger = new BaseLogger(loggerOptions);
    return logger;
  }
}
