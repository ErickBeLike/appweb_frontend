import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos/productos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-productos-lista',
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css']
})
export class ProductosListaComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  productoAEliminar: number | null = null;
  showDeleteModal: boolean = false;

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosProductos();
  }

  obtenerTodosLosProductos() {
    this.productosService.obtenerTodosLosProductos().subscribe(response => {
      this.productos = response;
      this.productosFiltrados = [...this.productos];
    }, error => {
      console.error(error);
    });
  }

  openDeleteModal(idProducto: number) {
    this.productoAEliminar = idProducto;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productoAEliminar = null;
  }

  confirmarEliminarProducto() {
    if (this.productoAEliminar !== null) {
      this.productosService.eliminarProducto(this.productoAEliminar).subscribe(response => {
        this.obtenerTodosLosProductos();
        this.toastr.success('Producto eliminado exitosamente', '', {
          enableHtml: true,
          toastClass: 'toast-eliminar'
        });
        this.closeDeleteModal();
      }, error => {
        console.error(error);
        this.toastr.error('ERROR al querer eliminar el producto', '', {
          enableHtml: true,
          toastClass: 'toast-error'
        });
        this.closeDeleteModal();
      });
    }
  }

  editarProducto(idProducto: number): void {
    this.router.navigate(['/app-web/productos/productos-registro', idProducto]);
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }

  buscarProducto(event: any): void {
    const valorBusqueda = event.target.value.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto => {
      return (
        producto.idProducto.toString().toLowerCase().includes(valorBusqueda) ||
        producto.nombreProducto.toLowerCase().includes(valorBusqueda) ||
        producto.precioProducto.toString().toLowerCase().includes(valorBusqueda)
      );
    });
  }

  ordenarProductos(campo: string, orden: 'asc' | 'desc'): void {
    this.productosFiltrados.sort((a, b) => {
      if (a[campo] < b[campo]) {
        return orden === 'asc' ? -1 : 1;
      }
      if (a[campo] > b[campo]) {
        return orden === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
