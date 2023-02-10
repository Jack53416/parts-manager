import { Injectable } from '@angular/core';
import { MOCK_PRODUCTION_REPORT } from '../models/part';
import { PartFailure } from '../models/part-failure';


@Injectable({
  providedIn: 'root'
})
export class PartsDataService {

  constructor() { }

  getFailureReport(): Partial<PartFailure>[] {
    return [...MOCK_PRODUCTION_REPORT];
  }
}
