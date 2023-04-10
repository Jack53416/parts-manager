import { EventEmitter, Injectable, Output } from '@angular/core';
import { MOCK_PRODUCTION_REPORT, Part } from '../models/part';
import { PartFailure } from '../models/part-failure';
import { ElectronService } from '../../core/services/electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class PartsDataService {

  @Output() getDataFromTable = new EventEmitter<string>();
  @Output() sendReporttoTable = new EventEmitter<{[key: string]: Part}>();

  constructor(private electronService: ElectronService) {}

  //getFailureReport(): Partial<PartFailure>[] {
  //  return Array(50).fill(0).map((_, index) => ({
  //    ...MOCK_PRODUCTION_REPORT[index % MOCK_PRODUCTION_REPORT.length],
  //  }));
  //}

  getFailureReport(): Promise<{[key: string]: Part}> {
    const report = this.electronService.readExcelFile();
    //console.log('getFailiureReport - part service');
    //console.log(report);
    return report;
  };

  eventSendReportDataToTable(report: {[key: string]: Part}) {
    this.sendReporttoTable.emit(report);
  }

  eventGetDataFromTable(msg: string){
    this.getDataFromTable.emit(msg);
  }

}
