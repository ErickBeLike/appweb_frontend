import { Component, OnInit } from '@angular/core';
import { ReservacionesService } from '../../services/reservaciones/reservaciones.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';

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
  ordenActual: string = 'idReservacion'; 
  orden: string = 'asc'; 

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

  buscarReservacion(event: any): void {
    const valor = event.target.value.toLowerCase().trim();
    if (valor === '') {
      this.reservacionesFiltradas = [...this.reservaciones];
    } else {
      this.reservacionesFiltradas = this.reservaciones.filter(
        (reservacion) =>
          unidecode(reservacion.idCliente.persona.nombre.toLowerCase()).includes(valor) ||
          unidecode(reservacion.idCliente.persona.apellidoPaterno.toLowerCase()).includes(valor) ||
          unidecode(reservacion.idCliente.persona.apellidoMaterno.toLowerCase()).includes(valor) ||
          unidecode(reservacion.idHabitacion.habitacion.toLowerCase()).includes(valor)
      );
    }
  }

  ordenarReservaciones(columna: string): void {
    if (columna === this.ordenActual) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = columna;
      this.orden = 'asc';
    }

    this.reservacionesFiltradas.sort((a, b) => {
      const aValue = this.extraerValor(a, columna);
      const bValue = this.extraerValor(b, columna);

      if (this.orden === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  extraerValor(obj: any, path: string): any {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value[key] === undefined) {
        return '';
      }
      value = value[key];
    }
    return value;
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
}
