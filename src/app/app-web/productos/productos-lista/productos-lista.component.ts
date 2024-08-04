import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos/productos.service'; // Asegúrate de tener el servicio correcto
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';
import { TokenService } from '../../services/authentication/token.service';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';

@Component({
  selector: 'app-productos-lista',
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css'],
})
export class ProductosListaComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  productoAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idProducto'; // Columna de orden predeterminada
  orden: string = 'asc'; // Dirección de orden predeterminada

  isLogged = false;
  isAdmin = false;

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private notificationService: NotificationService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosProductos();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodosLosProductos() {
    this.productosService.obtenerTodosLosProductos().subscribe(
      (response: any[]) => {
        this.productos = response;
        this.productosFiltrados = [...this.productos];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  buscarProducto(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor);

    if (valor === '') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter(
        (producto) =>
          this.contieneTextoNormalizado(
            producto.nombreProducto.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            producto.precioProducto.toString(),
            valorNormalizado
          )
      );
    }
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto);
    return textoNormalizado.includes(valorNormalizado);
  }

  ordenarProductos(campo: string) {
    if (this.ordenActual === campo) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = campo;
      this.orden = 'asc';
    }

    const factor = this.orden === 'asc' ? 1 : -1;
    this.productosFiltrados.sort((a, b) => {
      const aValue = this.obtenerValor(a, campo);
      const bValue = this.obtenerValor(b, campo);

      if (aValue < bValue) return -1 * factor;
      if (aValue > bValue) return 1 * factor;
      return 0;
    });
  }

  obtenerValor(obj: any, campo: string) {
    return campo.split('.').reduce((o, i) => o[i], obj);
  }

  notification(idProducto: number) {
    this.notificationService.showConfirmation('Confirmar Eliminación', '¿Estás seguro de que deseas eliminar este producto?')
      .then(confirmed => {
        if (confirmed) {
          this.eliminarProducto(idProducto);
        }
      });
  }

  eliminarProducto(idProducto: number) {
    this.productosService.eliminarProducto(idProducto).subscribe(
      () => {
        this.obtenerTodosLosProductos();
        this.notificationService.showSuccess('Producto eliminado exitosamente', '');
      },
      (error) => {
        console.error(error);
        this.notificationService.showError('ERROR al querer eliminar el producto', '');
      }
    );
  }

  editarProducto(idProducto: number) {
    this.router.navigate(['/app-web/productos/productos-registro', idProducto]);
  }

  generarReporte() {
    // Lógica para generar reporte PDF (puedes utilizar la implementación que ya tienes) o una acción distinta
  }
}
