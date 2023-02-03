export function normalizeIndex(
  value: number,
  arrayLength: number,
  wrap = true
) {
  if (!wrap) {
    return Math.min(Math.max(value, 0), arrayLength);
  }

  if (value >= arrayLength) {
    value = value % arrayLength;
  } else if (value < 0) {
    value = arrayLength - 1;
  }

  return value;
}
