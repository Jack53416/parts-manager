import { Observable, Subject } from 'rxjs';
import { describePressedKey } from '../../shared/utils/keyboard';
import { Editable } from '../models/editable';
import { Cursor } from './cursor';
import { Point } from './point';

export class GridKeyManager<T extends Editable> {
  pageUpAndDownDelta = 3;
  cursor!: Cursor;

  private activeItem: T | null;
  private previousActiveItem: T | null;
  private readonly activeItemChanges$ = new Subject<Point>();
  private keyMap = new Map<string, () => void>([
    ['ArrowUp', () => this.cursor.moveUp()],
    ['ArrowDown', () => this.cursor.moveDown()],
    ['ArrowLeft', () => this.cursor.moveLeft()],
    ['ArrowRight', () => this.cursor.moveRight()],
    ['Enter', () => this.getItem(this.cursor)?.edit()],
    ['PageDown', () => (this.cursor.y += this.pageUpAndDownDelta)],
    ['PageUp', () => (this.cursor.y -= this.pageUpAndDownDelta)],
    ['Home', () => this.cursor.moveToFirstColumn()],
    ['End', () => this.cursor.moveToLastColumn()],
    ['ctrl+Home', () => this.cursor.moveToFirstRow()],
    ['ctrl+End', () => this.cursor.moveToLastRow()],
  ]);

  constructor(private cellMatrix: T[][]) {
    this.cursor = new Cursor(
      { x: 0, y: 0 },
      (cursor) => ({ x: cellMatrix[cursor.y].length, y: cellMatrix.length }),
      (cursor) => this.selectCell(cursor)
    );
  }

  get selectedItem(): T | null {
    return this.activeItem;
  }

  get previousItem(): T | null {
    return this.previousActiveItem;
  }

  get activeItemChanges(): Observable<Point> {
    return this.activeItemChanges$.asObservable();
  }

  getItem(cursor: Point): T | null {
    return this.cellMatrix.at(cursor.y).at(cursor.x);
  }

  handleKeyDown(event: KeyboardEvent) {
    const handler = this.keyMap.get(describePressedKey(event));
    if (handler) {
      handler();
      event.preventDefault();
    } else if (!this.activeItem.inEditMode && event.key.length === 1) {
      this.activeItem?.edit(event.key);
      event.preventDefault();
    }
  }

  destroy() {
    this.activeItemChanges$.complete();
  }

  private selectCell(cursor: Point) {
    const previousActiveItem = this.activeItem;
    const item = this.getItem(cursor);

    if (item && item !== previousActiveItem) {
      this.activeItem?.focusOut();
      item.focus();
      this.activeItem = item;
      this.previousActiveItem = previousActiveItem;
      this.activeItemChanges$.next(cursor);
    }
  }
}
