import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

@Injectable({
  providedIn: 'root',
})
export class NotiServiceService {
  private notyf = new Notyf({
    duration: 3000,
    ripple: true,
    dismissible: true,
    position: {
      x: 'right',
      y: 'top',
    },
  });

  public showSuccess(message: string): void {
    this.notyf.success(message);
  }

  public showError(message: string): void {
    this.notyf.error(message);
  }
}
