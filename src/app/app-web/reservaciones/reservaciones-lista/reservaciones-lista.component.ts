import { Component, OnInit } from '@angular/core';
import { ReservacionesService } from '../../services/reservaciones/reservaciones.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';
import moment from 'moment';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-reservaciones-lista',
  templateUrl: './reservaciones-lista.component.html',
  styleUrls: ['./reservaciones-lista.component.css'],
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
    private notificationService: NotificationService,
    private notiService: NotiServiceService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasReservaciones();
  }

  obtenerTodasLasReservaciones() {
    this.reservacionesService.obtenerTodasLasReservaciones().subscribe(
      (response) => {
        this.reservaciones = response;
        this.reservacionesFiltradas = [...this.reservaciones];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  buscarReservacion(event: any): void {
    const valor = event.target.value.toLowerCase().trim();
    if (valor === '') {
      this.reservacionesFiltradas = [...this.reservaciones];
    } else {
      this.reservacionesFiltradas = this.reservaciones.filter(
        (reservacion) =>
          unidecode(
            reservacion.idCliente.persona.nombre.toLowerCase()
          ).includes(valor) ||
          unidecode(
            reservacion.idCliente.persona.apellidoPaterno.toLowerCase()
          ).includes(valor) ||
          unidecode(
            reservacion.idCliente.persona.apellidoMaterno.toLowerCase()
          ).includes(valor) ||
          unidecode(reservacion.idHabitacion.habitacion.toLowerCase()).includes(
            valor
          )
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

  notification(idReservacion: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar esta reservacion?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarReservacion(idReservacion);
        }
      });
  }

  eliminarReservacion(idReservacion: number) {
    this.reservacionesService.eliminarReservacion(idReservacion).subscribe(
      () => {
        this.obtenerTodasLasReservaciones();
        this.notificationService.showSuccess(
          'Reservación eliminado exitosamente',
          ''
        );
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(
          'ERROR al querer eliminar la reservación',
          ''
        );
      }
    );
  }

  generarPagos(reservacion: any): any[] {
    if (!reservacion.pagos || reservacion.pagos.length === 0) {
      return [];
    }

    const fechaInicio = moment(reservacion.fechaInicio);
    const tipoReservacion = reservacion.tipoReservacion; // "diaria", "semanal", "mensual"

    return reservacion.pagos.map((pago: any, index: number) => {
      let fechaPago: moment.Moment | undefined;
      if (tipoReservacion === 'NOCHE') {
        fechaPago = fechaInicio.clone().add(index, 'days');
      } else if (tipoReservacion === 'SEMANA') {
        fechaPago = fechaInicio.clone().add(index, 'weeks');
      } else if (tipoReservacion === 'MES') {
        fechaPago = fechaInicio.clone().add(index, 'months');
      } else {
        fechaPago = fechaInicio.clone(); // Valor por defecto si el tipo de reservación no es válido
      }
      return { ...pago, fechaPago: fechaPago.format('DD/MM/YYYY') };
    });
  }

  actualizarPago(
    idPago: number,
    numero: number,
    monto: number,
    event: Event,
    reservacion: any
  ) {
    const inputElement = event.target as HTMLInputElement;
    const pagado = inputElement.checked;

    const pagoDTO = {
      idPago, // Agregar si es necesario para la identificación en el backend
      monto,
      pagado,
      numeroPago: numero,
    };

    this.reservacionesService.actualizarEstadoPago(idPago, pagoDTO).subscribe(
      (response) => {
        this.notiService.showSuccess('Pago actualizado');

        const pagoActualizado = reservacion.pagos.find(
          (pago: any) => pago.idPago === idPago
        );
        if (pagoActualizado) {
          pagoActualizado.pagado = pagado;
        }
      },
      (error) => {
        console.error('Error al actualizar pago', error);
        this.notiService.showError('ERROR al actualizar pago');
      }
    );
  }

  editarReservacion(idReservacion: number) {
    this.router.navigate([
      '/app-web/reservaciones/reservaciones-registro',
      idReservacion,
    ]);
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }
}
