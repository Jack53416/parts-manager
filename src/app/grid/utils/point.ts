export type Direction = 1 | -1 | 0;

export interface Point {
  x: number;
  y: number;
}

export interface PlaneDirection extends Point {
  x: Direction;
  y: Direction;
}
