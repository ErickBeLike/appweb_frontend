import { Component, OnInit } from '@angular/core';
import { ReservacionesService } from '../../services/reservaciones/reservaciones.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';
import moment from 'moment';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';
import { TokenService } from '../../services/authentication/token.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  isLogged = false;
  isAdmin = false;

  isLoading = false;

  constructor(
    private reservacionesService: ReservacionesService,
    private router: Router,
    private notificationService: NotificationService,
    private notiService: NotiServiceService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasReservaciones();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodasLasReservaciones() {
    this.isLoading = true;
    this.reservacionesService.obtenerTodasLasReservaciones().subscribe(
      (response) => {
        this.isLoading = false;
        this.reservaciones = response;
        this.reservacionesFiltradas = [...this.reservaciones];
      },
      (error) => {
        this.isLoading = false;
        this.notiService.showError('ERROR al cargar las reservaciones');
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
    if (path === 'fechaCreacion' || path === 'fechaActualizacion') {
      return new Date(value).getTime();
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
          'Reservación eliminada exitosamente',
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
    const tipoReservacion = reservacion.tipoReservacion;

    return reservacion.pagos.map((pago: any, index: number) => {
      let fechaPago: moment.Moment | undefined;
      if (tipoReservacion === 'NOCHE') {
        fechaPago = fechaInicio.clone().add(index, 'days');
      } else if (tipoReservacion === 'SEMANA') {
        fechaPago = fechaInicio.clone().add(index, 'weeks');
      } else if (tipoReservacion === 'MES') {
        fechaPago = fechaInicio.clone().add(index, 'months');
      } else {
        fechaPago = fechaInicio.clone();
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
      idPago,
      monto,
      pagado,
      numeroPago: numero,
    };

    this.reservacionesService.actualizarEstadoPago(idPago, pagoDTO).subscribe(
      (response) => {
        this.obtenerTodasLasReservaciones();
        this.notiService.showSuccess('Pago actualizado');

        const pagoActualizado = reservacion.pagos.find(
          (pago: any) => pago.idPago === idPago
        );
        if (pagoActualizado) {
          pagoActualizado.pagado = pagado;
        }
      },
      (error) => {
        this.obtenerTodasLasReservaciones();
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
    // Crear una nueva instancia de jsPDF con orientación horizontal
    const doc = new jsPDF('landscape');

    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Reservaciones', 14, 15);

    // Obtener la fecha actual en formato dia-mes-año
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Mes es 0-indexado
    const anio = fechaActual.getFullYear();
    const fechaFormato = `${dia}/${mes}/${anio}`;

    // Añadir la fecha de generación del reporte
    doc.setFontSize(12);
    doc.text(`Generado el: ${fechaFormato}`, 14, 23);

    // Definir las columnas
    const columns = [
      { header: 'ID', dataKey: 'idReservacion' },
      { header: 'Nombre Cliente', dataKey: 'nombreCliente' },
      { header: 'Habitación', dataKey: 'habitacion' },
      { header: 'Fecha Inicio', dataKey: 'fechaInicio' },
      { header: 'Fecha Fin', dataKey: 'fechaFin' },
      { header: 'Tipo Reservación', dataKey: 'tipoReservacion' },
      { header: 'Pagos', dataKey: 'pagos' },
      ...(this.isAdmin
        ? [
            { header: 'Fecha de Creación', dataKey: 'fechaCreacion' },
            { header: 'Fecha de Actualización', dataKey: 'fechaActualizacion' },
          ]
        : []),
    ];

    // Función para formatear solo la fecha (sin hora)
    const formatSoloFecha = (fecha: Date) => {
      const opciones: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      return fecha.toLocaleDateString('es-ES', opciones);
    };

    // Función para formatear fechas y horas
    const formatFechaHora = (fecha: Date) => {
      const opciones: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      return fecha.toLocaleString('es-ES', opciones);
    };

    // Mapear los datos de las reservaciones
    const rows = this.reservacionesFiltradas.map((reservacion) => ({
      idReservacion: reservacion.idReservacion,
      nombreCliente: `${reservacion.idCliente.persona.nombre} ${reservacion.idCliente.persona.apellidoPaterno} ${reservacion.idCliente.persona.apellidoMaterno}`,
      habitacion: reservacion.idHabitacion.habitacion,
      fechaInicio: formatSoloFecha(new Date(reservacion.fechaInicio)), // Solo fecha
      fechaFin: formatSoloFecha(new Date(reservacion.fechaFinal)), // Solo fecha
      tipoReservacion: reservacion.tipoReservacion,
      pagos: reservacion.pagos
        .map(
          (pago: any) =>
            `Pago ${pago.numeroPago}: $${pago.monto} - ${
              pago.pagado ? 'PAGADO' : 'NO PAGADO'
            }`
        )
        .join('\n'), // Cambiar a salto de línea
      ...(this.isAdmin
        ? {
            fechaCreacion: reservacion.fechaCreacion
              ? formatFechaHora(new Date(reservacion.fechaCreacion))
              : 'N/A',
            fechaActualizacion: reservacion.fechaActualizacion
              ? formatFechaHora(new Date(reservacion.fechaActualizacion))
              : 'N/A',
          }
        : {}),
    }));

    // Añadir la tabla al documento PDF
    (doc as any).autoTable({
      columns: columns,
      body: rows,
      startY: 28,
      margin: { left: 14, right: 14 },
      theme: 'striped',
      styles: {
        cellPadding: 1,
        fontSize: 10,
        valign: 'top', // Alinea el texto en la parte superior de la celda
      },
      columnStyles: {
        pagos: {
          cellWidth: 'auto', // Ajusta automáticamente el ancho de la celda para contenido
          fontSize: 8, // Ajusta el tamaño de la fuente para adaptarse al contenido
        },
      },
    });

    // Construir el nombre del archivo
    const nombreArchivo = `registro_reservaciones_${dia}-${mes}-${anio}.pdf`;

    // Guardar el archivo PDF
    doc.save(nombreArchivo);
  }
}
