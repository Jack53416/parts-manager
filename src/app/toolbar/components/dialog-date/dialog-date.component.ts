import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dialog-date',
  templateUrl: './dialog-date.component.html',
  styleUrls: ['./dialog-date.component.scss'],
})
export class DialogDateComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  dateFormControl: FormControl<moment.Moment> = this.formBuilder.control(
    moment().subtract(1, 'days'),
    [Validators.required]
  );

  constructor(
    public dialogRef: MatDialogRef<DialogDateComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public initialDate: Date
  ) {
    this.dateFormControl.setValue(moment(initialDate));
  }

  ngOnInit(): void {
    this.dialogRef.keydownEvents().pipe(
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      if (event.key === 'Enter') {
        this.confirm();
      };
    });
  };
 ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete();
 }

  confirm(): void {
    this.dialogRef.close(this.dateFormControl.value.toDate());
  }
  close(): void {
    this.dialogRef.close(null);
  }
}
