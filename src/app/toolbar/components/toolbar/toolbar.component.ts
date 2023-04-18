import { Component } from '@angular/core';
import { PartsDataService } from '../../../parts-editor/services/parts-data.service';
import { DialogDateComponent } from '../dialog-date/dialog-date.component';
import { MatDialog } from '@angular/material/dialog';

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
    public dialog: MatDialog
  ) {}

  readTable() {
    const msg = 'msg from toolbar';
    this.partsDataService.eventGetDataFromTable(msg);
  }

  async readExcel() {
    //const dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };
    if (this.date) {
      await this.partsDataService.openEditor(
        this.date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      );
    } else {
      // ToDo: show message on screen
      console.log('enter date');
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDateComponent, {
      data: { date: this.date },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.date = result;
    });
  }
}
