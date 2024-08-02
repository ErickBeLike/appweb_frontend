import { TestBed } from '@angular/core/testing';

import { ProdInterceptorServiceService } from './prod-interceptor-service.service';

describe('ProdInterceptorServiceService', () => {
  let service: ProdInterceptorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdInterceptorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
