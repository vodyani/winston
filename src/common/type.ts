import { LoggerOptions } from 'winston';

export type LogOptions = Omit<LoggerOptions, 'level'>;
