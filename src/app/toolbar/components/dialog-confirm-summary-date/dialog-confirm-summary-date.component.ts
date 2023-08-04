import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogDateComponent } from '../dialog-date/dialog-date.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-confirm-summary-date',
  templateUrl: './dialog-confirm-summary-date.component.html',
  styleUrls: ['./dialog-confirm-summary-date.component.scss']
})
export class DialogConfirmSummaryDateComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  warningMessage = false;

  constructor(
    public dialogRef: MatDialogRef<DialogDateComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public summaryDate: Date
    ) {
      const today = new Date();

      if (summaryDate.getMonth() === today.getMonth() && summaryDate.getFullYear() === today.getFullYear()) {
        this.warningMessage = true;
      }
    }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dateConfirmed() {
    this.dialogRef.close(true);
  }

  dateRejected() {
    this.dialogRef.close(false);
  }
}
