import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../services/ventas/ventas.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ventas-lista',
  templateUrl: './ventas-lista.component.html',
  styleUrls: ['./ventas-lista.component.css']
})
export class VentasListaComponent implements OnInit {

  ventas: any[] = [];
  ventaAEliminar: number | null = null;
  showDeleteModal: boolean = false;

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
    }, error => {
      console.error(error);
    });
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
        this.toastr.success('ERROR al querer eliminar la venta', '', {
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
