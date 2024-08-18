import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes/clientes.service';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import unidecode from 'unidecode';
import { TokenService } from '../../services/authentication/token.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css'],
})
export class ClientesListaComponent implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  clientesFiltradosPaginados: any[] = [];
  clienteAEliminar: number | null = null;
  ordenActual: string = 'idCliente';
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
    private clientesService: ClientesService,
    private router: Router,
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private notiService: NotiServiceService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosClientes();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodosLosClientes() {
    this.isLoading = true;
    this.clientesService.obtenerTodosLosClientes().subscribe(
      (response: any[]) => {
        this.isLoading = false;
        this.clientes = response.reverse();
        this.clientesFiltrados = [...this.clientes];
        this.updatePagination();
      },
      (error) => {
        this.notiService.showError('ERROR al cargar los clientes');
        this.isLoading = false;
      }
    );
  }

  getRangeInfo(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(
      this.currentPage * this.itemsPerPage,
      this.clientesFiltrados.length
    );
    return `${start} - ${end} de ${this.clientesFiltrados.length}`;
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.clientesFiltrados.length / this.itemsPerPage
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
    this.clientesFiltradosPaginados = this.clientesFiltrados.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  buscarCliente(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor);

    if (valor === '') {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clientes.filter(
        (cliente) =>
          this.contieneTextoNormalizado(
            cliente.persona.nombre.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            cliente.persona.apellidoPaterno.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            cliente.persona.apellidoMaterno.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            cliente.persona.telefono.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            cliente.persona.correo.toLowerCase(),
            valorNormalizado
          )
      );
    }
    this.updatePagination();
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto);
    return textoNormalizado.includes(valorNormalizado);
  }

  ordenarClientes(campo: string) {
    if (this.ordenActual === campo) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = campo;
      this.orden = 'asc';
    }

    const factor = this.orden === 'asc' ? 1 : -1;
    this.clientesFiltrados.sort((a, b) => {
      const aValue = this.obtenerValor(a, campo);
      const bValue = this.obtenerValor(b, campo);

      // Comparar fechas
      if (campo === 'fechaCreacion' || campo === 'fechaActualizacion') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return (aDate.getTime() - bDate.getTime()) * factor;
      }

      // Comparar valores generales
      if (aValue < bValue) return -1 * factor;
      if (aValue > bValue) return 1 * factor;
      return 0;
    });
    this.updatePagination();
  }

  obtenerValor(obj: any, campo: string) {
    return campo.split('.').reduce((o, i) => o[i], obj);
  }

  notification(idCliente: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar este cliente?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarCliente(idCliente);
        }
      });
  }

  eliminarCliente(idCliente: number) {
    this.clientesService.eliminarCliente(idCliente).subscribe(
      () => {
        this.obtenerTodosLosClientes();
        this.notificationService.showSuccess(
          'Cliente eliminado exitosamente',
          ''
        );
      },
      (error) => {
        this.notificationService.showError(
          'ERROR al querer eliminar al cliente',
          ''
        );
      }
    );
  }

  editarCliente(idCliente: number) {
    this.router.navigate(['/app-web/clientes/clientes-registro', idCliente]);
  }

  generarReporte() {
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text('Reporte de Clientes', 14, 15);

    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const anio = fechaActual.getFullYear();
    const fechaFormato = `${dia}/${mes}/${anio}`;

    doc.setFontSize(12);
    doc.text(`Generado el: ${fechaFormato}`, 14, 23);

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

    const columns = [
      { header: 'ID', dataKey: 'idCliente' },
      { header: 'Nombre Completo', dataKey: 'nombreCompleto' },
      { header: 'Teléfono', dataKey: 'telefono' },
      { header: 'Correo', dataKey: 'correo' },
      ...(this.isAdmin
        ? [
            { header: 'Fecha de Creación', dataKey: 'fechaCreacion' },
            { header: 'Fecha de Actualización', dataKey: 'fechaActualizacion' },
          ]
        : []),
    ];

    const clientesOrdenados = [...this.clientes].reverse();

    const rows = clientesOrdenados.map((cliente) => ({
      idCliente: cliente.idCliente,
      nombreCompleto: `${cliente.persona.nombre} ${cliente.persona.apellidoPaterno} ${cliente.persona.apellidoMaterno}`,
      telefono: cliente.persona.telefono,
      correo: cliente.persona.correo,
      ...(this.isAdmin
        ? {
            fechaCreacion: cliente.fechaCreacion
              ? formatFechaHora(new Date(cliente.fechaCreacion))
              : '',
            fechaActualizacion: cliente.fechaActualizacion
              ? formatFechaHora(new Date(cliente.fechaActualizacion))
              : 'N/A',
          }
        : {}),
    }));

    (doc as any).autoTable({
      columns: columns,
      body: rows,
      startY: 28,
      margin: { left: 14, right: 14 },
      theme: 'striped',
    });

    const nombreArchivo = `registro_clientes_${dia}-${mes}-${anio}.pdf`;
    doc.save(nombreArchivo);
  }
}
