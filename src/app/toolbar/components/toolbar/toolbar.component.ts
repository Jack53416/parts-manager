import { Component } from '@angular/core';
import { PartsDataService } from '../../../parts-editor/services/parts-data.service';
import { DialogDateComponent } from '../dialog-date/dialog-date.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

export interface DialogData {
  date: Date;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  date: Date;

  constructor(
    private partsDataService: PartsDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async readExcel() {
    if (this.date) {
      await this.partsDataService.openEditor(formatDate(this.date, 'dd.MM.YYYY', 'en-US'));
    } else {
      this.showMessageAboutNoDate();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDateComponent, {
      data: this.date
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.date = result;
    });
  }

  showMessageAboutNoDate() {
    this.snackBar.open('Enter Date', 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
