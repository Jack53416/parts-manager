import { Observable, Subject } from 'rxjs';
import { describePressedKey } from '../../shared/utils/keyboard';
import { GridCursorEvent } from '../models/grid-cursor-event';
import { Foscusable } from '../models/editable';
import { Cursor } from './cursor';
import { Point } from './point';
import { hasModifierKey } from '@angular/cdk/keycodes';

export class GridKeyManager<T extends Foscusable> {
  pageUpAndDownDelta = 3;
  cursor!: Cursor;

  private activeItem: T | null;
  private previousActiveItem: T | null;
  private cellMatrix: T[][];

  private readonly activeItemChanges$ = new Subject<GridCursorEvent<T>>();
  private readonly keyMap = new Map<string, () => void>([
    ['ArrowUp', () => this.cursor.moveUp()],
    ['ArrowDown', () => this.cursor.moveDown()],
    ['ArrowLeft', () => this.cursor.moveLeft()],
    ['ArrowRight', () => this.cursor.moveRight()],
    ['Enter', () => this.cursor.moveDown()],
    ['PageDown', () => (this.cursor.y += this.pageUpAndDownDelta)],
    ['PageUp', () => (this.cursor.y -= this.pageUpAndDownDelta)],
    ['Home', () => this.cursor.moveToFirstColumn()],
    ['End', () => this.cursor.moveToLastColumn()],
    ['ctrl+Home', () => this.cursor.moveToFirstRow()],
    ['ctrl+End', () => this.cursor.moveToLastRow()],
  ]);

  constructor(cellMatrix?: T[][]) {
    this.cellMatrix = cellMatrix;

    this.cursor = new Cursor(
      (cursor) => ({
        x: this.cellMatrix?.at(cursor.y).length ?? 0,
        y: this.cellMatrix?.length ?? 0,
      }),
      (cursor) => this.selectCell(cursor)
    );
  }

  get selectedItem(): T | null {
    return this.activeItem;
  }

  get previousItem(): T | null {
    return this.previousActiveItem;
  }

  get activeItemChanges(): Observable<GridCursorEvent<T>> {
    return this.activeItemChanges$.asObservable();
  }

  set cells(cellMatrix: T[][]) {
    this.cellMatrix = cellMatrix;
    const activePosiion = this.findCellPosition(this.activeItem);
    if (activePosiion) {
      this.selectCell(activePosiion);
    } else {
      this.cursor.reset();
    }
  }

  findCellPosition(cell: T): Point | null {
    for (const [rowIdx, row] of this.cellMatrix.entries()) {
      const columnIdx = row.indexOf(cell);

      if (columnIdx >= 0) {
        return {
          x: columnIdx,
          y: rowIdx,
        };
      }
    }

    return null;
  }

  getItem(cursor: Point): T | null {
    return this.cellMatrix.at(cursor.y).at(cursor.x);
  }

  handleKeyDown(event: KeyboardEvent) {
    const handler = this.keyMap.get(describePressedKey(event));
    if (handler) {
      handler();
      event.preventDefault();
    } else if (
      !this.activeItem.value.editMode &&
      !hasModifierKey(event) &&
      event.key.length === 1
    ) {
      this.activeItem?.value.edit(event.key);
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
      this.activeItemChanges$.next({ position: cursor, item });
    }
  }
}
