import { TimerFulfillError } from '../error/timer-fulfill-error.js';
import { IInterruptibleTimerPromise, InterruptibleTimerPromise } from './interruptible-timer-promise.js';

export interface IInterruptibleTimerController {
  get count(): number;

  create(timeout: number): IInterruptibleTimerPromise;

  stopAll(): void;
}

export class InterruptibleTimerController implements IInterruptibleTimerController {
  private readonly collection = new Set<IInterruptibleTimerPromise>();

  get count(): number {
    return this.collection.size;
  }

  create(timeout: number): IInterruptibleTimerPromise {
    const timer = new InterruptibleTimerPromise(timeout);
    this.collection.add(timer);

    timer
      .finally(() => this.collection.delete(timer))
      .catch((error: Error) => {
        throw new TimerFulfillError('Cannot remove from timers collection', timer.state, error);
      });

    return timer;
  }

  stopAll(): void {
    for (const timer of this.collection.values()) {
      timer.interrupt();
    }

    this.collection.clear();
  }
}
