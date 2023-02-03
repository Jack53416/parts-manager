import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { keysPressed } from '../../../shared/utils/keyboard';
import { Editable } from '../../models/editable';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grid-cell-value',
  templateUrl: './grid-cell-value.component.html',
  styleUrls: ['./grid-cell-value.component.scss'],
})
export class GridCellValueComponent implements OnInit, Editable {
  @Input() element: unknown;
  @Input() key: string;

  @Input() value: string;
  @Input() comment: string;

  @Output() editConfirmed = new EventEmitter<void>();

  editMode = false;
  editInput: FormControl<string> = new FormControl('');
  constructor() {}

  @ViewChild('textInput', { static: false, read: ElementRef })
  set textInputRef(value: ElementRef) {
    if (value) {
      value.nativeElement.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (keysPressed(event, { key: 'Enter' })) {
      this.editMode = false;
      this.confirmChanges();
    }

    event.stopPropagation();
  }

  ngOnInit(): void {}

  edit(key: string) {
    this.editInput.reset(key);
    this.editMode = true;
  }

  confirmChanges() {
    // ToDo: Outsource changes to parts editor
    this.element[this.key] = this.editInput.value;
    this.editConfirmed.next();
  }
}
