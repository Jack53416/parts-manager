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
