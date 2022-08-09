import { resolve } from 'path';

import { describe, it } from '@jest/globals';

import { LoggerFactory } from '../src';

describe('LoggerFactory', () => {
  const factory = new LoggerFactory();

  it('simple', async () => {
    const logger = factory.create({
      env: 'LOCAL',
      name: 'simple-logger',
      mode: ['Console', 'DailyRotateFile'],
      handleExceptions: true,
      handleRejections: true,
      transportOptions: {
        dirname: resolve(__dirname, './temp'),
      },
    });

    const error = new Error('I\'m Error 😏');

    logger.log('log input');
    logger.info('info input');
    logger.warn('warn input');
    logger.debug({ tag: 'From Test LoggerFactory' });
    logger.error(error, { tag: 'From Test LoggerFactory' });
    logger.error(new Error('No extra Error'));
  });
});
