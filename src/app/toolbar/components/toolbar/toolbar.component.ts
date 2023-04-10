import { Component } from '@angular/core';
import { PartsDataService } from '../../../parts-editor/services/parts-data.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(private partsDataService: PartsDataService) {}

  readTable() {
    const msg = 'msg from toolbar';
    this.partsDataService.eventGetDataFromTable(msg);
  }

  async readExcel() {
    await this.partsDataService.openEditor();
  }

}
