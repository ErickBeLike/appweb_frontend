import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../services/ventas/ventas.service';

@Component({
  selector: 'app-ventas-lista',
  templateUrl: './ventas-lista.component.html',
  styleUrls: ['./ventas-lista.component.css']
})
export class VentasListaComponent implements OnInit {

  ventas: any[] = [];

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.obtenerTodasLasVentas();
  }

  obtenerTodasLasVentas() {
    this.ventasService.obtenerTodasLasVentas().subscribe(response => {
      this.ventas = response;
    }, error => {
      console.error(error);
    });
  }

  getProductos(venta: any) {
    const productos = [];
    for (let idProducto in venta.cantidadesProducto) {
      if (venta.cantidadesProducto.hasOwnProperty(idProducto)) {
        const cantidad = venta.cantidadesProducto[idProducto];
        const nombre = venta.nombresProductos[idProducto];
        const precioUnitario = venta.preciosUnitarios[idProducto];
        const subtotal = cantidad * precioUnitario;
        productos.push({
          nombre: nombre,
          cantidad: cantidad,
          precioUnitario: precioUnitario,
          subtotal: subtotal
        });
      }
    }
    return productos;
  }

  eliminarVenta(idVenta: number) {
    const confirmar = confirm(`¿Estás seguro de eliminar la venta con ID ${idVenta}?`);
    if (confirmar) {
      this.ventasService.eliminarVenta(idVenta).subscribe(response => {
        this.obtenerTodasLasVentas();
      }, error => {
        console.error(error);
      });
    }
  }

  editarVenta(id: number): void {
    // Implementa la lógica para editar una venta
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }
}
