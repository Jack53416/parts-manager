import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dialog-date',
  templateUrl: './dialog-date.component.html',
  styleUrls: ['./dialog-date.component.scss'],
})
export class DialogDateComponent implements OnInit {
  initialDate: Date;
  dateFormControl: FormControl<Date>;

  constructor(
    public dialogRef: MatDialogRef<DialogDateComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dateOnToolbar: Date
  ) {
    this.initialDate = dateOnToolbar ?? new Date(new Date().setDate(new Date().getDate() - 1));
  }

  @HostListener('window:keyup.Enter', ['$event'])

  ngOnInit(): void {
    this.dateFormControl = this.formBuilder.control(this.initialDate);
  }

  confirm() {
    this.dialogRef.close(this.dateFormControl.value);
  }
  clear(): void {
    this.dialogRef.close();
  }
}
