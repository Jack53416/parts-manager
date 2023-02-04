import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
} from '@angular/core';
import { pairwise, Subject, takeUntil, tap } from 'rxjs';
import { AriaGrid, ARIA_GRID } from '../models/aria-grid';
import { GridKeyManager } from '../utils/grid-key-manager';
import { Point } from '../utils/point';
import { GridCellDirective } from './grid-cell.directive';

@Directive({
  selector: 'table[appGrid]',
  providers: [{ provide: ARIA_GRID, useExisting: GridDirective }],
})
export class GridDirective
  implements AfterContentInit, OnDestroy, OnInit, AriaGrid
{
  @Input() selectionClassName = 'selected';
  @ContentChildren(GridCellDirective) cells: QueryList<GridCellDirective>;

  @HostBinding('attr.role') role = 'grid';

  keyManager: GridKeyManager<GridCellDirective> = new GridKeyManager();

  private cellMatrix: GridCellDirective[][];
  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {}

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.keyManager.handleKeyDown(event);
  }

  ngOnInit(): void {
    this.keyManager.activeItemChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((cursorEvent) => {
          this.toggleColumnHeaderHighlight(cursorEvent.item);
          this.toggleRowHeaderHighlight(cursorEvent.position);
        }),
        pairwise()
      )
      .subscribe(([previousEvent, _]) => {
        this.toggleColumnHeaderHighlight(previousEvent.item);
        this.toggleRowHeaderHighlight(previousEvent.position);
      });
  }

  ngAfterContentInit(): void {
    this.cells.changes.pipe(takeUntil(this.destroy$)).subscribe((gridCells) => {
      this.initCellMatrix(gridCells.toArray());
      this.keyManager.cells = this.cellMatrix;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectCell(cell: GridCellDirective): void {
    const position = this.keyManager.findCellPosition(cell);
    if (position) {
      this.keyManager.cursor.setPosition(position);
    }
  }

  private initCellMatrix(cells: GridCellDirective[]) {
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
    const columnHeaderElement = this.elementRef.nativeElement.querySelector(
      `th.cdk-column-${columnName}[role="columnheader"]`
    );

    if (columnHeaderElement) {
      this.toggleSelectionClass(columnHeaderElement);
    }
  }

  private toggleRowHeaderHighlight(itemPos: Point) {
    const rowItem = this.elementRef.nativeElement.querySelector(
      `tbody tr:nth-child(${itemPos.y + 1})`
    );

    if (rowItem) {
      this.toggleSelectionClass(rowItem);
    }
  }

  private toggleSelectionClass(htmlElement: HTMLElement) {
    if (htmlElement.classList.contains(this.selectionClassName)) {
      this.renderer2.removeClass(htmlElement, this.selectionClassName);
    } else {
      this.renderer2.addClass(htmlElement, this.selectionClassName);
    }
  }
}
