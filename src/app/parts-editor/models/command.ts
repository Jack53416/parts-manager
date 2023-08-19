import { Prototype } from '../../shared/utils/prototype';
import { Cell } from './cell';

export abstract class Command<T extends Prototype<T>> {
  protected item: T;
  protected backup: T;

  constructor(item: T) {
    this.item = item;
  }

  get element(): T {
    return this.item.copy();
  }

  undo() {
    this.item.apply(this.backup);
  }

  saveBackup() {
    this.backup = this.item.copy();
  }

  /**
   * Executes a command. Returns true if command should be added to a command history.
   */
  abstract execute(): boolean;
}

export class InsertCommand extends Command<Cell> {
  constructor(cell: Cell, private input: string) {
    super(cell);
  }

  execute(): boolean {
    this.saveBackup();
    this.item.value = this.input;
    return true;
  }
}

export class UpdateCommentCommand extends Command<Cell> {
  constructor(cell: Cell, private comment: string) {
    super(cell);
  }

  execute(): boolean {
    this.saveBackup();
    this.item.comment = this.comment;
    return true;
  }
}
