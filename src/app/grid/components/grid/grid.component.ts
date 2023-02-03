import { DataSource } from '@angular/cdk/collections';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GridCellDirective } from '../../directives/grid-cell.directive';
import { AriaGrid, ARIA_GRID } from '../../models/aria-grid';
import { GridKeyManager } from '../../utils/grid-key-manager';
import { Point } from '../../utils/point';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [{ provide: ARIA_GRID, useExisting: GridComponent }],
})
export class GridComponent
  implements AriaGrid, OnInit, OnDestroy, AfterViewInit
{
  @ViewChildren(GridCellDirective) gridCells!: QueryList<GridCellDirective>;
  @ViewChild('table', { static: true, read: ElementRef }) table: ElementRef;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new ExampleDataSource();
  cursorIndex!: Point;
  keyManager!: GridKeyManager<GridCellDirective>;

  private cellMatrix: GridCellDirective[][];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2
  ) {}

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.keyManager.handleKeyDown(event);
  }

  selectCell(cell: GridCellDirective) {
    for (const [rowIdx, row] of this.cellMatrix.entries()) {
      const columnIdx = row.indexOf(cell);

      if (columnIdx >= 0) {
        return this.keyManager.cursor.setPosition({
          x: columnIdx,
          y: rowIdx
        });
      }
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.keyManager.destroy();
  }
  ngAfterViewInit(): void {
    this.initGrid(this.gridCells.toArray());
    this.keyManager = new GridKeyManager(this.cellMatrix);
    this.keyManager.activeItemChanges.subscribe(() => {
      if (this.keyManager.previousItem) {
        this.toggleColumnHeaderHighlight(this.keyManager.previousItem);
      }
      this.toggleColumnHeaderHighlight(this.keyManager.selectedItem);
    });

    this.selectCell(this.cellMatrix[0][0]);
    this.changeDetectorRef.detectChanges();
  }

  private initGrid(cells: GridCellDirective[]) {
    const cellMap = new Map<HTMLTableRowElement, GridCellDirective[]>();

    cells.forEach((cell) => {
      if (cellMap.has(cell.parentRowElement)) {
        cellMap.get(cell.parentRowElement).push(cell);
      } else {
        cellMap.set(cell.parentRowElement, [cell]);
      }
    });

    this.cellMatrix = Array.from(cellMap.values());
  }

  private toggleColumnHeaderHighlight(item: GridCellDirective) {
    const columnName = item.columnName;
    const columnHeaderElement = this.table.nativeElement.querySelector(
      `th.cdk-column-${columnName}[role="columnheader"]`
    );

    if (!columnHeaderElement) {
      return;
    }

    if (columnHeaderElement.classList.contains('selected')) {
      this.renderer2.removeClass(columnHeaderElement, 'selected');
    } else {
      this.renderer2.addClass(columnHeaderElement, 'selected');
    }
  }
}

export class ExampleDataSource extends DataSource<PeriodicElement> {
  /** Stream of data that is provided to the table. */
  data = new BehaviorSubject<PeriodicElement[]>(ELEMENT_DATA);

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<PeriodicElement[]> {
    return this.data;
  }

  disconnect() {}
}
