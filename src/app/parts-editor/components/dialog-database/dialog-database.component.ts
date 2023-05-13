import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { PartWorkbook } from '../../models/editor';
import { Subject } from 'rxjs';
import { Cell } from '../../models/cell';

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
      updatedParts: this.formBuilder.array([]),
    });

    this.missingParts.map(part => {
      this.addPart(part);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updatedParts(): FormArray {
    return this.missingPartsForm.get('updatedParts') as FormArray;
  }

  addPart(part: {[key: string]: Cell}) {
    const newPart = this.formBuilder.group({
      rowIndex: part.articleNo.row,
      nameReport: part.articleNo.value,
      nameSap: '',
      numberSap:'',
      addToDatabase: false
    });

    this.updatedParts().push(newPart);
  }

  onSubmit() {
    this.dialogRef.close(this.missingPartsForm.value);
  }
}
