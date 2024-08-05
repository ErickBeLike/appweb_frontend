import { Router } from '@angular/router';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  roles: Array<string> = [];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  private get localStorage() {
    return isPlatformBrowser(this.platformId) ? window.localStorage : null;
  }

  public setToken(token: string): void {
    const storage = this.localStorage;
    if (storage) {
      storage.removeItem(TOKEN_KEY);
      storage.setItem(TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    const storage = this.localStorage;
    return storage ? storage.getItem(TOKEN_KEY) : null;
  }

  public isLogged(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  public getUserName(): string | null {
    if (!this.isLogged()) {
      return null;
    }
    const token = this.getToken();
    if (token === null) {
      return null;
    }
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    return values.sub || null;
  }

  public isAdmin(): boolean {
    if (!this.isLogged()) {
      return false;
    }
    const token = this.getToken();
    if (token === null) {
      return false;
    }
    const payload = token.split('.')[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    const roles = values.roles || [];
    return roles.indexOf('ROLE_ADMIN') >= 0;
  }

  public logOut(): void {
    const storage = this.localStorage;
    if (storage) {
      storage.clear();
    }
    this.router.navigate(['/app-web/login']);
  }
}
