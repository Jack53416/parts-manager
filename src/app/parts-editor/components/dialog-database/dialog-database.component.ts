import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
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
  missingPartsForm: FormArray<FormGroup>;

  constructor(
    public dialogRef: MatDialogRef<DialogDatabaseComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public missingParts: PartWorkbook
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    const partArray: FormGroup[] = [];

    this.missingParts.map(part => {
      partArray.push(this.createPartForm(part));
    });

    this.missingPartsForm = this.formBuilder.array(partArray);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createPartForm(part: {[key: string]: Cell}): FormGroup {
    return this.formBuilder.group({
      rowIndex: part.articleNo.row,
      nameReport: part.articleNo.value,
      nameSap: null,
      numberSap: [null, [Validators.required]],
      addToDatabase: false
    });
  }

  confirm() {
    this.dialogRef.close(this.missingPartsForm.value);
  }
}
