import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NuevoUsuario } from '../../models/nuevo-usuario';
import { LoginUsuario } from '../../models/login-usuario';
import { JwtDto } from '../../models/jwt-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = 'http://localhost:8080/auth/';

  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
    return this.httpClient.post<JwtDto>(this.authURL + 'login', loginUsuario);
  }

  public obtenerTodosLosUsuarios(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.authURL + 'get');
  }

  public obtenerUsuarioPorId(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.authURL}get/${id}`);
  }

  public actualizarUsuario(id: number, nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.put<any>(`${this.authURL}update/${id}`, nuevoUsuario);
  }

  public eliminarUsuario(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.authURL}delete/${id}`);
  }
}
