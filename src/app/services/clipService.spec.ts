import { TestBed } from '@angular/core/testing';

import { ClipService } from './clipService';

describe('Clip', () => {
  let service: ClipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
