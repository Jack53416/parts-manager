import { CdkTable } from '@angular/cdk/table';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GridCellDirective } from '../../directives/grid-cell.directive';
import { AriaGrid, ARIA_GRID } from '../../models/aria-grid';
import { GridKeyManager } from '../../utils/grid-key-manager';
import { Point } from '../../utils/point';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [{ provide: ARIA_GRID, useExisting: GridComponent }],
})
export class GridComponent
  implements AriaGrid, OnInit, OnDestroy, AfterContentInit
{
  @ContentChildren(GridCellDirective, { descendants: true }) gridCells!: QueryList<GridCellDirective>;
  @ContentChild(CdkTable, { static: true, read: ElementRef }) table: ElementRef;


  keyManager: GridKeyManager<GridCellDirective> = new GridKeyManager();

  private cellMatrix: GridCellDirective[][];
  private destroy$ = new Subject<void>();

  constructor(
    private renderer2: Renderer2
  ) {}

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.keyManager.handleKeyDown(event);
  }

  selectCell(cell: GridCellDirective) {
    const position = this.keyManager.findCellPosition(cell);
    if (position) {
      this.keyManager.cursor.setPosition(position);
    }
  }

  ngOnInit(): void {
    this.keyManager.activeItemChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      if (this.keyManager.previousItem) {
        this.toggleColumnHeaderHighlight(this.keyManager.previousItem);
      }
      this.toggleColumnHeaderHighlight(this.keyManager.selectedItem);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.keyManager.destroy();
  }

  ngAfterContentInit(): void {
    this.gridCells.changes.subscribe((value) => {
      this.initGrid(value.toArray());
      this.keyManager.cells = this.cellMatrix;
    });
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
