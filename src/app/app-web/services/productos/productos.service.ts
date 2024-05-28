import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) { }

  obtenerTodosLosProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarProductoId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  agregarProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  agregarVariosProductos(productos: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/batch`, productos);
  }

  actualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
