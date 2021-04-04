import { from, of } from 'rxjs';
import { v, Vector } from '../contracts/vector';
import { Physics } from './physics';

describe('Physics', () => {
  let physics: Physics;

  beforeEach(() => {
    physics = new Physics();
  });

  it('substractWithZeroLimit should substract v1 with v2 and limit result delta by 0', () => {
    // [input vector 1, input vector 2, output]
    const testSet: [Vector, Vector, Vector][] = [
      [v(1, 2), v(0, 1), v(1, 1)],
      [v(-7, 2), v(-8, 1), v(0, 1)],
      [v(0, 12.5), v(0, 12.5), v(0, 0)],
      [v(3, 3), v(4, 4), v(0, 0)],
      [v(6, 6), v(4, 2), v(2, 4)],
      [v(10000.75, -1000.25), v(9000.25, 1000.75), v(1000.5, -2001)],
    ];

    testSet.map((vector) => expect(physics.substractVectorsWithZeroLimit(vector[0], vector[1])).toEqual(vector[2]));
  });

  it('decrease should decrease input vector delta by strength', () => {
    // [input vector, output vector, strength]
    const testSet: [Vector, Vector, number][] = [
      [v(6, 6), v(3, 3), 2],
      [v(6, 2), v(3, 1), 2],
      [v(6, 6), v(6, 6), 1],
      [v(-6, -6), v(-3, -3), 2],
      [v(6, -6), v(3, -3), 2],
      [v(0.1, 0.1), v(0.05, 0.05), 2],
      [v(0.01, 0.01), v(0, 0), 2],
    ];

    testSet.map((set) => expect(physics.reduceVectorDelta(set[0], set[2])).toEqual(set[1]));
  });

  it('vectorHalvingStream should halve given input vector to zero delta', (done) => {
    const input$ = of(v(4, 4));
    const expectedOutput = [
      v(2, 2),
      v(1, 1),
      v(0.5, 0.5),
      v(0.25, 0.25),
      v(0.12, 0.12),
      v(0.06, 0.06),
      v(0.03, 0.03),
      v(0.01, 0.01),
    ];

    let emissionCounter = 0;
    physics.vectorHalvingStream(input$).subscribe({
      next: (vector) => {
        expect(vector).toEqual(expectedOutput[emissionCounter++]);
      },
      complete: () => {
        expect(emissionCounter).toBe(expectedOutput.length);
        done();
      },
    });
  });

  it('mapWithInertia should transform a stream to add inertia to it', (done) => {
    const inputVectors = [v(0, 1), v(0, 1), v(0, 2), v(0, 2), v(1, 2)];
    const inertiaVectors = [
      v(0.5, 1),
      v(0.25, 0.5),
      v(0.12, 0.25),
      v(0.06, 0.12),
      v(0.03, 0.06),
      v(0.01, 0.03),
      v(0, 0.01),
    ];
    const vectorStream$ = from(inputVectors);
    const expectedOutput = [...inputVectors, ...inertiaVectors];

    let emmissionCounter = 0;
    physics.mapWithInertia$(vectorStream$).subscribe({
      next: (vector) => {
        expect(vector).toEqual(expectedOutput[emmissionCounter++]);
      },
      complete: () => {
        done();
      },
    });
  });
});
