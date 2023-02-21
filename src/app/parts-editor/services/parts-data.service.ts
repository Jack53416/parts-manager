import { Injectable } from '@angular/core';
//import { MOCK_PRODUCTION_REPORT } from '../models/part';
import { PartFailure } from '../models/part-failure';

@Injectable({
  providedIn: 'root',
})
export class PartsDataService {
  constructor() {}

  getFailureReport(): Partial<PartFailure>[] {
    //return Array(50).fill(0).map((_, index) => ({
    //  ...MOCK_PRODUCTION_REPORT[index % MOCK_PRODUCTION_REPORT.length],
    //}));


  }
}
