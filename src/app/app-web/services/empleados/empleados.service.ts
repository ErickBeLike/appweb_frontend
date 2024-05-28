import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private apiUrl = 'http://localhost:8080/api/empleados';

  constructor(private http: HttpClient) { }

  obtenerTodosLosEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarEmpleadoId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  agregarEmpleado(empleado: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, empleado);
  }

  agregarVariosEmpleados(empleados: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/batch`, empleados);
  }

  actualizarEmpleado(id: number, empleado: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, empleado);
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
