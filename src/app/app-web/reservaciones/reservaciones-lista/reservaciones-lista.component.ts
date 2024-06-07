import { Component, OnInit } from '@angular/core';
import { ReservacionesService } from '../../services/reservaciones/reservaciones.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservaciones-lista',
  templateUrl: './reservaciones-lista.component.html',
  styleUrls: ['./reservaciones-lista.component.css']
})
export class ReservacionesListaComponent implements OnInit {
  reservaciones: any[] = [];
  reservacionesFiltradas: any[] = [];
  reservacionAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  filtro: string = '';

  constructor(
    private reservacionesService: ReservacionesService, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasReservaciones();
  }

  obtenerTodasLasReservaciones() {
    this.reservacionesService.obtenerTodasLasReservaciones().subscribe(response => {
      this.reservaciones = response;
      this.reservacionesFiltradas = [...this.reservaciones];
    }, error => {
      console.error(error);
    });
  }

  openDeleteModal(idReservacion: number) {
    this.reservacionAEliminar = idReservacion;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.reservacionAEliminar = null;
  }

  confirmarEliminarReservacion() {
    if (this.reservacionAEliminar !== null) {
      this.reservacionesService.eliminarReservacion(this.reservacionAEliminar).subscribe(response => {
        this.obtenerTodasLasReservaciones();
        this.toastr.success('Reservación eliminada exitosamente', '', {
          enableHtml: true,
          toastClass: 'toast-eliminar' 
      });
      this.closeDeleteModal();
      }, error => {
        console.error(error);
        this.toastr.error('ERROR al querer eliminar la reservación', '', {
          enableHtml: true,
          toastClass: 'toast-error' 
      });
      this.closeDeleteModal();
      });
    }
  }

  editarReservacion(idReservacion: number) {
    this.router.navigate(['/app-web/reservaciones/reservaciones-registro', idReservacion]);
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }

  buscarReservacion(event: any) {
    const valor = event.target.value.toLowerCase();
    this.reservacionesFiltradas = this.reservaciones.filter((reservacion: any) => {
      return (
        reservacion.idReservacion.toString().includes(valor) ||
        reservacion.fechaInicio.includes(valor) ||
        reservacion.total.toString().includes(valor)
      );
    });
  }

  ordenarReservaciones(criterio: string, orden: string) {
    this.reservacionesFiltradas.sort((a: any, b: any) => {
      const primerValor = a[criterio];
      const segundoValor = b[criterio];
      if (primerValor < segundoValor) {
        return orden === 'asc' ? -1 : 1;
      } else if (primerValor > segundoValor) {
        return orden === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
