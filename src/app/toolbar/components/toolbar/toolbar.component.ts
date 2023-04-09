import { Component, OnInit } from '@angular/core';
import { PartsDataService } from '../../../parts-editor/services/parts-data.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(private partsDataService: PartsDataService) {}

  ngOnInit(): void {}

  async readExcel() {
    await this.partsDataService.openEditor();
  }
}
