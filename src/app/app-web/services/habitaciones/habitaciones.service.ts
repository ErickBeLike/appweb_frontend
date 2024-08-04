import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HabitacionesService {
  private apiUrl = 'http://localhost:8080/api/habitaciones';

  constructor(private http: HttpClient) {}

  obtenerTodasLasHabitaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarHabitacionId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  agregarHabitacion(habitacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, habitacion);
  }

  agregarVariasHabitaciones(habitaciones: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/batch`, habitaciones);
  }

  actualizarHabitacion(id: number, habitacion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, habitacion);
  }

  eliminarHabitacion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
