import { interval, merge, Observable, of } from 'rxjs';
import { mapTo, scan, skip, switchMap, takeWhile } from 'rxjs/operators';
import { Position } from '../contracts/position';
import { Vector } from '../contracts/vector';

export class Physics {
  /** @todo the throttle should be refactored to central point. */
  private readonly inertiaThrottleTime = 50;

  /**
   * Map vector stream with starting position to position stream with inertia.
   */
  public vectorToCorrectedPosition(input$: Observable<Vector>, startPosition: Position): Observable<Position> {
    return this.vectorStreamToPositionStream(this.mapWithInertia(input$), startPosition);
  }

  /**
   * Maps vector stream to have inertia.
   * Upon idling for more than throttle time inertia stream kicks in,
   * emiting vector halving stream.
   */
  public mapWithInertia(input$: Observable<Vector>): Observable<Vector> {
    const inertia$ = this.vectorHalvingStream(input$);
    return input$.pipe(switchMap((vector) => merge(of(vector), inertia$)));
  }

  /**
   * Transform vector observable to halving stream.
   */
  public vectorHalvingStream(input$: Observable<Vector>): Observable<Vector> {
    return input$.pipe(
      switchMap((inputVector) => interval(this.inertiaThrottleTime).pipe(mapTo(inputVector))),
      scan((acc, _) => this.reduceVectorDelta(acc, 2)),
      takeWhile((decreasedVector) => this.isCombinedVectorDeltaAbove(decreasedVector, 0)),
      skip(1),  // Skip initial emit, this is the original non-halved value.
    );
  }

  public isCombinedVectorDeltaAbove(input: Vector, limit: number): boolean {
    return Math.abs(input.dx) > limit && Math.abs(input.dy) > limit;
  }

  public vectorStreamToPositionStream(input$: Observable<Vector>, startPosition: Position): Observable<Position> {
    return input$.pipe(
      scan((acc: Position, value: Vector) => {
        return this.vectorToPosition(value, acc);
      }, startPosition),
    );
  }

  private vectorToPosition(inputVector: Vector, previousPosition: Position): Position {
    return {
      x: inputVector.dx + previousPosition.x,
      y: inputVector.dy + previousPosition.y,
    };
  }

  /** Reduce vector delta with given strength; rounded to given decimals. */
  public reduceVectorDelta(input: Vector, strength: number, decimals = 2): Vector {
    const decimalCorrection = Math.pow(10, decimals);

    return {
      dx: Math.floor((input.dx / strength) * decimalCorrection) / decimalCorrection,
      dy: Math.floor((input.dy / strength) * decimalCorrection) / decimalCorrection,
    };
  }
}
