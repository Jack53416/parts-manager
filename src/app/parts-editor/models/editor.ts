import { Subject } from 'rxjs';
import { Cell } from './cell';
import { Command, InsertCommand } from './command';
import { PartFailure } from './part-failure';

export type PartWorkbook = { [key in keyof PartFailure]: Cell }[];

export class PartEditor {
  static commandHistorySize = 30;

  private commandHistory: Command<Cell>[] = [];
  private undoCommandHistory: Command<Cell>[] = [];
  private focusChangeSubject = new Subject<Cell>();

  constructor(
    private readonly data: PartWorkbook,
    public readonly name: string
  ) {}

  get focusChanges$() {
    return this.focusChangeSubject.asObservable();
  }

  get workbook(): PartWorkbook {
    return this.data;
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
