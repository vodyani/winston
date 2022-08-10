# Vodyani winston

**@vodyani/winston** 是一个开箱即用的服务端日志工具 🐯

[![Npm](https://img.shields.io/npm/v/@vodyani/winston/latest.svg)](https://www.npmjs.com/package/@vodyani/winston)
[![Npm](https://img.shields.io/npm/v/@vodyani/winston/beta.svg)](https://www.npmjs.com/package/@vodyani/winston)
[![Npm](https://img.shields.io/npm/dm/@vodyani/winston)](https://www.npmjs.com/package/@vodyani/winston)
[![License](https://img.shields.io/github/license/vodyani/winston)](LICENSE)
<br>
[![codecov](https://codecov.io/gh/vodyani/winston/branch/master/graph/badge.svg?token=MCD6EGYBHA)](https://codecov.io/gh/vodyani/winston)
![Workflow](https://github.com/vodyani/winston/actions/workflows/release.yml/badge.svg)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

[👉🏻 Maybe you need english document.](./docs/en.readme.md)

## 安装方法

```sh
npm install @vodyani/winston
```

## 使用方法

### 使用 LoggerFactory 创建 Logger

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

### LoggerFactory.create 的参数

|参数|参数类型|参数描述|是否必传|默认值|示例|
|:-:|:-:|:-:|:-:|:-:|:-:|
|env|string|日志的环境变量|✅|-|'LOCAL'|
|name|string|日志名称|✅|-|'logger'|
|mode|string[]|日志的输出模式，可以组合使用，目前只支持：'Console' 输出到控制台、'File' 输出到文件、'DailyRotateFile' 输出到每日轮转文件|✅|-|'Console'|
|levelDict|object|日志等级别名映射，这个参数在映射日志文件名的情况下很有用：[日志等级映射机制](#日志等级映射机制)|❎|`{ error: 'error', access: 'debug' }`|`{ error: 'error', access: 'debug' }`|
|consoleOptions|object|输出到控制台的配置|❎|-|[查看官方文档](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport)|
|fileOptions|object|输出到日志文件的配置|❎|[查看有哪些默认值](#fileoptions-参数的补充说明)|[查看官方文档](https://github.com/winstonjs/winston/blob/master/docs/transports.md#file-transport)|
|dailyRotateFileOptions|object|输出到每日轮转日志文件的配置|❎|[查看有哪些默认值](#dailyrotatefileoptions-参数的补充说明)|[查看官方文档](https://github.com/winstonjs/winston-daily-rotate-file#options)|
|levels|array|日志等级表|❎|[查看官方文档](https://github.com/winstonjs/winston#logging)|-|
|format|object|格式化工具|❎|[查看官方文档](https://github.com/winstonjs/winston#formats)|-|
|transports|array|日志输出器|❎|[查看官方文档](https://github.com/winstonjs/winston/blob/master/docs/transports.md)|-|
|exitOnError|boolean|如果为 `false`，所处理的异常将不会导致 `process.exit`，并且触发[未捕捉异常的处理机制](#未捕捉异常的处理机制)|❎|true|-|
|silent|boolean|是否静默|❎|false|-|

#### 日志等级映射机制

现在，由于引入了别名映射机制，`consoleOptions`、`fileOptions`、`dailyRotateFileOptions` 不支持您设置 level 参数

同样的，`LoggerFactory` 的 `create` 方法也不允许设置 level 参数

- 在创建 Logger 时，如果 `mode` 参数包含 'Console' 选项，构建器将遍历 `levelDict` 参数，让映射的 `属性值` 作为输出器的日志等级
- 在创建 Logger 时，如果 `mode` 参数包含 'File' 选项，构建器将遍历 `levelDict` 参数，让映射的 `属性键` 作为日志文件名的一部分，`属性值` 作为输出器的日志等级
- 在创建 Logger 时，如果 `mode` 参数包含 'DailyRotateFile' 选项，构建器将遍历 `levelDict` 参数，让映射的 `属性键` 作为日志文件名的一部分，`属性值` 作为输出器的日志等级

#### 未捕捉异常的处理机制

当 `exitOnError` 为 false 时，开启异常处理，将默认开启 `handleExceptions` 和 `handleRejections`

- 内部的构建器将会把 levelDict 中值为 `error` 的 `transport` 添加到 `rejectionHandlers` 和 `exceptionHandlers` 数组中
- `rejectionHandlers` 和 `exceptionHandlers` 在一个日志处理器中，只会各自有一个 `error transport`
- `error transport` 的设置优先级为：`DailyRotateFile` > `File` > `Console`

#### fileOptions 参数的补充说明

1. 默认值

- dirname，默认是 `logs` 目录
- filename，默认将由 `日志名+日志等级别名` 组成

下面的伪代码是演示在启用 `'File'` 模式后，默认值的填充过程：

```js
Object.keys(levelDict).forEach(key => {
  const level = levelDict[key];

  fileOptions.dirname = './logs';
  fileOptions.filename = `${name}.${key}.log`;

  // fileTransport.level = level
});
```

2. 自定义文件名

当您希望自定义文件名，需要传入 customFilename 参数，这是一个由您自定义的回调函数

下面将创建一段伪代码，来演示在启用 `'File'` 模式后，默认值的填充过程：

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

#### dailyRotateFileOptions 参数的补充说明

1. 默认值

- dirname，默认是 `logs` 目录
- filename，默认将由 `日期+日志名+日志等级别名` 组成

下面的伪代码是演示在启用 `'DailyRotateFile'` 模式后，默认值的填充过程：

```js
Object.keys(levelDict).forEach(key => {
  const level = levelDict[key];

  dailyRotateFileOptions.dirname = './logs';
  dailyRotateFileOptions.filename = `%DATE%-${name}.${key}.log`;

  // fileTransport.level = level
});
```

2. 自定义文件名

当您希望自定义文件名，需要传入 customFilename 参数，这是一个由您自定义的回调函数

下面将创建一段伪代码，来演示在启用 `'DailyRotateFile'` 模式后，默认值的填充过程：

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

## 开发团队

|[![ChoGathK](https://github.com/chogathK.png?size=100)](https://github.com/chogathK)|
|:-:|
|[ChoGathK](https://github.com/chogathK)|

## License

Vodyani winston is [MIT licensed](LICENSE).
