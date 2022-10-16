import { resolve } from 'path';

import { describe, it } from '@jest/globals';

import { ConsoleTransport, LoggerFactory } from '../src';

describe('LoggerFactory', () => {
  const factory = new LoggerFactory();
  const error = new Error('I\'m Error 😏');

  it('empty logger', async () => {
    factory.create({
      env: 'LOCAL',
      name: 'empty-logger',
      handleExceptions: false,
      handleRejections: false,
      mode: [],
    });
  });

  it('empty error handler', async () => {
    factory.create({
      env: 'LOCAL',
      name: 'empty-logger',
      exitOnError: false,
      rejectionHandlers: [Object()],
      exceptionHandlers: [Object()],
      mode: [],
    });
  });

  it('logger', async () => {
    const logger = factory.create({
      env: 'LOCAL',
      name: 'logger',
      exitOnError: false,
      mode: ['Console', 'File', 'DailyRotateFile'],
      fileOptions: {
        dirname: resolve(__dirname, './temp/file'),
      },
      dailyRotateFileOptions: {
        dirname: resolve(__dirname, './temp/daily-rotate-file'),
      },
    });

    logger.log('log input', 'logger');
    logger.info('info input', 'logger');
    logger.warn('warn input', 'logger');
    logger.debug('debug input', 'logger');
    logger.error(error, 'error input', 'logger');
    logger.error(error);
  });

  it('custom logger filename', async () => {
    const logger = factory.create({
      env: 'LOCAL',
      name: 'custom-logger',
      handleExceptions: true,
      handleRejections: true,
      mode: ['File', 'DailyRotateFile'],
      fileOptions: {
        customFilename: (level: string) => `custom-logger-${level}.log`,
      },
      dailyRotateFileOptions: {
        customFilename: (level: string) => `%DATE%-custom-logger-${level}.log`,
      },
    });

    logger.log('log input');
    logger.error(error, 'log input');
  });

  it('empty options file logger', async () => {
    const logger = factory.create({
      env: 'LOCAL',
      name: 'custom-options-file-logger',
      exitOnError: false,
      mode: ['File'],
    });

    logger.log('log input');
    logger.error(error, 'log input');
  });

  it('empty options console logger', async () => {
    const logger = factory.create({
      env: 'LOCAL',
      name: 'custom-options-console-logger',
      exitOnError: false,
      mode: ['Console'],
    });

    logger.log('log input');
    logger.error(error, 'log input');
  });

  it('handleExceptions logger', async () => {
    const handler = new ConsoleTransport().build('custom-handleExceptions-logger', 'DEV', 'debug');

    factory.create({
      env: 'LOCAL',
      handleExceptions: true,
      handleRejections: true,
      exceptionHandlers: [handler],
      rejectionHandlers: [handler],
      name: 'custom-handleExceptions-logger',
      mode: ['File', 'DailyRotateFile'],
    });
  });
});
