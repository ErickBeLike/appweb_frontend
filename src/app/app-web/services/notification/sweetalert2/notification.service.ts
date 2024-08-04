import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  // Método para mostrar una alerta de confirmación
  public showConfirmation(title: string, text: string): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#40c464',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  // Método para mostrar una notificación de éxito
  public showSuccess(title: string, text: string): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonColor: '#40c464',
      confirmButtonText: 'Aceptar',
    });
  }

  // Método para mostrar una notificación de error
  public showError(title: string, text: string): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#40c464',
    });
  }
}
