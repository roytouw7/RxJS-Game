import { BehaviorSubject, interval, merge, Observable, of, race, Subject } from 'rxjs';
import { map, mapTo, scan, skip, switchMap, take, takeWhile, tap, throttleTime, withLatestFrom } from 'rxjs/operators';
import { Position } from '../contracts/position';
import { substractVectors, v, Vector } from '../contracts/vector';

export class Physics {
  private readonly throttle = 50;

  /**
   * Maps vector stream to have inertia.
   * Upon idling for more than throttle time inertia stream kicks in,
   * emiting vector halving stream.
   */
  public mapWithInertia$(input$: Observable<Vector>): Observable<Vector> {
    const inertia$ = this.vectorHalvingStream(input$);
    return input$.pipe(switchMap((v) => merge(of(v), inertia$)));
  }

  public vectorHalvingStream(input$: Observable<Vector>): Observable<Vector> {
    return input$.pipe(
      switchMap((inputVector) => interval(this.throttle).pipe(mapTo(inputVector))),
      scan((acc, _) => this.reduceVectorDelta(acc, 2)),
      takeWhile((reducedVector) => this.isCombinedVectorDeltaAbove(reducedVector, 0)),
      skip(1)
    );
  }

  public isCombinedVectorDeltaAbove(input: Vector, limit: number): boolean {
    return Math.abs(input.dx) > limit && Math.abs(input.dy) > limit;
  }
  /**
   * Maps Vector stream to Position stream
   */
  public vectorToPosition$(movement$: Observable<Vector>, startPosition: Position): Observable<Position> {
    // Required for backfeeding previous position to apply vectorToMatrixMovement on.
    const previous$: Subject<Position> = new BehaviorSubject(startPosition);

    return movement$.pipe(
      withLatestFrom(previous$),
      map((pair) => this.vectorToMovement(...pair)),
      tap((pos) => previous$.next(pos)),
      throttleTime(this.throttle),
    );
  }

  private vectorToMovement(v: Vector, p: Position): Position {
    return {
      x: p.x + v.dx,
      y: p.y + v.dy,
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

  /**
   * Substract vector 1 by vector 2 limiting delta by 0.
   */
  public substractVectorsWithZeroLimit(targetVector: Vector, substractedVector: Vector): Vector {
    const substracted = substractVectors(targetVector, substractedVector);
    return {
      dx: substracted.dx > 0 === targetVector.dx > 0 ? substracted.dx : 0,
      dy: substracted.dy > 0 === targetVector.dy > 0 ? substracted.dy : 0,
    };
  }
}
