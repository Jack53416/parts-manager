export interface Editable {
  inEditMode: boolean;
  edit(key?: string): void;
  focus(): void;
  focusOut(): void;
}
