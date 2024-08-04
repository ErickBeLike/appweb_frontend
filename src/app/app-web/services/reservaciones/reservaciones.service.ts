import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservacionesService {
  private apiUrl = 'http://localhost:8080/api/reservaciones';

  constructor(private http: HttpClient) {}

  obtenerTodasLasReservaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarReservacionPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  agregarReservacion(reservacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reservacion);
  }

  actualizarReservacion(id: number, reservacion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, reservacion);
  }

  eliminarReservacion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  actualizarEstadoPago(idPago: number, pago: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pagos/${idPago}`, pago);
  }
}
