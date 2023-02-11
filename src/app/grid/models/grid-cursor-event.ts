import { GridCellDirective } from '../directives/grid-cell.directive';
import { Point } from '../utils/point';

export interface GridCursorEvent<T> {
  position: Point;
  item: T;
}
