import { CommaExpr } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-comment-dialog',
  templateUrl: './add-comment-dialog.component.html',
  styleUrls: ['./add-comment-dialog.component.scss'],
})
export class AddCommentDialogComponent implements OnInit {
  commentFormControl: FormControl<string>;

  readonly commentMaxLength = 500;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public initialComment?: string
  ) {}

  ngOnInit(): void {
    this.commentFormControl = this.formBuilder.control(
      this.initialComment ?? '',
      [Validators.maxLength(this.commentMaxLength)]
    );
  }

  dismiss() {
    this.dialogRef.close(null);
  }

  confirm() {
    this.dialogRef.close(this.commentFormControl.value);
  }
}
