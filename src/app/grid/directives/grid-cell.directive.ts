import { CdkColumnDef } from '@angular/cdk/table';
import {
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GridCellValueComponent } from '../components/grid-cell-value/grid-cell-value.component';
import { AriaGrid, ARIA_GRID } from '../models/aria-grid';
import { Foscusable } from '../models/editable';

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
    private cdkColumnDef: CdkColumnDef
  ) {}

  get columnName() {
    return this.cdkColumnDef.cssClassFriendlyName;
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

  @HostListener('mousedown')
  handleMouseKeyDown() {
    this.grid.selectCell(this);
  }

  ngOnInit(): void {
    this.render2.setAttribute(this.nativeElement, 'role', 'gridcell');
    this.render2.setAttribute(this.nativeElement, 'tabindex', '-1');
  }

  ngAfterViewInit(): void {
    this.value.editConfirmed
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.nativeElement.focus());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  focus() {
    this.nativeElement.focus();
    this.render2.setAttribute(this.nativeElement, 'tabindex', '0');
    this.render2.addClass(this.nativeElement, 'selected');
  }

  focusOut() {
    this.render2.setAttribute(this.nativeElement, 'tabindex', '-1');
    this.render2.removeClass(this.nativeElement, 'selected');
  }
}
