import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CargosService {
  private apiUrl = 'http://localhost:8080/api/cargos';

  constructor(private http: HttpClient) {}

  obtenerTodosLosCargos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarCargoId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  agregarCargo(cargo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cargo);
  }

  agregarVariosCargos(cargos: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/batch`, cargos);
  }

  actualizarCargo(id: number, cargo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cargo);
  }

  eliminarCargo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
