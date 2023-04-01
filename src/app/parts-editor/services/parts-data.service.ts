import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { ElectronService } from '../../core/services';
import { MOCK_PRODUCTION_REPORT } from '../models/part';
import { PartFailure } from '../models/part-failure';

@Injectable({
  providedIn: 'root',
})
export class PartsDataService {
  private activeReportSubject$ = new Subject<Partial<PartFailure>[]>();

  constructor(private electronService: ElectronService) {}

  get currentReport$(): Observable<Partial<PartFailure>[]> {
    return this.activeReportSubject$.asObservable();
  }

  async getFailureReport(): Promise<void> {
    if (this.electronService.isElectron) {
      const result = await this.electronService.ipcRenderer?.invoke('openExcel');
      return this.activeReportSubject$.next(result);
    }

    this.activeReportSubject$.next(this.getMockedData());
  }

  private getMockedData(): Partial<PartFailure>[] {
    return Array(100)
      .fill(0)
      .map((_, index) => ({
        ...MOCK_PRODUCTION_REPORT[index % MOCK_PRODUCTION_REPORT.length],
      }));
  }
}
