import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GridDataSource } from '../../../grid/models/grid-data-source';
import { Cell } from '../../models/cell';
import { Command } from '../../models/command';
import {
  PartFailure,
  PART_FAILURE_COLUMNS,
  PartColumnDefinition,
} from '../../models/part-failure';
import { PartEditor } from '../../models/editor';
import { GridDirective } from '../../../grid/directives/grid.directive';
import { GridCursorEvent } from '../../../grid/models/grid-cursor-event';
import { GridCellDirective } from '../../../grid/directives/grid-cell.directive';

@Component({
  selector: 'app-parts-editor',
  templateUrl: './parts-editor.component.html',
  styleUrls: ['./parts-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartsEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild(GridDirective, { static: true }) grid: GridDirective;
  stickyHeaders: Set<string> = new Set([
    'machine',
    'name',
    'articleNo',
    'tool',
  ]);

  partHeaders: PartColumnDefinition[] = [...PART_FAILURE_COLUMNS];
  displayedColumns: string[] = [
    'position',
    ...PART_FAILURE_COLUMNS.map((colDef) => colDef.name),
  ];
  dataSource = new GridDataSource<{ [key in keyof PartFailure]: Cell }>([]);
  commandHistory: Command<Cell>[] = [];
  destroy$ = new Subject<void>();

  private partEditor: PartEditor;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  @Input()
  set editor(editor: PartEditor) {
    this.destroy$.next();
    this.partEditor = editor;
    this.dataSource.data.next(editor.workbook);
    this.partEditor.focusChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((focusedCell) => this.onCellFocusChanged(focusedCell));
    this.partEditor.valuesChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) => this.changeDetectorRef.detectChanges());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  insertValue(cell: Cell, value: string) {
    this.partEditor.insertValue(cell, value);
  }

  updateComment(cell: Cell) {
    this.partEditor.updateComment('Dupa', cell);
  }

  saveCursorPos(event: GridCursorEvent<GridCellDirective>) {
    const partEditor = this.partEditor;

    if (partEditor === null) {
      return;
    }

    partEditor.cursor = {
      row: event.position.y,
      columnName: event.item.columnName,
    };
  }

  private onCellFocusChanged(focusedCell: Cell) {
    this.changeDetectorRef.detectChanges();
    const columnIdx = this.partHeaders.findIndex(
      (header) => header.name === focusedCell.column
    );

    if (columnIdx <= 0) {
      return;
    }

    this.grid.selectCell({
      x: columnIdx,
      y: focusedCell.row,
    });
  }
}
