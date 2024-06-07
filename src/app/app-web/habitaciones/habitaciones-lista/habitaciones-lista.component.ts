import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ToastrService } from 'ngx-toastr';

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

  buscarHabitacion(event: any): void {
    const valorBusqueda = event.target.value.toLowerCase();
    this.habitacionesFiltradas = this.habitaciones.filter(habitacion =>
      habitacion.habitacion.toLowerCase().includes(valorBusqueda)
    );
  }

  ordenarHabitaciones(campo: string, orden: string): void {
    this.habitacionesFiltradas.sort((a, b) => {
      if (orden === 'asc') {
        return a[campo] > b[campo] ? 1 : -1;
      } else {
        return a[campo] < b[campo] ? 1 : -1;
      }
    });
  }

  ordenarDisponibilidad(tipo: string): void {
    if (tipo === 'DISPONIBLE') {
      this.habitacionesFiltradas.sort((a, b) => {
        if (a.disponibilidad === 'DISPONIBLE' && b.disponibilidad !== 'DISPONIBLE') {
          return -1;
        } else if (a.disponibilidad !== 'DISPONIBLE' && b.disponibilidad === 'DISPONIBLE') {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (tipo === 'RESERVADA') {
      this.habitacionesFiltradas.sort((a, b) => {
        if (a.disponibilidad === 'RESERVADA' && b.disponibilidad !== 'RESERVADA') {
          return -1;
        } else if (a.disponibilidad !== 'RESERVADA' && b.disponibilidad === 'RESERVADA') {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (tipo === 'OCUPADA') {
      this.habitacionesFiltradas.sort((a, b) => {
        if (a.disponibilidad === 'OCUPADA' && b.disponibilidad !== 'OCUPADA') {
          return -1;
        } else if (a.disponibilidad !== 'OCUPADA' && b.disponibilidad === 'OCUPADA') {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }
}
