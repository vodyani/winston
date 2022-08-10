# Vodyani winston

**@vodyani/winston** is an out-of-the-box server-side logger tool. 🐯

[![Npm](https://img.shields.io/npm/v/@vodyani/winston/latest.svg)](https://www.npmjs.com/package/@vodyani/winston)
[![Npm](https://img.shields.io/npm/v/@vodyani/winston/beta.svg)](https://www.npmjs.com/package/@vodyani/winston)
[![Npm](https://img.shields.io/npm/dm/@vodyani/winston)](https://www.npmjs.com/package/@vodyani/winston)
[![License](https://img.shields.io/github/license/vodyani/winston)](LICENSE)
<br>
[![codecov](https://codecov.io/gh/vodyani/winston/branch/master/graph/badge.svg?token=O0BNXIWW1M)](https://codecov.io/gh/vodyani/winston)
![Workflow](https://github.com/vodyani/winston/actions/workflows/release.yml/badge.svg)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Installation

```sh
npm install @vodyani/winston
```

## Usage

### Logger creation using LoggerFactory

```ts
import { LoggerFactory } from '@vodyani/winston';

const factory = new LoggerFactory().create({
  env: 'LOCAL',
  name: 'logger',
  mode: ['Console'],
});

logger.log('');
logger.info('output info');
logger.debug('output debug');
logger.warn('output warn', 'logger');
logger.error(new Error('this is error'), 'output error', 'logger');
```

### The parameters of LoggerFactory.create

|Parameters|Parameter Type|Parameter Description|Must Pass|Default Value|Example|
|:-:|:-:|:-:|:-:|:-:|:-:|
|env|string|Environment variables for logs|✅|-|'LOCAL'|
|name|string|Log name|✅|-|'logger'|
|mode|string[]|The output mode of logs can be combined, currently only support: 'Console' output to console, 'File' output to file, 'DailyRotateFile' output to daily rotation file|✅|-|'Console'|
|levelDict|object|Log level alias mapping, this parameter is useful in the case of mapped log file names: [Log level mapping mechanism](#log-level-mapping-mechanism)|❎|`{ error: 'error', access: 'debug' }`|`{ error: 'error', access: 'debug' }`|
|consoleOptions|object|Output to console configuration|❎|-|[View official documentation](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport)|
|fileOptions|object|Configuration of output to log files|❎|[See what defaults are available](#additional-notes-on-the-fileoptions-parameter)|[View official documentation](https://github.com/winstonjs/winston/blob/master/docs/transports.md#file-transport)|
|dailyRotateFileOptions|object|Configuration of output to daily rotation log file|❎|[See what defaults are available](#additional-notes-on-the-dailyrotatefileoptions-parameter)|[View official documentation](https://github.com/winstonjs/winston-daily-rotate-file#options)|
|levels|array|Log Level Table|❎|[View official documentation](https://github.com/winstonjs/winston#logging)|-|
|format|object|Formatting Tools|❎|[View official documentation](https://github.com/winstonjs/winston#formats)|-|
|transports|array|Logs transport|❎|[View official documentation](https://github.com/winstonjs/winston/blob/master/docs/transports.md)|-|
|exitOnError|boolean|If `false`, the handled exception will not cause `process.exit` and will trigger the[Handling mechanism for uncaught exceptions](#handling-mechanism-for-uncaught-exceptions)|❎|true|-|
|silent|boolean|Is silence|❎|false|-|

#### Log level mapping mechanism

Now, due to the introduction of the alias mapping mechanism, `consoleOptions`, `fileOptions`, `dailyRotateFileOptions` will not support you to set the `level` parameter.

Similarly, the `create` method of the `LoggerFactory` does not allow setting the `level` parameter.

- When creating a Logger, if the `mode` parameter contains the `'Console'` option, the builder will iterate over the `levelDict` parameter and let the mapped `property value` be the log level of the exporter.

- When creating a Logger, if the `mode` parameter contains the `'File'` option, the builder will iterate over the `levelDict` parameter, leaving the mapped `property key` as part of the log file name and the `property value` as the log level of the exporter.

- When creating a Logger, if the `mode` parameter contains the `'DailyRotateFile'` option, the builder will iterate over the `levelDict` parameter, leaving the mapped `property key` as part of the log file name and the `property value` as the log level of the exporter.

#### Handling mechanism for uncaught exceptions

Turning on exception handling when `exitOnError` is false will turn on `handleExceptions` and `handleRejections` by default.

- The internal builder will add the `transport` with the value `error` from levelDict to the `rejectionHandlers` and `exceptionHandlers` arrays
- `rejectionHandlers` and `exceptionHandlers` will only have one `error transport` each in a log processor
- The priority of setting `error transport` is: `DailyRotateFile` > `File` > `Console`

Translated with www.DeepL.com/Translator (free version)

#### Additional notes on the fileOptions parameter

1. Default Value

- dirname, default is `logs` directory.
- filename, which by default will consist of `log name + log level alias`.

The following pseudo-code demonstrates the process of populating the default values when `'File'` mode is enabled:

```js
Object.keys(levelDict).forEach(key => {
  const level = levelDict[key];

  fileOptions.dirname = './logs';
  fileOptions.filename = `${name}.${key}.log`;

  // fileTransport.level = level
});
```

2. Custom File Name

*When you want to customize the file name, you need to pass the customFilename parameter, which is a callback function customized by you.*

The following pseudo-code will be created to demonstrate the process of populating the default values when `'File'` mode is enabled:

```js
Object.keys(levelDict).forEach(key => {
  const level = levelDict[key];

  fileOptions.dirname = './logs';
  fileOptions.filename = fileOptions.customFilename
    ? fileOptions.customFilename(key)
    : `${name}.${key}.log`;

  // fileTransport.level = level
});
```

#### Additional notes on the dailyRotateFileOptions parameter

1. Default Value

- dirname, default is `logs` directory.
- filename, which by default will consist of `date + log name + log level alias`.

The following pseudo-code demonstrates the process of populating the default values when `'DailyRotateFile'` mode is enabled:

```js
Object.keys(levelDict).forEach(key => {
  const level = levelDict[key];

  dailyRotateFileOptions.dirname = './logs';
  dailyRotateFileOptions.filename = `%DATE%-${name}.${key}.log`;

  // fileTransport.level = level
});
```

2. Custom File Name

*When you want to customize the file name, you need to pass the customFilename parameter, which is a callback function customized by you.*

The following pseudo-code will be created to demonstrate the process of populating the default values when `'DailyRotateFile'` mode is enabled:

```js
Object.keys(levelDict).forEach(key => {
  const level = levelDict[key];

  dailyRotateFileOptions.dirname = './logs';
  dailyRotateFileOptions.filename = dailyRotateFileOptions.customFilename
    ? dailyRotateFileOptions.customFilename(key)
    : `%DATE%-${name}.${key}.log`;

  // fileTransport.level = level
});
```

## Team

|[![ChoGathK](https://github.com/chogathK.png?size=100)](https://github.com/chogathK)|
|:-:|
|[ChoGathK](https://github.com/chogathK)|

## License

Vodyani winston is [MIT licensed](LICENSE).
