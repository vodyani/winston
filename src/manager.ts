import {
  AsyncProvider,
  AsyncProviderFactory,
  AsyncInjectable,
  InjectionToken,
  OptionalFactoryDependency,
} from '@vodyani/core';
import { This } from '@vodyani/class-decorator';

import { LoggerFactory } from './struct';
import { CreateOptions } from './common';

@AsyncInjectable
export class LoggerManager extends AsyncProvider implements AsyncProviderFactory {
  @This
  public create(
    options: CreateOptions,
    inject?: Array<InjectionToken | OptionalFactoryDependency>,
  ) {
    return {
      inject: inject,
      provide: LoggerManager.getToken(),
      useFactory: () => this.useFactory(options),
    };
  }

  @This
  private async useFactory(options: CreateOptions) {
    return new LoggerFactory().create(options);
  }
}
