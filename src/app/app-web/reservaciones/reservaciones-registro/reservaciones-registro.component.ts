import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../services/clientes/clientes.service';
import { ReservacionesService } from '../../services/reservaciones/reservaciones.service';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ToastrService } from 'ngx-toastr';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-reservaciones-registro',
  templateUrl: './reservaciones-registro.component.html',
  styleUrls: ['./reservaciones-registro.component.css'],
})
export class ReservacionesRegistroComponent implements OnInit {
  titulo = 'Agregar Reservación';
  formReservacion: FormGroup;
  id: any | null;
  clientes: any[] = [];
  habitaciones: any[] = [];
  tipoReservacion: string[] = ['NOCHE', 'SEMANA', 'MES'];
  selectedHabitacion: any | null = null;
  showSmallElements: { [key: string]: boolean } = {};
  showModal = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private reservacionesService: ReservacionesService,
    private habitacionesService: HabitacionesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private notiService: NotiServiceService
  ) {
    this.formReservacion = this.fb.group({
      idCliente: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      tiempoReservacion: ['', [Validators.required, this.tiempoValidator]],
      tipoReservacion: ['', [Validators.required]],
      idHabitacion: ['', [Validators.required]],
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerHabitaciones();
    this.esEditar();
  }

  obtenerClientes() {
    this.clientesService.obtenerTodosLosClientes().subscribe((response) => {
      this.clientes = response;
      // Ordenar clientes del más reciente al más antiguo (por ID, fecha de creación, etc.)
      this.clientes.sort((a, b) => b.idCliente - a.idCliente); // Ordenar por ID en orden descendente
    });
  }

  obtenerHabitaciones() {
    this.habitacionesService.obtenerTodasLasHabitaciones().subscribe((response) => {
      this.habitaciones = response;
    });
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Reservación';
      this.isLoading = true;
      this.reservacionesService.buscarReservacionPorId(this.id).subscribe(
        (response) => {
          this.isLoading = false;
          this.selectedHabitacion = response.idHabitacion;
          this.formReservacion.patchValue({
            idCliente: response.idCliente.idCliente,
            fechaInicio: response.fechaInicio,
            tiempoReservacion: response.tiempoReservacion,
            tipoReservacion: response.tipoReservacion,
            idHabitacion: response.idHabitacion.idHabitacion,
          });
        },
        (error) => {
          this.isLoading = false;
          this.notiService.showError('ERROR al cargar reservación');
        }
      );
    }
  }

  agregarOEditar(): void {
    if (this.id === null) {
      this.agregar();
    } else {
      this.editar(this.id);
    }
  }

  agregar(): void {
    const reservacion = this.prepareSaveReservacion();
    this.reservacionesService.agregarReservacion(reservacion).subscribe(
      (response) => {
        this.router.navigate(['/app-web/reservaciones/reservaciones-lista']);
        this.notiService.showSuccess('Reservación agregada');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al agregar reservación');
      }
    );
  }

  editar(id: any): void {
    const reservacion = this.prepareSaveReservacion();
    this.reservacionesService.actualizarReservacion(id, reservacion).subscribe(
      (response) => {
        this.router.navigate(['/app-web/reservaciones/reservaciones-lista']);
        this.notiService.showSuccess('Reservación editada');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al editar la reservación');
      }
    );
  }

  prepareSaveReservacion() {
    const formModel = this.formReservacion.value;
    return {
      idCliente: formModel.idCliente,
      fechaInicio: formModel.fechaInicio,
      tiempoReservacion: formModel.tiempoReservacion,
      tipoReservacion: formModel.tipoReservacion,
      idHabitacion: formModel.idHabitacion,
    };
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  selectHabitacion(habitacion: any): void {
    this.selectedHabitacion = habitacion;
    this.formReservacion.patchValue({
      idHabitacion: habitacion.idHabitacion
    });
    this.closeModal();
  }

  toggleSmallElementsVisibility(elementId: string, show: boolean) {
    this.showSmallElements[elementId] = show;
  }

  tiempoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!Number.isInteger(value) || value < 0) {
      return { invalidCupo: true };
    }
    return null;
  }
}
