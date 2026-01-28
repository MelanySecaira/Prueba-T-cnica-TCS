import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  success(message: string, title = 'Éxito'): void {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'Aceptar'
    });
  }

  error(message: string, title = 'Error'): void {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'Aceptar'
    });
  }

  warning(message: string, title = 'Atención'): void {
    Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonText: 'Aceptar'
    });
  }
}
