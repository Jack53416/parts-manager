import { Cell } from './cell';
import { Command, InsertCommand } from './command';
import { PartFailure } from './part-failure';

export type PartWorkbook = { [key in keyof PartFailure]: Cell }[];

export class PartEditor {
  static commandHistorySize = 30;

  private readonly commandHistory: Command<Cell>[] = [];
  private readonly undoCommandHistory: Command<Cell>[] = [];

  constructor(
    private readonly data: PartWorkbook,
    public readonly name: string
  ) {}

  get workbook(): PartWorkbook {
    return this.data;
  }

  undo() {
    if (this.commandHistory.length <= 0) {
      return;
    }

    this.commandHistory.pop().undo();
  }

  redo() {
    //ToDO (Jacek)
    if (this.undoCommandHistory.length <= 0) {
      return;
    }

    // this.executeCommand(this.undoCommandHistory.pop());
  }

  insertValue(cell: Cell, value: string) {
    this.executeCommand(new InsertCommand(cell, value));
  }

  private executeCommand(command: Command<Cell>) {
    if (command.execute()) {
      this.commandHistory.push(command);
    }

    if (this.commandHistory.length > PartEditor.commandHistorySize) {
      this.commandHistory.shift();
    }
  }
}
