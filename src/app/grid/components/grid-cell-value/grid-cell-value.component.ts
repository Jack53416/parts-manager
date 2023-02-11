import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { describePressedKey } from '../../../shared/utils/keyboard';
import { Editable } from '../../models/editable';

@Component({
  selector: 'app-grid-cell-value',
  templateUrl: './grid-cell-value.component.html',
  styleUrls: ['./grid-cell-value.component.scss'],
})
export class GridCellValueComponent implements OnInit, Editable {
  @Input() value: string;
  @Input() comment: string;

  @Output() editDiscarded = new EventEmitter<void>();
  @Output() editConfirmed = new EventEmitter<string>();

  editMode = false;
  editInput: FormControl<string> = new FormControl('');
  private readonly keyMap = new Map<string, () => void>([
    ['Enter', () => this.confirmChanges()],
    [
      'Escape',
      () => {
        this.editMode = false;
        this.editDiscarded.next();
      },
    ],
  ]);
  constructor() {}

  @ViewChild('textInput', { static: false, read: ElementRef })
  set textInputRef(value: ElementRef) {
    if (value) {
      value.nativeElement.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const handler = this.keyMap.get(describePressedKey(event));
    if (handler) {
      handler();
    }
    if (this.editMode) {
      event.stopPropagation();
    }
  }

  ngOnInit(): void {}

  handleBlur() {
    if (this.editMode) {
      this.confirmChanges();
    }
  }

  edit(key?: string) {
    this.editInput.reset(key ?? this.value);
    this.editMode = true;
  }

  confirmChanges() {
    this.editMode = false;
    this.editConfirmed.next(this.editInput.value);
  }
}
