import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';
import { TokenService } from '../../services/authentication/token.service';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-habitaciones-lista',
  templateUrl: './habitaciones-lista.component.html',
  styleUrls: ['./habitaciones-lista.component.css'],
})
export class HabitacionesListaComponent implements OnInit {
  habitaciones: any[] = [];
  habitacionesFiltradas: any[] = [];
  habitacionesFiltradasPaginadas: any[] = [];

  ordenActual: string = 'idHabitacion';
  orden: string = 'asc';

  isLogged = false;
  isAdmin = false;
  isLoading = false;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  pageNumbers: number[] = [];

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
    this.isLoading = true;
    this.habitacionesService.obtenerTodasLasHabitaciones().subscribe(
      (response: any[]) => {
        this.isLoading = false;
        this.habitaciones = response.reverse();
        this.habitacionesFiltradas = [...this.habitaciones];
        this.updatePagination();
      },
      (error) => {
        this.isLoading = false;
        this.notiService.showError('ERROR al cargar las habitaciones');
      }
    );
  }

  // Función para obtener el rango de información
  getRangeInfo(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(
      this.currentPage * this.itemsPerPage,
      this.habitacionesFiltradas.length
    );
    return `${start} - ${end} de ${this.habitacionesFiltradas.length}`;
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.habitacionesFiltradas.length / this.itemsPerPage
    );
    this.pageNumbers = this.getVisiblePageNumbers();
    this.paginar();
  }

  getVisiblePageNumbers(): number[] {
    const maxPagesToShow = 5;
    const startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxPagesToShow / 2)
    );
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  }

  paginar() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.habitacionesFiltradasPaginadas = this.habitacionesFiltradas.slice(
      start,
      end
    );
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
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
        unidecode(habitacion.precioPorSemana.toString().toLowerCase()).includes(
          searchTerm
        ) ||
        unidecode(habitacion.precioPorMes.toString().toLowerCase()).includes(
          searchTerm
        ) ||
        unidecode(
          habitacion.depositoInicialNoche.toString().toLowerCase()
        ).includes(searchTerm) ||
        unidecode(
          habitacion.depositoInicialSemana.toString().toLowerCase()
        ).includes(searchTerm) ||
        unidecode(
          habitacion.depositoInicialMes.toString().toLowerCase()
        ).includes(searchTerm) ||
        unidecode(habitacion.disponibilidad.toLowerCase()).includes(searchTerm)
    );
    this.updatePagination();
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
      if (campo === 'fechaCreacion' || campo === 'fechaActualizacion') {
        campoA = new Date(campoA);
        campoB = new Date(campoB);
      }
      if (typeof campoA === 'string') {
        campoA = campoA.toLowerCase();
        campoB = campoB.toLowerCase();
      }
      if (campoA < campoB) return this.orden === 'asc' ? -1 : 1;
      if (campoA > campoB) return this.orden === 'asc' ? 1 : -1;
      return 0;
    });
    this.updatePagination();
  }

  notification(idHabitacion: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar esta habitación?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarHabitacion(idHabitacion);
        }
      });
  }

  eliminarHabitacion(idHabitacion: number) {
    this.habitacionesService.eliminarHabitacion(idHabitacion).subscribe(
      () => {
        this.obtenerTodasLasHabitaciones();
        this.notificationService.showSuccess(
          '',
          'Habitación eliminada exitosamente'
        );
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(
          '',
          'ERROR al querer eliminar la habitación'
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
    // Crear una nueva instancia de jsPDF con orientación horizontal
    const doc = new jsPDF('landscape');

    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Habitaciones', 14, 15);

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
      { header: 'ID', dataKey: 'idHabitacion' },
      { header: 'Habitación', dataKey: 'habitacion' },
      { header: 'Cupo', dataKey: 'cupo' },
      { header: 'Precio / Noche', dataKey: 'precioNoche' },
      { header: 'Depósito / Noche', dataKey: 'depositoNoche' },
      { header: 'Precio / Semana', dataKey: 'precioSemana' },
      { header: 'Depósito / Semana', dataKey: 'depositoSemana' },
      { header: 'Precio / Mes', dataKey: 'precioMes' },
      { header: 'Depósito / Mes', dataKey: 'depositoMes' },
      { header: 'Disponibilidad', dataKey: 'disponibilidad' },
      ...(this.isAdmin
        ? [
            { header: 'Fecha de Creación', dataKey: 'fechaCreacion' },
            { header: 'Fecha de Actualización', dataKey: 'fechaActualizacion' },
          ]
        : []),
    ];

    // Función para formatear fecha y hora
    const formatFechaHora = (fecha: Date) => {
      const opcionesFecha: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      const opcionesHora: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
      const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);
      return `${fechaFormateada} ${horaFormateada}`;
    };

    const habitacionesOrdenados = [...this.habitaciones].reverse();

    // Mapear los datos de las habitaciones
    const rows = habitacionesOrdenados.map((habitacion) => ({
      idHabitacion: habitacion.idHabitacion,
      habitacion: habitacion.habitacion,
      cupo: habitacion.cupo,
      precioNoche: habitacion.precioPorNoche,
      precioSemana: habitacion.precioPorSemana,
      precioMes: habitacion.precioPorMes,
      depositoNoche: habitacion.depositoInicialNoche,
      depositoSemana: habitacion.depositoInicialSemana,
      depositoMes: habitacion.depositoInicialMes,
      disponibilidad: habitacion.disponibilidad,
      ...(this.isAdmin
        ? {
            fechaCreacion: habitacion.fechaCreacion
              ? formatFechaHora(new Date(habitacion.fechaCreacion))
              : '',
            fechaActualizacion: habitacion.fechaActualizacion
              ? formatFechaHora(new Date(habitacion.fechaActualizacion))
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
    });

    // Construir el nombre del archivo
    const nombreArchivo = `registro_habitaciones_${dia}-${mes}-${anio}.pdf`;

    // Guardar el archivo PDF
    doc.save(nombreArchivo);
  }

  actualizarDisponibilidad(habitacion: any): void {
    this.habitacionesService
      .actualizarHabitacion(habitacion.idHabitacion, habitacion)
      .subscribe(
        () => {
          this.notiService.showSuccess('Disponibilidad actualizada');
          this.obtenerTodasLasHabitaciones();
        },
        (error) => {
          this.notiService.showError('ERROR al actualizar disponibilidad');
          this.obtenerTodasLasHabitaciones();
        }
      );
  }
}
