import { TestBed } from '@angular/core/testing';

import { AllyService } from './ally.service';

describe('AllyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllyService = TestBed.get(AllyService);
    expect(service).toBeTruthy();
  });
});
