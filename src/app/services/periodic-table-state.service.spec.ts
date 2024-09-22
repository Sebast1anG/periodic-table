import { TestBed } from '@angular/core/testing';

import { PeriodicTableStateService } from './periodic-table-state.service';

describe('PeriodicTableStateService', () => {
  let service: PeriodicTableStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodicTableStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
