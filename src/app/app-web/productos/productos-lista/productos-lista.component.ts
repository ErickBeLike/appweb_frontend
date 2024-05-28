import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos/productos.service';

@Component({
  selector: 'app-productos-lista',
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css']
})
export class ProductosListaComponent implements OnInit {

  productos: any[] = [];

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.obtenerTodosLosProductos();
  }

  obtenerTodosLosProductos() {
    this.productosService.obtenerTodosLosProductos().subscribe(response => {
      this.productos = response;
    }, error => {
      console.error(error);
    });
  }

  eliminar(idProducto: number) {
    const confirmar = confirm(`¿Estás seguro de eliminar el producto con ID ${idProducto}?`);
    if (confirmar) {
      this.productosService.eliminarProducto(idProducto).subscribe(response => {
        this.obtenerTodosLosProductos();
      }, error => {
        console.error(error);
      });
    }
  }

  editarProducto(id: number): void {
    // Implementa la lógica para editar un producto
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }
}
