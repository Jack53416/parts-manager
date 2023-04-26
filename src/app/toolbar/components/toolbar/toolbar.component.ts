import { Component } from '@angular/core';
import { PartsDataService } from '../../../parts-editor/services/parts-data.service';
import { DialogDateComponent } from '../dialog-date/dialog-date.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  dateOnToolbar: Date;

  constructor(
    private partsDataService: PartsDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async readExcel() {
    if (this.dateOnToolbar) {
      this.partsDataService.openEditor(this.dateOnToolbar);
    } else {
      this.showMessageAboutNoDate();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDateComponent, {
      data: this.dateOnToolbar
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dateOnToolbar = result.toDate();
    });
  }

  showMessageAboutNoDate() {
    this.snackBar.open($localize`Enter Date`, 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
