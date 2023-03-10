import { hasModifierKey } from '@angular/cdk/keycodes';
export type ModifierKey = 'altKey' | 'shiftKey' | 'ctrlKey' | 'metaKey';

export interface KeyCombination {
  key: string;
  modiifiers?: ModifierKey[];
}

function isModifierKey(key: string): key is ModifierKey {
  return key in ['altKey', 'shiftKey', 'ctrlKey', 'metaKey'];
}

export function describePressedKey(event: KeyboardEvent): string {
  const modifierKeys = [
    [event.ctrlKey, 'ctrl'],
    [event.altKey, 'alt'],
    [event.shiftKey, 'shift'],
    [event.metaKey, 'meta'],
  ]
    .filter(([keyPressed, _]) => keyPressed)
    .map(([_, keyName]) => keyName);

  return [...modifierKeys, event.key].join('+');
}

export function keysPressed(
  event: KeyboardEvent,
  ...keys: KeyCombination[]
): boolean {
  return keys.reduce((acc, keyCombination) => {
    let modifiersMatched = hasModifierKey(
      event,
      ...(keyCombination.modiifiers ?? [])
    );

    if (!keyCombination.modiifiers) {
      modifiersMatched = !modifiersMatched;
    }

    return acc || (keyCombination.key === event.key && modifiersMatched);
  }, false);
}

export function handleKeysPressed(
  event: KeyboardEvent,
  keyCombination: KeyCombination,
  handler: () => void
): boolean {
  if (keysPressed(event, keyCombination)) {
    handler();
    event.preventDefault();
    return true;
  }
  return false;
}
