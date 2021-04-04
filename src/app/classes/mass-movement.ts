import { Vector } from '../contracts/vector';

export abstract class MassMovement {
  protected readonly mass: number;

  constructor(mass: number) {
    if (mass < 0 || mass > 100) {
      throw new Error('Mass should be a value between 0 and 100');
    }
    this.mass = mass;
  }

  /**
   * Correct delta axis increment by mass.
   * @todo make quadratic function instead of linear
   */
  private deltaMassCorrection(d: number): number {
    return d - d * (this.mass / 100);
  }

  protected correctAccelerationForMass(v1: Vector, v2: Vector): Vector {
    const acc = {
      dx: v2.dx - v1.dx,
      dy: v2.dy - v1.dy
    };

    const massCorrectedAcc = {
      dx: this.deltaMassCorrection(acc.dx),
      dy: this.deltaMassCorrection(acc.dy)
    };

    return {
      dx: v1.dx + massCorrectedAcc.dx,
      dy: v2.dy + massCorrectedAcc.dy,
    };
  }
}
