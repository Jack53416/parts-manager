import { TestBed } from '@angular/core/testing';

import { PartsDataService } from './parts-data.service';

describe('PartsDataService', () => {
  let service: PartsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
