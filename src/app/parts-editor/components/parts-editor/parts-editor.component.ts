import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { GridDataSource } from '../../../grid/models/grid-data-source';
import { Cell } from '../../models/cell';
import { Command } from '../../models/command';
import {
  PartColumns,
  PartFailure,
  PART_FAILURES,
} from '../../models/part-failure';
import { PartEditor } from '../../models/editor';

@Component({
  selector: 'app-parts-editor',
  templateUrl: './parts-editor.component.html',
  styleUrls: ['./parts-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartsEditorComponent implements AfterViewInit, OnDestroy {
  stickyHeaders: Set<string> = new Set([
    'machine',
    'name',
    'articleNo',
    'tool',
  ]);

  partHeaders: PartColumns[] = [...PART_FAILURES];
  displayedColumns: string[] = ['position', ...PART_FAILURES];
  dataSource = new GridDataSource<{ [key in keyof PartFailure]: Cell }>([]);
  commandHistory: Command<Cell>[] = [];
  destroy$ = new Subject<void>();

  private partEditor: PartEditor;
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  @Input()
  set editor(editor: PartEditor) {
    this.partEditor = editor;
    this.dataSource.data.next(editor.workbook);
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
}
