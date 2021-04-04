import { Observable } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { Keys } from '../contracts/keys';
import { addVectors, limitDelta, Vector } from '../contracts/vector';
import { MassMovement } from './mass-movement';

export class CharacterMovement extends MassMovement {
  static readonly mass = 99;
  private readonly forceLimit = 15;
  private readonly acceleration = 1;
  public readonly movement$: Observable<Vector>;
  private inertia$: Observable<Vector>;

  constructor(keys$: Observable<Keys>) {
    super(CharacterMovement.mass);

    this.movement$ = keys$.pipe(
      map((key) => this.keyToVector(key)),
      scan((acc, curr) => limitDelta(addVectors(acc, curr), this.forceLimit)),
      scan((v1, v2) => this.correctAccelerationForMass(v1, v2)),
    );
  }

  /**
   * Translate key input to movement vector.
   */
  private keyToVector(key: Keys): Vector {
    let [dx, dy] = [0, 0];

    switch (key) {
      case Keys.LEFT:
        dx = -this.acceleration;
        break;
      case Keys.UP:
        dy = -this.acceleration;
        break;
      case Keys.RIGHT:
        dx = this.acceleration;
        break;
      case Keys.DOWN:
        dy = this.acceleration;
        break;
      default:
        throw new Error('invalid key given!');
    }

    return { dx, dy };
  }
}
