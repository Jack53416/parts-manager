import Mexp from 'math-expression-evaluator';
import { Prototype } from '../../shared/utils/prototype';

export class Cell implements Prototype<Cell> {
  static mathParser = new Mexp();
  comment: string;

  readonly column: string;
  readonly row: number;

  private content: string;
  private formula: string;

  constructor({
    value,
    column,
    row,
    formula,
    comment,
  }: {
    value: string;
    column: string;
    row: number;
    formula?: string;
    comment?: string;
  }) {
    this.column = column;
    this.row = row;
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
      const equation = cellValue.slice(1, cellValue.length);
      try {
        this.content = Cell.mathParser.eval(equation, [], undefined).toString();
      } catch (err) {
        this.content = 'NaN';
      }
    } else {
      this.content = cellValue;
      this.formula = null;
    }
  }

  copy(): Cell {
    return new Cell({
      value: this.content,
      formula: this.formula,
      comment: this.comment,
      column: this.column,
      row: this.row
    });
  }

  apply(other: Cell): void {
    this.content = other.content;
    this.formula = other.formula;
    this.comment = other.comment;
  }
}
