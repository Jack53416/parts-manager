import { Component } from '@angular/core';
import { PartsDataService } from '../../../parts-editor/services/parts-data.service';
import { DialogDateComponent } from '../dialog-date/dialog-date.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  reportDate: Date = moment().subtract(1, 'days').toDate();
  progressBarVisible = false;

  constructor(
    private partsDataService: PartsDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async readExcel() {
    if (this.reportDate) {
      this.partsDataService.openEditor(this.reportDate);
    } else {
      this.showMessageAboutNoDate();
    }
  }

  async saveParts() {
    this.progressBarVisible = true;
    await this.partsDataService.saveEditor(
      this.partsDataService.activeEditor.workbook,
      this.reportDate
    );
    this.progressBarVisible = false;
    this.showMessageSavingDone();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDateComponent, {
      data: this.reportDate,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reportDate = result;
      }
    });
  }

  showMessageAboutNoDate() {
    this.snackBar.open($localize`Enter Date`, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  showMessageSavingDone() {
    this.snackBar.open($localize`Done`, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  updateComment() {
    // ToDo(Jacek): Add custom overlay for entering dialog data
    this.partsDataService.activeEditor?.updateComment('Test Comment');
  }
}
