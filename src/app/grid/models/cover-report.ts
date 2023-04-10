export interface CoverDetails {
  leftTop: Element | null;
  leftBottom: Element | null;
  rightTop: Element | null;
  rightBottom: Element | null;
}

export class CoverReport implements CoverDetails {
  readonly leftTop: Element;
  readonly leftBottom: Element;
  readonly rightTop: Element;
  readonly rightBottom: Element;

  constructor(covers: CoverDetails) {
    this.leftTop = covers.leftTop;
    this.leftBottom = covers.leftBottom;
    this.rightTop = covers.rightBottom;
    this.rightBottom = covers.rightBottom;
  }

  get leftCovered(): boolean {
    return (
      this.leftTop && this.leftBottom && !this.rightTop && !this.rightBottom
    );
  }

  get rightCovered(): boolean {
    return (
      this.rightTop && this.rightBottom && !this.leftTop && !this.leftBottom
    );
  }

  get topCovered() {
    return (
      this.rightTop && this.leftTop && !this.rightBottom && !this.leftBottom
    );
  }

  get bottomCovered() {
    return (
      this.rightBottom && this.leftBottom && !this.rightTop && !this.leftTop
    );
  }
}
