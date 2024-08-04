import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';
import { TokenService } from '../../services/authentication/token.service';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-habitaciones-lista',
  templateUrl: './habitaciones-lista.component.html',
  styleUrls: ['./habitaciones-lista.component.css'],
})
export class HabitacionesListaComponent implements OnInit {
  habitaciones: any[] = [];
  habitacionesFiltradas: any[] = [];
  habitacionAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idHabitacion';
  orden: string = 'asc';
  roles: string[] = [];

  isLogged = false;
  isAdmin = false;

  constructor(
    private habitacionesService: HabitacionesService,
    private router: Router,
    private notificationService: NotificationService,
    private notiService: NotiServiceService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasHabitaciones();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodasLasHabitaciones() {
    this.habitacionesService.obtenerTodasLasHabitaciones().subscribe(
      (response: any[]) => {
        this.habitaciones = response;
        // Al inicio, mostramos todas las habitaciones
        this.habitacionesFiltradas = [...this.habitaciones];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  buscarHabitacion(event: any) {
    const searchTerm = unidecode(event.target.value).toLowerCase();
    this.habitacionesFiltradas = this.habitaciones.filter(
      (habitacion) =>
        unidecode(habitacion.habitacion.toLowerCase()).includes(searchTerm) ||
        unidecode(habitacion.cupo.toString().toLowerCase()).includes(
          searchTerm
        ) ||
        unidecode(habitacion.precioPorNoche.toString().toLowerCase()).includes(
          searchTerm
        ) ||
        unidecode(
          habitacion.depositoInicialNoche.toString().toLowerCase()
        ).includes(searchTerm) ||
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

  notification(iddHabitacion: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar esta habitación?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarHabitacion(iddHabitacion);
        }
      });
  }

  eliminarHabitacion(idHabitacion: number) {
    this.habitacionesService.eliminarHabitacion(idHabitacion).subscribe(
      () => {
        this.obtenerTodasLasHabitaciones();
        this.notificationService.showSuccess(
          'Habitación eliminada exitosamente',
          ''
        );
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(
          'ERROR al querer eliminar la habitación',
          ''
        );
      }
    );
  }

  editarHabitacion(idHabitacion: number): void {
    this.router.navigate([
      '/app-web/habitaciones/habitaciones-registro',
      idHabitacion,
    ]);
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }

  actualizarDisponibilidad(habitacion: any): void {
    this.habitacionesService
      .actualizarHabitacion(habitacion.idHabitacion, habitacion)
      .subscribe(
        () => {
          console.log('Disponibilidad actualizada');
          this.notiService.showSuccess('Disponibilidad actualizada');
        },
        (error) => {
          console.error(error);
          this.notiService.showError('ERROR al actualizar disponibilidad');
        }
      );
  }
}
