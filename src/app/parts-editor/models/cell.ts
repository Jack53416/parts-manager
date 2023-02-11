import { Prototype } from '../../shared/utils/prototype';

export class Cell implements Prototype<Cell> {
  comment: string;
  private content: string;
  private formula: string;

  constructor({
    value,
    formula,
    comment,
  }: {
    value: string;
    formula?: string;
    comment?: string;
  }) {
    this.content = value;
    this.formula = formula;
    this.comment = comment;
  }

  get value() {
    return this.content;
  }

  set value(cellValue: string) {
    if (cellValue.startsWith('=')) {
      this.formula = cellValue;
      // ToDo - Parse expression here
      this.content = cellValue;
    } else {
      this.content = cellValue;
    }
  }

  copy(): Cell {
    return new Cell({
      value: this.content,
      formula: this.formula,
      comment: this.comment,
    });
  }

  apply(other: Cell): void {
    this.content = other.content;
    this.formula = other.formula;
    this.comment = other.comment;
  }
}
