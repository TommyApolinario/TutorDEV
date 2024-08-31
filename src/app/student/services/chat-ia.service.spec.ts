import { TestBed } from '@angular/core/testing';

import { ChatIaService } from './chat-ia.service';

describe('ChatIaService', () => {
  let service: ChatIaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatIaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
