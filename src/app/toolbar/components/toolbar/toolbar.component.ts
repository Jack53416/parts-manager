import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../core/services';
import { PartsDataService } from '../../../parts-editor/services/parts-data.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  //constructor(private electronService: ElectronService) { }
  constructor(private partsDataService: PartsDataService) { }

  ngOnInit(): void {
  }

  async readExcel() {
    const report = await this.partsDataService.getFailureReport();
    //const report = await this.electronService.readExcelFile();
    console.log(report);
    this.partsDataService.eventSendReportDataToTable(report);
  }

  testEvent() {
    this.partsDataService.eventOgarnianie('testtesttestdupa');
  };

}
