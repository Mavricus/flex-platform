export interface IMiddleware<T extends (...args: Array<any>) => any> {
  (next: T, ...context: Parameters<T>): ReturnType<T>;
}

export interface IMiddlewareManager<T extends (...args: Array<any>) => any> {
  add(middleware: IMiddleware<T>): this;

  execute(...args: Parameters<T>): ReturnType<T>;
}

export class MiddlewareManager<T extends (...args: Array<any>) => any> implements IMiddlewareManager<T> {
  private readonly middlewares: Array<IMiddleware<T>> = [];

  constructor(private readonly method: T) {}

  public add(middleware: IMiddleware<T>): this {
    this.middlewares.push(middleware);

    return this;
  }

  public execute(...args: Parameters<T>): ReturnType<T> {
    const chain = this.middlewares.reduceRight(
      (next, middleware) => ((...context: Parameters<T>) => middleware(next, ...context)) as T,
      this.method,
    );

    return chain(...args);
  }
}
