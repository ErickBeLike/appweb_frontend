import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados/empleados.service';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';
import { TokenService } from '../../services/authentication/token.service';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-empleados-lista',
  templateUrl: './empleados-lista.component.html',
  styleUrls: ['./empleados-lista.component.css'],
})
export class EmpleadosListaComponent implements OnInit {
  empleados: any[] = [];
  empleadosFiltrados: any[] = [];
  empleadosFiltradosPaginados: any[] = [];
  empleadoAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idEmpleado';
  orden: string = 'asc';

  isLoading = false;

  isLogged = false;
  isAdmin = false;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  pageNumbers: number[] = [];

  constructor(
    private empleadosService: EmpleadosService,
    private router: Router,
    private notificationService: NotificationService,
    private notiService: NotiServiceService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosEmpleados();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodosLosEmpleados() {
    this.isLoading = true;
    this.empleadosService.obtenerTodosLosEmpleados().subscribe(
      (response: any[]) => {
        this.isLoading = false;
        this.empleados = response.reverse();
        this.empleadosFiltrados = [...this.empleados];
        this.updatePagination();
      },
      (error) => {
        this.isLoading = false;
        this.notiService.showError('ERROR al cargar los empleados');
      }
    );
  }

  // Función para obtener el rango de información
  getRangeInfo(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(
      this.currentPage * this.itemsPerPage,
      this.empleadosFiltrados.length
    );
    return `${start} - ${end} de ${this.empleadosFiltrados.length}`;
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.empleadosFiltrados.length / this.itemsPerPage
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
    this.empleadosFiltradosPaginados = this.empleadosFiltrados.slice(
      start,
      end
    );
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  verInformacion(idEmpleado: number) {
    this.router.navigate([`/app-web/empleados/empleados-info/${idEmpleado}`]);
  }

  buscarEmpleado(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor); // Normaliza el texto de búsqueda

    if (valor === '') {
      this.empleadosFiltrados = [...this.empleados];
    } else {
      this.empleadosFiltrados = this.empleados.filter(
        (empleado) =>
          this.contieneTextoNormalizado(
            empleado.persona.nombre.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.idCargo.nombreCargo.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.fechaNacimiento.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.sexo.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.persona.correo.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.persona.telefono.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.direccionEmpleado.toLowerCase(),
            valorNormalizado
          ) ||
          empleado.diasLaborales.some((dia: string) =>
            this.contieneTextoNormalizado(dia.toLowerCase(), valorNormalizado)
          )
      );
    }
    this.updatePagination();
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto); // Normaliza el texto de la tabla
    return textoNormalizado.includes(valorNormalizado);
  }

  ordenarEmpleados(columna: string) {
    if (columna === this.ordenActual) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = columna;
      this.orden = 'asc';
    }

    this.empleadosFiltrados.sort((a, b) => {
      const valorA = this.obtenerValorParaOrden(a, columna);
      const valorB = this.obtenerValorParaOrden(b, columna);

      // Manejar comparación de fechas de creación y actualización
      if (columna === 'fechaCreacion' || columna === 'fechaActualizacion') {
        const fechaA = new Date(valorA);
        const fechaB = new Date(valorB);
        return (
          (fechaA.getTime() - fechaB.getTime()) *
          (this.orden === 'asc' ? 1 : -1)
        );
      }

      // Manejar comparación de valores generales
      if (valorA > valorB) {
        return this.orden === 'asc' ? 1 : -1;
      } else if (valorA < valorB) {
        return this.orden === 'asc' ? -1 : 1;
      } else {
        return 0;
      }
    });
    this.updatePagination();
  }

  obtenerValorParaOrden(obj: any, campo: string) {
    return campo.split('.').reduce((o, i) => o[i], obj);
  }

  notification(idEmpleaddo: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar este empleado?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarEmpleado(idEmpleaddo);
        }
      });
  }

  eliminarEmpleado(idEmpleado: number) {
    this.empleadosService.eliminarEmpleado(idEmpleado).subscribe(
      () => {
        this.obtenerTodosLosEmpleados();
        this.notificationService.showSuccess(
          'Empleado eliminado exitosamente',
          ''
        );
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(
          'ERROR al querer eliminar al empleado',
          ''
        );
      }
    );
  }

  editarEmpleado(idEmpleado: number) {
    this.router.navigate(['/app-web/empleados/empleados-registro', idEmpleado]);
  }

  generarReporte() {
    // Crear una nueva instancia de jsPDF con orientación horizontal
    const doc = new jsPDF('landscape');

    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Empleados', 14, 15);

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
      { header: 'ID', dataKey: 'idEmpleado' },
      { header: 'Nombre Completo', dataKey: 'nombreCompleto' },
      { header: 'Cargo', dataKey: 'nombreCargo' },
      { header: 'Teléfono', dataKey: 'telefono' },
      { header: 'Correo', dataKey: 'correo' },
      { header: 'Fecha de Nacimiento', dataKey: 'fechaNacimiento' },
      { header: 'Sexo', dataKey: 'sexo' },
      { header: 'Dirección', dataKey: 'direccionEmpleado' },
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

    const empleadosOrdenados = [...this.empleados].reverse();


    // Mapear los datos de los empleados
    const rows = empleadosOrdenados.map((empleado) => ({
      idEmpleado: empleado.idEmpleado,
      nombreCompleto: `${empleado.persona.nombre} ${empleado.persona.apellidoPaterno} ${empleado.persona.apellidoMaterno}`,
      nombreCargo: empleado.idCargo.nombreCargo,
      telefono: empleado.persona.telefono,
      correo: empleado.persona.correo,
      fechaNacimiento: empleado.fechaNacimiento
        ? new Date(empleado.fechaNacimiento).toLocaleDateString('es-ES')
        : '',
      sexo: empleado.sexo,
      direccionEmpleado: empleado.direccionEmpleado,
      ...(this.isAdmin
        ? {
            fechaCreacion: empleado.fechaCreacion
              ? formatFechaHora(new Date(empleado.fechaCreacion))
              : '',
            fechaActualizacion: empleado.fechaActualizacion
              ? formatFechaHora(new Date(empleado.fechaActualizacion))
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
    const nombreArchivo = `registro_empleados_${dia}-${mes}-${anio}.pdf`;

    // Guardar el archivo PDF
    doc.save(nombreArchivo);
  }
}
