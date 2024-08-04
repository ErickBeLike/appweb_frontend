import { TestBed } from '@angular/core/testing';

import { NotiServiceService } from './noti-service.service';

describe('NotiServiceService', () => {
  let service: NotiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
