import { InjectionToken } from '@angular/core';
import { GridCellDirective } from '../directives/grid-cell.directive';

export const ARIA_GRID = new InjectionToken('Grid implementation');


export interface AriaGrid {
    selectCell(cell: GridCellDirective): void;
}