import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../core/services';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(private electronService: ElectronService) { }

  ngOnInit(): void {
  }

  async readExcel() {
    await this.electronService.readExcelFile();
  }

}
