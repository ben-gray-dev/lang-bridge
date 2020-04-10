import { TestBed } from '@angular/core/testing';

import { LangStatsService } from './lang-stats.service';

describe('LangStatsService', () => {
  let service: LangStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LangStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
