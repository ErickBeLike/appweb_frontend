import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../services/ventas/ventas.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';

@Component({
  selector: 'app-ventas-lista',
  templateUrl: './ventas-lista.component.html',
  styleUrls: ['./ventas-lista.component.css']
})
export class VentasListaComponent implements OnInit {

  ventas: any[] = [];
  ventasFiltradas: any[] = [];
  ventaAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  filtro: string = '';
  ordenActual: string = 'idVenta'; 
  orden: string = 'asc';

  constructor(
    private ventasService: VentasService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasVentas();
  }

  obtenerTodasLasVentas() {
    this.ventasService.obtenerTodasLasVentas().subscribe(response => {
      this.ventas = response;
      this.ventasFiltradas = [...this.ventas];
    }, error => {
      console.error(error);
    });
  }

  buscarVenta(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor); // Normaliza el texto de búsqueda

    if (valor === '') {
      this.ventasFiltradas = [...this.ventas];
    } else {
      this.ventasFiltradas = this.ventas.filter(venta =>
        this.contieneTextoNormalizado(venta.idVenta.toString(), valorNormalizado) ||
        this.contieneTextoNormalizado(venta.total.toString(), valorNormalizado) ||
        this.contieneTextoNormalizado(venta.fechaVenta.toLowerCase(), valorNormalizado) ||
        this.contieneTextoNormalizado(venta.idEmpleado.persona.nombre.toLowerCase(), valorNormalizado) ||
        this.contieneProducto(venta.detallesVenta, valorNormalizado)
      );
    }
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto); // Normaliza el texto de la tabla
    return textoNormalizado.includes(valorNormalizado);
  }

  contieneProducto(detallesVenta: any[], valorNormalizado: string): boolean {
    for (const detalleVenta of detallesVenta) {
      if (this.contieneTextoNormalizado(detalleVenta.producto.nombreProducto.toLowerCase(), valorNormalizado)) {
        return true;
      }
    }
    return false;
  }

  ordenarVentas(criterio: string, orden: string) {
    if (this.ordenActual === criterio) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = criterio;
      this.orden = 'asc';
    }

    const factor = this.orden === 'asc' ? 1 : -1;
    this.ventasFiltradas.sort((a, b) => {
      const aValue = this.obtenerValor(a, criterio);
      const bValue = this.obtenerValor(b, criterio);

      if (aValue < bValue) return -1 * factor;
      if (aValue > bValue) return 1 * factor;
      return 0;
    });
  }

  obtenerValor(venta: any, criterio: string): any {
    const keys = criterio.split('.');
    let value = venta;
    for (const key of keys) {
      value = value[key];
    }
    return value;
  }

  openDeleteModal(idVenta: number) {
    this.ventaAEliminar = idVenta;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.ventaAEliminar = null;
  }

  confirmarEliminarVenta() {
    if (this.ventaAEliminar !== null) {
      this.ventasService.eliminarVenta(this.ventaAEliminar).subscribe(response => {
        this.obtenerTodasLasVentas();
        this.toastr.success('Venta eliminada exitosamente', '', {
          enableHtml: true,
          toastClass: 'toast-eliminar' 
      });
      this.closeDeleteModal();
      }, error => {
        console.error(error);
        this.toastr.error('ERROR al querer eliminar la venta', '', {
          enableHtml: true,
          toastClass: 'toast-error' 
      });
      this.closeDeleteModal();
      });
    }
  }

  editarVenta(idVenta: number): void {
    this.router.navigate(['/app-web/ventas/ventas-registro', idVenta]);
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }
}
