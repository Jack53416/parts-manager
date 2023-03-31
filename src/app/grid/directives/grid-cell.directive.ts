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
  Optional,
  Renderer2,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GridCellValueComponent } from '../components/grid-cell-value/grid-cell-value.component';
import { AriaGrid, ARIA_GRID } from '../models/aria-grid';
import { Foscusable } from '../models/editable';
import { PlaneDirection } from '../utils/point';
import { ScrollManagerService } from '../services/scroll-manager.service';

@Directive({
  selector: 'td[appGridCell]',
  providers: [{ provide: ScrollManagerService }],
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
    private scrollManager: ScrollManagerService,
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
    this.scrollManager.scrollIntoView(cursorDirection);
    this.render2.setAttribute(this.nativeElement, 'tabindex', '0');
  }

  focusOut() {
    this.render2.setAttribute(this.nativeElement, 'tabindex', '-1');
  }
}
