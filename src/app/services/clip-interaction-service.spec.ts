import { TestBed } from '@angular/core/testing';

import { ClipInteractionService } from './clip-interaction-service';

describe('ClipInteractionService', () => {
  let service: ClipInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
