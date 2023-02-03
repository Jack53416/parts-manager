export interface Editable {
  editMode: boolean;
  edit(key?: string): void;
}

export interface Foscusable {
  value: Editable;
  focus(): void;
  focusOut(): void;
}
