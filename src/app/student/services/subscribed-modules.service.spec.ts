import { TestBed } from '@angular/core/testing';

import { SubscribedModulesService } from './subscribed-modules.service';

describe('SubscribedModulesService', () => {
  let service: SubscribedModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscribedModulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
