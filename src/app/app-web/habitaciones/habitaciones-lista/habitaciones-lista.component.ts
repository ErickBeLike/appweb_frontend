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
    this.habitacionesService.obtenerTodasLasHabitaciones().subscribe(response => {
      this.habitaciones = response;
    }, error => {
      console.error(error);
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
      this.habitacionesService.eliminarHabitacion(this.habitacionAEliminar).subscribe(response => {
        this.obtenerTodasLasHabitaciones();
        this.toastr.success('Habitación eliminada exitosamente', '', {
          enableHtml: true,
          toastClass: 'toast-eliminar'
        });
        this.closeDeleteModal();
      }, error => {
        console.error(error);
        this.toastr.error('ERROR al eliminar la habitación', '', {
          enableHtml: true,
          toastClass: 'toast-error'
        });
        this.closeDeleteModal();
      });
    }
  }

  editarHabitacion(idHabitacion: number): void {
    this.router.navigate(['/app-web/habitaciones/habitaciones-registro', idHabitacion]);
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }

  actualizarDisponibilidad(habitacion: any): void {
    this.habitacionesService.actualizarHabitacion(habitacion.idHabitacion, habitacion).subscribe(response => {
      console.log('Disponibilidad actualizada');
    }, error => {
      console.error(error);
    });
  }
}
