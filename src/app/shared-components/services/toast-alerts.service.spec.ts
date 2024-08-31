import { TestBed } from '@angular/core/testing';

import { ToastAlertsService } from './toast-alerts.service';

describe('ToastAlertsService', () => {
  let service: ToastAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
