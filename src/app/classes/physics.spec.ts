import { from, of } from 'rxjs';
import { p } from '../contracts/position';
import { v, Vector } from '../contracts/vector';
import { Physics } from './physics';

describe('Physics', () => {
  let physics: Physics;

  beforeEach(() => {
    physics = new Physics();
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
    const expectedOutput = [v(2, 2), v(1, 1), v(0.5, 0.5), v(0.25, 0.25), v(0.12, 0.12), v(0.06, 0.06), v(0.03, 0.03), v(0.01, 0.01)];

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
    const inertiaVectors = [v(0.5, 1), v(0.25, 0.5), v(0.12, 0.25), v(0.06, 0.12), v(0.03, 0.06), v(0.01, 0.03)];
    const vectorStream$ = from(inputVectors);
    const expectedOutput = [...inputVectors, ...inertiaVectors];

    let emissionCounter = 0;
    physics.mapWithInertia(vectorStream$).subscribe({
      next: (vector) => {
        expect(vector).toEqual(expectedOutput[emissionCounter++]);
      },
      complete: () => {
        expect(emissionCounter).toBe(expectedOutput.length);
        done();
      },
    });
  });

  it('vectorStreamToPositionStream should transform a vector stream with a starting position to a position stream', (done) => {
    const startPosition = p(0, 0);
    const vectorInput$ = from([v(0, 0), v(1, 0), v(0, 1), v(-2, 0), v(6, -4)]);
    const expectedOutput = [p(0, 0), p(1, 0), p(1, 1), p(-1, 1), p(5, -3)];

    let emissionCounter = 0;
    physics.vectorStreamToPositionStream(vectorInput$, startPosition).subscribe({
      next: (position) => {
        expect(position).toEqual(expectedOutput[emissionCounter++]);
      },
      complete: () => {
        expect(emissionCounter).toBe(expectedOutput.length);
        done();
      },
    });
  });

  it('vectorToCorrectedPosition should transform vector stream to corrected position stream', (done) => {
    const vectorInput$ = from([v(1, 1), v(1, 1), v(2, 2)]);
    const startPosition = p(0, 0);
    const expectedOutput = [
      p(1, 1),
      p(2, 2),
      p(4, 4),
      p(5, 5),
      p(5.5, 5.5),
      p(5.75, 5.75),
      p(5.87, 5.87),
      p(5.93, 5.93),
      p(5.96, 5.96),
      p(5.97, 5.97),
    ];

    let emissionCounter = 0;
    physics.vectorToCorrectedPosition(vectorInput$, startPosition).subscribe({
      next: (position) => {
        expect(position).toEqual(expectedOutput[emissionCounter++]);
      },
      complete: () => {
        expect(emissionCounter).toBe(expectedOutput.length);
        done();
      },
    });
  });
});
