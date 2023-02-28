import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export class PartsEditorComponent implements OnInit, AfterViewInit {
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

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private partsDataService: PartsDataService
  ) {}

  ngOnInit(): void {
    const parts = this.partsDataService.getFailureReport();
    const cellData = parts.map((part) =>
      PART_FAILURES.reduce((acc, key) => {
        acc[key] = new Cell({ value: String(part[key] ?? '') });
        return acc;
      }, {})
    ) as { [key in keyof PartFailure]: Cell }[];

    this.dataSource.data.next(cellData);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
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
