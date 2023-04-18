import { Component } from '@angular/core';
import { PartsDataService } from '../../../parts-editor/services/parts-data.service';
import { DialogDateComponent } from '../dialog-date/dialog-date.component';
import { MatDialog } from '@angular/material/dialog';

export interface DialogData {
  date: string;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  date = '';

  constructor(private partsDataService: PartsDataService, public dialog: MatDialog) {}

  readTable() {
    const msg = 'msg from toolbar';
    this.partsDataService.eventGetDataFromTable(msg);
  }

  async readExcel() {
    await this.partsDataService.openEditor();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDateComponent, {data: {date: this.date}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.date = result;
      console.log(`data: ${this.date}`);
    });
  }


}
