import { CdkScrollable } from '@angular/cdk/scrolling';
import { ElementRef, Inject, Injectable } from '@angular/core';
import {
  HorizontalDirection,
  PlaneDirection,
  Point,
  VerticalDirection,
} from '../utils/point';
import { CoverReport } from '../models/cover-report';
import { MathUtils } from '../../shared/utils/math-utils';
import { DOCUMENT } from '@angular/common';

interface ScrollOptions {
  coverElement: Element;
  scrollDirection: PlaneDirection;
}

@Injectable()
export class ScrollManagerService {
  static OVERLAP_MARGIN = 2;
  private elementRect: DOMRect;
  private containerRect: DOMRect;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private scrollableContainer: CdkScrollable,
    private elementRef: ElementRef
  ) {}

  private get nativeElement() {
    return this.elementRef.nativeElement;
  }

  scrollIntoView(cursorDirection?: PlaneDirection) {
    this.nativeElement.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    if (cursorDirection) {
      this.scrollPastCover(cursorDirection);
    }
  }

  scrollPastCover(cursorDirection?: PlaneDirection, maxScrollIterations = 10) {
    this.containerRect = this.scrollableContainer
      .getElementRef()
      .nativeElement.getBoundingClientRect();

    let iteration = 0;

    do {
      this.elementRect = this.nativeElement.getBoundingClientRect();
      const scrollOptions = this.getScrollOptions(cursorDirection);

      if (!scrollOptions.coverElement) {
        break;
      }

      const offset = this.getScrollOffset(scrollOptions);

      this.scrollableContainer
        .getElementRef()
        .nativeElement.scrollBy({ left: offset.x, top: offset.y });

      iteration++;
    } while (iteration < maxScrollIterations);
  }

  private getElementCover(point?: Point): Element | null {
    const topElement = this.document.elementFromPoint(
      MathUtils.clamp(
        point.x,
        this.containerRect.left + 1,
        this.containerRect.right - 1
      ),
      MathUtils.clamp(
        point.y,
        this.containerRect.top + 1,
        this.containerRect.bottom - 1
      )
    );

    if (
      this.nativeElement.isSameNode(topElement) ||
      this.nativeElement.contains(topElement) ||
      topElement?.contains(this.nativeElement)
    ) {
      return null;
    }

    return topElement;
  }

  private getScrollDirections(cursorDirection: PlaneDirection): PlaneDirection {
    const screenCenter = {
      x: this.document.documentElement.clientHeight / 2,
      y: this.document.documentElement.clientWidth / 2,
    } as Point;

    return {
      x:
        Math.abs(cursorDirection.x) *
        this.getHorizontalScrollDirection(screenCenter),
      y:
        Math.abs(cursorDirection.y) *
        this.getVerticalScrollDirection(screenCenter),
    };
  }

  private getHorizontalScrollDirection(
    screenCenter: Point
  ): HorizontalDirection {
    if (this.elementRect.left < screenCenter.x) {
      return HorizontalDirection.left;
    }

    if (this.elementRect.right > screenCenter.x) {
      return HorizontalDirection.right;
    }

    return HorizontalDirection.none;
  }

  private getVerticalScrollDirection(screenCenter: Point): VerticalDirection {
    if (this.elementRect.top < screenCenter.y) {
      return VerticalDirection.up;
    }

    if (this.elementRect.bottom > screenCenter.y) {
      return VerticalDirection.down;
    }

    return VerticalDirection.none;
  }

  private getScrollOffset({
    scrollDirection,
    coverElement,
  }: ScrollOptions): Point {
    const coverElementRect = coverElement.getBoundingClientRect();

    const scrollOffset = {
      x:
        scrollDirection.x <= 0
          ? coverElementRect.right - this.elementRect.left
          : this.elementRect.right - coverElementRect.left,
      y:
        scrollDirection.y <= 0
          ? coverElementRect.bottom - this.elementRect.top
          : this.elementRect.bottom - coverElementRect.top,
    };

    scrollOffset.x = Math.ceil(scrollOffset.x) * scrollDirection.x;
    scrollOffset.y = Math.ceil(scrollOffset.y) * scrollDirection.y;

    return scrollOffset;
  }

  private getElementCovers(): CoverReport {
    return new CoverReport({
      leftTop: this.getElementCover({
        x: this.elementRect.left,
        y: this.elementRect.top,
      }),
      leftBottom: this.getElementCover({
        x: this.elementRect.left,
        y: Math.floor(
          this.elementRect.bottom - ScrollManagerService.OVERLAP_MARGIN
        ),
      }),
      rightTop: this.getElementCover({
        x: Math.floor(
          this.elementRect.right - ScrollManagerService.OVERLAP_MARGIN
        ),
        y: this.elementRect.top,
      }),
      rightBottom: this.getElementCover({
        x: Math.floor(
          this.elementRect.right - ScrollManagerService.OVERLAP_MARGIN
        ),
        y: Math.floor(
          this.elementRect.bottom - ScrollManagerService.OVERLAP_MARGIN
        ),
      }),
    });
  }

  private getScrollOptions(cursorDirection: PlaneDirection): ScrollOptions {
    const coverReport = this.getElementCovers();

    if (coverReport.leftCovered) {
      return {
        coverElement: coverReport.leftTop,
        scrollDirection: {
          x: HorizontalDirection.left,
          y: VerticalDirection.none,
        },
      };
    } else if (coverReport.rightCovered) {
      return {
        coverElement: coverReport.rightTop,
        scrollDirection: {
          x: HorizontalDirection.right,
          y: VerticalDirection.none,
        },
      };
    } else if (coverReport.topCovered) {
      return {
        coverElement: coverReport.leftTop,
        scrollDirection: {
          x: HorizontalDirection.none,
          y: VerticalDirection.down,
        },
      };
    } else if (coverReport.bottomCovered) {
      return {
        coverElement: coverReport.leftBottom,
        scrollDirection: {
          x: HorizontalDirection.none,
          y: VerticalDirection.down,
        },
      };
    }

    const scrollDirection = this.getScrollDirections(cursorDirection);
    const horizontalRef = scrollDirection.x <= 0 ? 'left' : 'right';
    const vertialRef = scrollDirection.y <= 0 ? 'Top' : 'Bottom';

    return {
      coverElement: coverReport[horizontalRef + vertialRef],
      scrollDirection,
    };
  }
}
