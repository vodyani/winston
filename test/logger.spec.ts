import { resolve } from 'path';

import { describe, it } from '@jest/globals';

import { LoggerFactory } from '../src';

describe('LoggerFactory', () => {
  const factory = new LoggerFactory();
  const error = new Error('I\'m Error 😏');

  it('empty logger', async () => {
    const logger = factory.create({
      env: 'LOCAL',
      name: 'empty-logger',
      handleExceptions: false,
      handleRejections: false,
      mode: [],
    });

    logger.log('log input');
  });

  it('logger', async () => {
    const logger = factory.create({
      env: 'LOCAL',
      name: 'logger',
      handleExceptions: true,
      handleRejections: true,
      mode: ['Console', 'File', 'DailyRotateFile'],
      fileOptions: {
        dirname: resolve(__dirname, './temp/file'),
      },
      dailyRotateFileOptions: {
        dirname: resolve(__dirname, './temp/daily-rotate-file'),
      },
    });

    logger.log('log input');
    logger.info('info input');
    logger.warn('warn input');
    logger.debug('debug input');
    logger.error(error, 'error input');
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
        createFilename: (key: string) => `custom-logger-${key}.log`,
      },
      dailyRotateFileOptions: {
        createFilename: (key: string) => `%DATE%-custom-logger-${key}.log`,
      },
    });

    logger.log('log input');
    logger.error(error, 'log input');
  });

  it('empty options logger', async () => {
    const logger = factory.create({
      env: 'LOCAL',
      name: 'custom-options-logger',
      handleExceptions: true,
      handleRejections: true,
      mode: ['File', 'DailyRotateFile'],
    });

    logger.log('log input');
    logger.error(error, 'log input');
  });
});
