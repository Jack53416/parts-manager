import { PlaneDirection } from '../utils/point';

export interface Editable {
  editMode: boolean;
  edit(key?: string): void;
}

export interface Foscusable {
  value: Editable;
  focus(cursorDirection?: PlaneDirection): void;
  focusOut(): void;
}
