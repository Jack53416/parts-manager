import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { GridDirective } from '../../../grid/directives/grid.directive';
import { GridDataSource } from '../../../grid/models/grid-data-source';
import { Cell } from '../../models/cell';
import { Command, InsertCommand } from '../../models/command';
import {
  PartColumns,
  PartFailure,
  PART_FAILURES,
} from '../../models/part-failure';
import { PartsDataService } from '../../services/parts-data.service';

@Component({
  selector: 'app-parts-editor',
  templateUrl: './parts-editor.component.html',
  styleUrls: ['./parts-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartsEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  static commandHistorySize = 50;

  @ViewChild(GridDirective, { static: true }) grid: GridDirective;
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

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private partsDataService: PartsDataService
  ) {}

  ngOnInit(): void {
    this.partsDataService.currentReport$
      .pipe(
        takeUntil(this.destroy$),
        map((partReport) => this.convertPartReport(partReport))
      )
      .subscribe((cellData) => this.dataSource.data.next(cellData));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  convertPartReport(
    parts: Partial<PartFailure>[]
  ): { [key in keyof PartFailure]: Cell }[] {
    return parts.map((part) =>
      PART_FAILURES.reduce((acc, key) => {
        acc[key] = new Cell({ value: String(part[key] ?? '') });
        return acc;
      }, {})
    ) as { [key in keyof PartFailure]: Cell }[];
  }

  undoCommand() {
    if (this.commandHistory.length <= 0) {
      return;
    }

    this.commandHistory.pop().undo();
  }

  insertValue(cell: Cell, value: string) {
    this.executeCommand(new InsertCommand(cell, value));
  }

  private executeCommand(command: Command<Cell>) {
    if (command.execute()) {
      this.commandHistory.push(command);
    }

    if (this.commandHistory.length > PartsEditorComponent.commandHistorySize) {
      this.commandHistory.shift();
    }
  }
}
