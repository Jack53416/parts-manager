import { Subject } from 'rxjs';
import { Cell } from './cell';
import { Command, InsertCommand } from './command';
import { PartFailure } from './part-failure';
import { formatDate } from '@angular/common';

export type PartWorkbook = { [key in keyof PartFailure]: Cell }[];

export class PartEditor {
  static commandHistorySize = 30;

  public name: string;

  private commandHistory: Command<Cell>[] = [];
  private undoCommandHistory: Command<Cell>[] = [];
  private focusChangeSubject = new Subject<Cell>();
  private valuesChangesSubject = new Subject<void>();

  constructor(
    private data: PartWorkbook,
    public readonly reportDate: Date
  ) {
    this.name = formatDate(this.reportDate, 'dd.MM.YYYY', 'en-US');
  }

  get focusChanges$() {
    return this.focusChangeSubject.asObservable();
  }

  get valuesChanges$() {
    return this.valuesChangesSubject.asObservable();
  }

  get workbook(): PartWorkbook {
    return this.data;
  }

  changeCell(columnName: string, row: number, value: string) {
    this.data[row][columnName].value = value;
    this.valuesChangesSubject.next();
  }

  undo() {
    if (this.commandHistory.length <= 0) {
      return;
    }

    const command = this.commandHistory.pop();
    command.undo();
    this.undoCommandHistory.push(command);
    this.focusChangeSubject.next(command.element);
  }

  redo() {
    if (this.undoCommandHistory.length <= 0) {
      return;
    }
    const command = this.undoCommandHistory.pop();
    this.executeCommand(command, true);
    this.focusChangeSubject.next(command.element);
  }

  insertValue(cell: Cell, value: string) {
    this.executeCommand(new InsertCommand(cell, value));
  }

  private executeCommand(command: Command<Cell>, redo = false) {
    if (command.execute()) {
      this.commandHistory.push(command);

      if (!redo) {
        this.undoCommandHistory = [];
      }
    }

    if (this.commandHistory.length > PartEditor.commandHistorySize) {
      this.commandHistory.shift();
    }
  }
}
