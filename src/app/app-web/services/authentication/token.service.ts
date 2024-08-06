import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  public setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  public isLogged(): boolean {
    return !!this.getToken();
  }

  public getUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = token.split('.')[1];
      const payloadDecoded = atob(payload);
      const values = JSON.parse(payloadDecoded);
      const username = values.sub;
      return username;
    }
    return null;
  }

  public isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      const payload = token.split('.')[1];
      const payloadDecoded = atob(payload);
      const values = JSON.parse(payloadDecoded);
      const roles = values.roles;
      return roles.indexOf('ROLE_ADMIN') >= 0;
    }
    return false;
  }

  public logOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.clear();
    }
    this.router.navigate(['/app-web/login']);
  }
}
