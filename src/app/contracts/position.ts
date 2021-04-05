export interface Position {
  readonly x: number;
  readonly y: number;
}

export const p = (x: number, y: number): Position => {
  return { x, y };
};
