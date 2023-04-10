import { Point } from 'electron';
import { normalizeIndex } from '../../shared/utils/array-utils';

export class Cursor implements Point {
  private position!: Point;

  constructor(
    private getBounds: (pos: Point) => Point,
    private positionChanged: (currPos: Point, oldPos: Point) => void,
    private startingPoint: Point = {x: -1, y: -1},
    public wrap = true
  ) {
    this.position = { ...startingPoint };
  }

  get bounds(): Point {
    return this.getBounds({...this.position});
  }

  get x(): number {
    return this.position.x;
  }

  set x(xPos: number) {
    const oldX = this.x;
    this.position.x = normalizeIndex(xPos, this.bounds.x, this.wrap);
    this.notifyPositionChanged({...this.position, x: oldX});
  }

  get y(): number {
    return this.position.y;
  }

  set y(yPos: number) {
    const oldY = this.y;

    this.position.y = normalizeIndex(yPos, this.bounds.y, this.wrap);
    this.notifyPositionChanged({...this.position, y: oldY});
  }

  setPosition(pos: Point) {
    const oldPos = {...this.position};
    this.position = {...pos};
    this.notifyPositionChanged(oldPos);
  }

  moveUp() {
    this.y -= 1;
  }

  moveDown() {
    this.y += 1;
  }

  moveLeft() {
    this.x -= 1;
  }

  moveRight() {
    this.x += 1;
  }

  moveToFirstColumn() {
    this.x = 0;
  }

  moveToLastColumn() {
    this.x = this.bounds.x - 1;
  }

  moveToLastRow() {
    this.y = this.bounds.y - 1;
  }

  moveToFirstRow() {
    this.y = 0;
  }

  reset() {
    this.position = {...this.startingPoint};
  }

  private notifyPositionChanged(oldPosition: Point) {
    this.positionChanged({ ...this.position }, oldPosition);
  }
}
