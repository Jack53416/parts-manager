export class MathUtils {
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
