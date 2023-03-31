export enum VerticalDirection {
  up = -1,
  down = 1,
  none = 0,
}

export enum HorizontalDirection {
  left = -1,
  right = 1,
  none = 0,
}

export type Direction = 1 | -1 | 0;

export interface Point {
  x: number;
  y: number;
}

export interface PlaneDirection extends Point {
  x: HorizontalDirection;
  y: VerticalDirection;
}
