import { fromEvent, Observable } from 'rxjs';
import { filter, pluck, throttleTime } from 'rxjs/operators';
import { Keys } from '../contracts/keys';

export class InputHandler {
  private readonly allowedKeys: number[] = [Keys.SPACE, Keys.LEFT, Keys.RIGHT, Keys.UP, Keys.DOWN];
  public readonly key$: Observable<Keys>;

  constructor(throttle: number) {
    this.key$ = fromEvent(document, 'keydown').pipe(
      throttleTime(throttle),
      pluck<Event, number>('keyCode'),
      filter((key) => this.allowedKeys.includes(key)),
    );
  }
}
