import { BaseError, IBaseErrorContext } from '@flex/base-error';

export interface IUpdateValueErrorContext extends IBaseErrorContext {
  key: string;
  ttl?: number;
}

export class KvsUpdateValueError extends BaseError<IUpdateValueErrorContext> {
  constructor(message: string, key: string, ttl?: number, originalError?: Error) {
    super(message, { key, ttl }, originalError);
  }
}
