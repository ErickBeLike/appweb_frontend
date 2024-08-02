/**
 * Este SERVICE es para un login antiguo sin TOKEN
 */

/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/api/login';

  constructor(private http: HttpClient) {}

  login(credentials: {
    nombreUsuario: string;
    contrasena: string;
  }): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.apiUrl, credentials);
  }
}
*/
