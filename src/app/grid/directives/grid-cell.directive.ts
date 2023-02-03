import { CdkColumnDef } from '@angular/cdk/table';
import {
  AfterContentInit,
  ContentChild,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { GridCellValueComponent } from '../components/grid-cell-value/grid-cell-value.component';
import { AriaGrid, ARIA_GRID } from '../models/aria-grid';
import { Editable } from '../models/editable';

@Directive({
  selector: 'td[appGridCell]',
})
export class GridCellDirective implements Editable, OnInit {
  @ContentChild(GridCellValueComponent) cellValue: GridCellValueComponent;

  constructor(
    @Inject(ARIA_GRID) private grid: AriaGrid,
    private elementRef: ElementRef,
    private render2: Renderer2,
    private cdkColumnDef: CdkColumnDef
  ) {}

  get inEditMode(): boolean {
    return this.cellValue?.editMode ?? false;
  }

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

  focus() {
    this.nativeElement.focus();
    this.render2.setAttribute(this.nativeElement, 'tabindex', '0');
    this.render2.addClass(this.nativeElement, 'selected');
  }

  focusOut() {
    this.render2.setAttribute(this.nativeElement, 'tabindex', '-1');
    this.render2.removeClass(this.nativeElement, 'selected');
  }

  edit(key?: string) {
    this.cellValue.edit(key ?? '');
  }
}
