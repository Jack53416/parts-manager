import { Component, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DialogData} from '../toolbar/toolbar.component';

@Component({
  selector: 'app-dialog-date',
  templateUrl: './dialog-date.component.html',
  styleUrls: ['./dialog-date.component.scss']
})
export class DialogDateComponent {
  newDate = '';

  constructor(public dialogRef: MatDialogRef<DialogDateComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  @HostListener('window:keyup.Enter', ['$event'])
  onConfirmClick() {
    this.dialogRef.close(this.newDate);
  }

  onClearClick(): void {
    this.dialogRef.close();
  }

}
