import { resolve } from 'path';

import { describe, it } from '@jest/globals';

import { LoggerFactory } from '../src';

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
        customFilename: (key: string) => `custom-logger-${key}.log`,
      },
      dailyRotateFileOptions: {
        customFilename: (key: string) => `%DATE%-custom-logger-${key}.log`,
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
});
