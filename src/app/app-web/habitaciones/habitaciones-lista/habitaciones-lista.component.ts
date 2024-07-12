import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';

@Component({
  selector: 'app-habitaciones-lista',
  templateUrl: './habitaciones-lista.component.html',
  styleUrls: ['./habitaciones-lista.component.css']
})
export class HabitacionesListaComponent implements OnInit {
  habitaciones: any[] = [];
  habitacionesFiltradas: any[] = [];
  habitacionAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idHabitacion';
  orden: string = 'asc';

  constructor(
    private habitacionesService: HabitacionesService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasHabitaciones();
  }

  obtenerTodasLasHabitaciones() {
    this.habitacionesService.obtenerTodasLasHabitaciones().subscribe(
      (response: any[]) => {
        this.habitaciones = response;
        // Al inicio, mostramos todas las habitaciones
        this.habitacionesFiltradas = [...this.habitaciones];
      },
      error => {
        console.error(error);
      }
    );
  }

  buscarHabitacion(event: any) {
    const searchTerm = unidecode(event.target.value).toLowerCase();
    this.habitacionesFiltradas = this.habitaciones.filter(habitacion =>
      unidecode(habitacion.habitacion.toLowerCase()).includes(searchTerm) ||
      unidecode(habitacion.cupo.toString().toLowerCase()).includes(searchTerm) ||
      unidecode(habitacion.precioPorNoche.toString().toLowerCase()).includes(searchTerm) ||
      unidecode(habitacion.depositoInicialNoche.toString().toLowerCase()).includes(searchTerm) ||
      unidecode(habitacion.disponibilidad.toLowerCase()).includes(searchTerm)
    );
  }

  ordenarHabitaciones(campo: string) {
    if (this.ordenActual === campo) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.orden = 'asc';
    }
    this.ordenActual = campo;
    this.habitacionesFiltradas.sort((a, b) => {
      let campoA = a[campo];
      let campoB = b[campo];
      if (typeof campoA === 'string') {
        campoA = campoA.toLowerCase();
        campoB = campoB.toLowerCase();
      }
      if (campoA < campoB) return this.orden === 'asc' ? -1 : 1;
      if (campoA > campoB) return this.orden === 'asc' ? 1 : -1;
      return 0;
    });
  }

  openDeleteModal(idHabitacion: number) {
    this.habitacionAEliminar = idHabitacion;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.habitacionAEliminar = null;
  }

  confirmarEliminarHabitacion() {
    if (this.habitacionAEliminar !== null) {
      this.habitacionesService.eliminarHabitacion(this.habitacionAEliminar).subscribe(
        () => {
          this.obtenerTodasLasHabitaciones();
          this.toastr.success('Habitación eliminada exitosamente', '', {
            enableHtml: true,
            toastClass: 'toast-eliminar'
          });
          this.closeDeleteModal();
        },
        error => {
          console.error(error);
          this.toastr.error('ERROR al eliminar la habitación', '', {
            enableHtml: true,
            toastClass: 'toast-error'
          });
          this.closeDeleteModal();
        }
      );
    }
  }

  editarHabitacion(idHabitacion: number): void {
    this.router.navigate(['/app-web/habitaciones/habitaciones-registro', idHabitacion]);
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }

  actualizarDisponibilidad(habitacion: any): void {
    this.habitacionesService.actualizarHabitacion(habitacion.idHabitacion, habitacion).subscribe(
      () => {
        console.log('Disponibilidad actualizada');
        this.toastr.success('Disponibilidad actualizada exitosamente', '', {
          enableHtml: true,
          toastClass: 'toast-editar'
        });
      },
      error => {
        console.error(error);
        this.toastr.error('ERROR al actualizar la disponibilidad', '', {
          enableHtml: true,
          toastClass: 'toast-error'
        });
      }
    );
  }
}
