export interface Vector {
  dx: number;
  dy: number;
}

export const v = (dx: number, dy: number): Vector => {
  return { dx, dy };
};

export const addVectors = (v1: Vector, v2: Vector): Vector => {
  return {
    dx: v1.dx + v2.dx,
    dy: v1.dy + v2.dy,
  };
};

export const substractVectors = (v1: Vector, v2: Vector): Vector => {
  return {
    dx: v1.dx - v2.dx,
    dy: v1.dy - v2.dy,
  };
};

export const limitDelta = (v: Vector, limit: number): Vector => {
  const dx = Math.abs(v.dx) >= limit ? (v.dx > 0 ? limit : -limit) : v.dx;
  const dy = Math.abs(v.dy) >= limit ? (v.dy > 0 ? limit : -limit) : v.dy;
  return { dx, dy };
};
