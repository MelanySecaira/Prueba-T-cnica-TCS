 import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
 import { inject } from '@angular/core';
 import { NotificationService } from '../services/notification.service';
import { catchError, throwError } from 'rxjs';
 

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (req.headers.has('X-Skip-Error')) {
        return throwError(() => error);
      }
      
      const message =
        error.error?.message || 'Error inesperado en el servidor';
      notification.error(message);    //centralización de errores
      return throwError(() => error);
    })
  );
};
