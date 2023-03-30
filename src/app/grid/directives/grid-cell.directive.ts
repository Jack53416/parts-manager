import { CdkScrollable } from '@angular/cdk/scrolling';
import { CdkColumnDef } from '@angular/cdk/table';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GridCellValueComponent } from '../components/grid-cell-value/grid-cell-value.component';
import { AriaGrid, ARIA_GRID } from '../models/aria-grid';
import { Foscusable } from '../models/editable';
import { Direction, PlaneDirection, Point } from '../utils/point';

@Directive({
  selector: 'td[appGridCell]',
})
export class GridCellDirective
  implements Foscusable, OnInit, OnDestroy, AfterViewInit
{
  @ContentChild(GridCellValueComponent) value: GridCellValueComponent;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(ARIA_GRID) private grid: AriaGrid,
    private elementRef: ElementRef,
    private render2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Optional() private scrollableContainer: CdkScrollable,
    @Optional() private cdkColumnDef: CdkColumnDef
  ) {}

  get columnName(): string | null {
    return this.cdkColumnDef?.cssClassFriendlyName;
  }

  get parentRowElement(): HTMLTableRowElement | null {
    if (this.nativeElement.parentElement instanceof HTMLTableRowElement) {
      return this.nativeElement.parentElement;
    }
    return null;
  }

  get nativeElement(): HTMLTableCellElement {
    return this.elementRef.nativeElement as HTMLTableCellElement;
  }

  get boundingRect(): DOMRect {
    return this.nativeElement.getBoundingClientRect();
  }

  set selectionSource(value: boolean) {
    if (value) {
      this.render2.addClass(this.nativeElement, 'selection-source');
    } else {
      this.render2.removeClass(this.nativeElement, 'selection-source');
    }
  }

  @HostListener('mousedown')
  handleMouseKeyDown() {
    this.grid.selectCell(this);
  }

  @HostListener('dblclick')
  handleDoubleClick() {
    this.value.edit();
  }

  ngOnInit(): void {
    this.render2.setAttribute(this.nativeElement, 'role', 'gridcell');
    this.render2.setAttribute(this.nativeElement, 'tabindex', '-1');
  }

  ngAfterViewInit(): void {
    this.value.editDiscarded
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  focus(cursorDirection?: PlaneDirection) {
    this.nativeElement.focus({ preventScroll: true });
    this.scrollIntoView(cursorDirection);
    this.render2.setAttribute(this.nativeElement, 'tabindex', '0');
  }

  focusOut() {
    this.render2.setAttribute(this.nativeElement, 'tabindex', '-1');
  }

  scrollIntoView(cursorDirection?: PlaneDirection) {
    this.nativeElement.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    this.scrollPastCover(cursorDirection);
  }

  private scrollPastCover(
    cursorDirection?: PlaneDirection,
    maxScrollIterations = 1
  ) {
    const scrollDirection = {
      x: cursorDirection?.x !== 0 ? this.getHorizontalScrollDirection() : 0,
      y: cursorDirection?.y !== 0 ? this.getVerticalScrollDirection() : 0,
    };

    let cover = this.getElementCover(scrollDirection);
    let iteration = 0;

    while (cover !== null && iteration < maxScrollIterations) {
      const offset = this.getScrollOffset(cover, scrollDirection);
      this.scrollableContainer
        .getElementRef()
        .nativeElement.scrollBy({ left: offset.x, top: offset.y });
      //cover = this.getElementCover(scrollDirection);
      iteration++;
    }
  }

  private getElementCover(scrollDirections: PlaneDirection): Element | null {
    const conteinerEl = this.scrollableContainer.getElementRef().nativeElement;

    const rect = this.nativeElement.getBoundingClientRect();

    // Cells in  table are overlapped, meaning a cell will share its top, left corner iwth right bottom corner of the other one
    const point = {
      x: scrollDirections.x <= 0 ? rect.left : rect.right - 1,
      y: scrollDirections.y <= 0 ? rect.top : rect.bottom - 1,
    } as Point;

    console.log(`scrollDirections: ${JSON.stringify(scrollDirections)}`);
    // const topElement = this.document.elementFromPoint(
    //   Math.min(
    //     Math.max(point.x, conteinerEl.getBoundingClientRect().left),
    //     conteinerEl.getBoundingClientRect().right
    //   ),
    //   Math.min(
    //     Math.max(point.y, conteinerEl.getBoundingClientRect().top),
    //     conteinerEl.getBoundingClientRect().bottom
    //   )
    // );

    const topElement = this.document.elementFromPoint(point.x, point.y);

    if (
      this.nativeElement.isSameNode(topElement) ||
      this.nativeElement.contains(topElement) ||
      topElement?.contains(this.nativeElement)
    ) {
      return null;
    }

    console.log(topElement);
    return topElement;
  }

  private getScrollOffset(
    coverElement: Element,
    scrollDirections: PlaneDirection
  ): Point {
    const coverRect = coverElement.getBoundingClientRect();

    const scrollOffset = {
      x:
        scrollDirections.x <= 0
          ? (coverRect.right - this.boundingRect.left)
          : (this.boundingRect.right - coverRect.left),
      y:
        scrollDirections.y <= 0
          ? coverRect.bottom - this.boundingRect.top
          : this.boundingRect.bottom - coverRect.top,
    };

    scrollOffset.x *= scrollDirections.x;
    scrollOffset.y *= scrollDirections.y;
    console.log(`scroll offset: ${JSON.stringify(scrollOffset)}`);

    return scrollOffset;
  }

  private getHorizontalScrollDirection(): Direction {
    const rect = this.nativeElement.getBoundingClientRect();

    const screenCenter = {
      x: this.document.documentElement.clientHeight / 2,
      y: this.document.documentElement.clientWidth / 2,
    } as Point;

    if (rect.left < screenCenter.x) {
      return -1;
    }

    if (rect.right > screenCenter.x) {
      return 1;
    }

    return 0;
  }

  private getVerticalScrollDirection(): Direction {
    const rect = this.nativeElement.getBoundingClientRect();
    const screenCenter = {
      x: this.document.documentElement.clientHeight / 2,
      y: this.document.documentElement.clientWidth / 2,
    } as Point;

    if (rect.top < screenCenter.y) {
      return -1;
    }

    if (rect.bottom > screenCenter.y) {
      return 1;
    }

    return 0;
  }
}
