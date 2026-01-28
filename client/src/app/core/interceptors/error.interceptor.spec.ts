// import { TestBed } from '@angular/core/testing';
// import { HttpInterceptorFn } from '@angular/common/http';

// import { errorInterceptor } from './error.interceptor';

// describe('errorInterceptor', () => {
//   const interceptor: HttpInterceptorFn = (req, next) => 
//     TestBed.runInInjectionContext(() => errorInterceptor(req, next));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(interceptor).toBeTruthy();
//   });
// });

import { TestBed, inject } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';
import { HttpRequest, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { runInInjectionContext } from '@angular/core';

describe('errorInterceptor', () => {
  let notificationMock: NotificationService;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: { error: jest.fn() } }
      ]
    });

    injector = TestBed.inject(Injector);
    notificationMock = TestBed.inject(NotificationService);
  });

  it('should call notification.error on HTTP error', (done) => {
    const req = new HttpRequest('GET', '/test');
    const next = jest.fn().mockReturnValue(throwError(() => ({ error: { message: 'Fail' } })));

    runInInjectionContext(injector, () => {
      errorInterceptor(req, next).subscribe({
        error: () => {
          expect(notificationMock.error).toHaveBeenCalledWith('Fail');
          done();
        }
      });
    });
  });

  it('should call default message if error.error.message is missing', (done) => {
    const req = new HttpRequest('GET', '/test');
    const next = jest.fn().mockReturnValue(throwError(() => ({})));

    runInInjectionContext(injector, () => {
      errorInterceptor(req, next).subscribe({
        error: () => {
          expect(notificationMock.error).toHaveBeenCalledWith('Error inesperado en el servidor');
          done();
        }
      });
    });
  });

  it('should skip error if X-Skip-Error header is present', (done) => {
    const req = new HttpRequest('GET', '/test', {
      headers: new HttpHeaders({ 'X-Skip-Error': 'true' })
    });
    const next = jest.fn().mockReturnValue(throwError(() => ({ error: { message: 'Fail' } })));

    runInInjectionContext(injector, () => {
      errorInterceptor(req, next).subscribe({
        error: (err) => {
          expect(notificationMock.error).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });
});
