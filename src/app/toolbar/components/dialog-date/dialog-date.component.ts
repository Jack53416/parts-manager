import { Component, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {DialogData} from '../toolbar/toolbar.component';

@Component({
  selector: 'app-dialog-date',
  templateUrl: './dialog-date.component.html',
  styleUrls: ['./dialog-date.component.scss']
})
export class DialogDateComponent {
  newDate: Date;
  oldDate: Date;

  constructor(public dialogRef: MatDialogRef<DialogDateComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.oldDate = data.date;
  }

  @HostListener('window:keyup.Enter', ['$event'])
  onConfirmClick() {
    if (this.newDate !== undefined) {
      this.dialogRef.close(this.newDate);
    } else {
      this.dialogRef.close(this.oldDate);
    }
  }

  onClearClick(): void {
    this.dialogRef.close();
  }

  getDate(dateObject){
    // eslint-disable-next-line no-underscore-dangle
    this.newDate = dateObject.value._d;
  }
}
