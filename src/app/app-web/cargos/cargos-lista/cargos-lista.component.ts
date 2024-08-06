import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CargosService } from '../../services/cargos/cargos.service';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';
import { TokenService } from '../../services/authentication/token.service';
import unidecode from 'unidecode'; 
import moment from 'moment'; 

import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 

@Component({
  selector: 'app-cargos-lista',
  templateUrl: './cargos-lista.component.html',
  styleUrls: ['./cargos-lista.component.css'],
})
export class CargosListaComponent implements OnInit {
  cargos: any[] = [];
  cargosFiltrados: any[] = [];
  cargoAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idCargo';
  orden: string = 'asc';

  isLogged = false;
  isAdmin = false;

  isLoading = false;

  constructor(
    private cargosService: CargosService,
    private router: Router,
    private notificationService: NotificationService,
    private notiService: NotiServiceService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosCargos();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodosLosCargos() {
    this.isLoading = true;
    this.cargosService.obtenerTodosLosCargos().subscribe(
      (response: any[]) => {
        this.isLoading = false;
        this.cargos = response;
        this.cargosFiltrados = [...this.cargos];
      },
      (error) => {
        this.isLoading = false;
        this.notiService.showError('ERROR al cargar los cargos');
      }
    );
  }

  buscarCargo(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor);

    if (valor === '') {
      this.cargosFiltrados = [...this.cargos];
    } else {
      this.cargosFiltrados = this.cargos.filter(
        (cargo) =>
          this.contieneTextoNormalizado(cargo.nombreCargo.toLowerCase(), valorNormalizado) ||
          this.contieneTextoNormalizado(cargo.descripcionCargo.toLowerCase(), valorNormalizado)
      );
    }
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto);
    return textoNormalizado.includes(valorNormalizado);
  }

  ordenarCargos(campo: string) {
    if (this.ordenActual === campo) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = campo;
      this.orden = 'asc';
    }

    const factor = this.orden === 'asc' ? 1 : -1;
    this.cargosFiltrados.sort((a, b) => {
      const aValue = this.obtenerValor(a, campo);
      const bValue = this.obtenerValor(b, campo);

      if (campo.includes('fecha')) {
        // Ordena por fechas usando moment
        return moment(aValue).diff(moment(bValue)) * factor;
      } else if (typeof aValue === 'string') {
        // Ordena por strings
        return aValue.localeCompare(bValue) * factor;
      } else {
        // Ordena por números
        return (aValue - bValue) * factor;
      }
    });
  }

  obtenerValor(obj: any, campo: string) {
    return campo.split('.').reduce((o, i) => o[i], obj);
  }

  notification(idCargo: number) {
    this.notificationService
      .showConfirmation('Confirmar Eliminación', '¿Estás seguro de que deseas eliminar este cargo?')
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarCargo(idCargo);
        }
      });
  }

  eliminarCargo(idCargo: number) {
    this.cargosService.eliminarCargo(idCargo).subscribe(
      () => {
        this.obtenerTodosLosCargos();
        this.notificationService.showSuccess('Cargo eliminado exitosamente', '');
      },
      (error) => {
        console.error(error);
        this.notificationService.showError('ERROR al querer eliminar el cargo', '');
      }
    );
  }

  editarCargo(idCargo: number) {
    this.router.navigate(['/app-web/cargos/cargos-registro', idCargo]);
  }

  generarReporte() {
    // Crear una nueva instancia de jsPDF con orientación vertical
    const doc = new jsPDF('portrait');

    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Cargos', 14, 15);

    // Obtener la fecha actual en formato día-mes-año
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
        { header: 'ID', dataKey: 'idCargo' },
        { header: 'Nombre', dataKey: 'nombreCargo' },
        { header: 'Descripción', dataKey: 'descripcionCargo' },
        ...(this.isAdmin
            ? [
                { header: 'Fecha de Creación', dataKey: 'fechaCreacion' },
                { header: 'Fecha de Actualización', dataKey: 'fechaActualizacion' },
            ]
            : []),
    ];

    // Función para formatear fechas
    const formatFecha = (fecha: Date) => {
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

    // Mapear los datos de los cargos
    const rows = this.cargosFiltrados.map((cargo) => ({
        idCargo: cargo.idCargo,
        nombreCargo: cargo.nombreCargo,
        descripcionCargo: cargo.descripcionCargo,
        ...(this.isAdmin
            ? {
                fechaCreacion: cargo.fechaCreacion
                    ? formatFechaHora(new Date(cargo.fechaCreacion))
                    : 'N/A',
                fechaActualizacion: cargo.fechaActualizacion
                    ? formatFechaHora(new Date(cargo.fechaActualizacion))
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
            valign: 'top',  // Alinea el texto en la parte superior de la celda
        },
        columnStyles: {
            descripcionCargo: {
                cellWidth: 'auto',  // Ajusta automáticamente el ancho de la celda para contenido
                fontSize: 8,  // Ajusta el tamaño de la fuente para adaptarse al contenido
            },
        },
    });

    // Construir el nombre del archivo
    const nombreArchivo = `reporte_cargos_${dia}-${mes}-${anio}.pdf`;

    // Guardar el archivo PDF
    doc.save(nombreArchivo);
}
}
