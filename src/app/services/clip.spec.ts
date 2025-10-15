import { TestBed } from '@angular/core/testing';

import { Clip } from './clip';

describe('Clip', () => {
  let service: Clip;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Clip);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
