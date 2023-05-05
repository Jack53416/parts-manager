import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { PartWorkbook } from '../../models/editor';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-database',
  templateUrl: './dialog-database.component.html',
  styleUrls: ['./dialog-database.component.scss'],
})
export class DialogDatabaseComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  missingPartsForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogDatabaseComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public missingParts: PartWorkbook
  ) {}

  ngOnInit() {
    this.missingPartsForm = this.formBuilder.group({
      parts: this.formBuilder.array([]),
    });

    for (const part of this.missingParts) {
      this.addPart(part.articleNo.value);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  parts(): FormArray {
    return this.missingPartsForm.get('parts') as FormArray;
  }

  addPart(partNumber: string) {
    this.parts().push(this.newPart(partNumber));
  }

  newPart(partNumber: string): FormGroup {
    return this.formBuilder.group({
      nameReport: partNumber,
      nameSap: '',
      numberSap:'',
      addToDatabase: false
    });
  }

  onSubmit() {
    console.log('dialog: ', this.missingPartsForm.value);
    this.dialogRef.close(this.missingPartsForm.value);
  }
}
