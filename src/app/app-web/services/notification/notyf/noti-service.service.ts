import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Notyf } from 'notyf';
import { isPlatformBrowser } from '@angular/common';
import 'notyf/notyf.min.css';

@Injectable({
  providedIn: 'root',
})
export class NotiServiceService {
  private notyf: Notyf | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.notyf = new Notyf({
        duration: 3000,
        ripple: true,
        dismissible: true,
        position: {
          x: 'right',
          y: 'top',
        },
      });
    }
  }

  public showSuccess(message: string): void {
    if (this.notyf) {
      this.notyf.success(message);
    }
  }

  public showError(message: string): void {
    if (this.notyf) {
      this.notyf.error(message);
    }
  }
}
