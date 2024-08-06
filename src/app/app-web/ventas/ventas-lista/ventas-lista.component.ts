import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../services/ventas/ventas.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';
import { TokenService } from '../../services/authentication/token.service';
import unidecode from 'unidecode';
import moment from 'moment';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-ventas-lista',
  templateUrl: './ventas-lista.component.html',
  styleUrls: ['./ventas-lista.component.css'],
})
export class VentasListaComponent implements OnInit {
  ventas: any[] = [];
  ventasFiltradas: any[] = [];
  ordenActual: string = 'idVenta';
  orden: string = 'asc';

  isLogged = false;
  isAdmin = false;
  isLoading = false;

  constructor(
    private ventasService: VentasService,
    private router: Router,
    private notificationService: NotificationService,
    private notiService: NotiServiceService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasVentas();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodasLasVentas() {
    this.isLoading = true;
    this.ventasService.obtenerTodasLasVentas().subscribe(
      (response) => {
        this.isLoading = false;
        this.ventas = response;
        this.ventasFiltradas = [...this.ventas];
      },
      (error) => {
        this.isLoading = false;
        this.notiService.showError('ERROR al cargar las ventas');
      }
    );
  }

  buscarVenta(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor);

    if (valor === '') {
      this.ventasFiltradas = [...this.ventas];
    } else {
      this.ventasFiltradas = this.ventas.filter(
        (venta) =>
          this.contieneTextoNormalizado(
            venta.idVenta.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            venta.total.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            venta.fechaVenta.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            venta.idEmpleado.persona.nombre.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneProducto(venta.detallesVenta, valorNormalizado)
      );
    }
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto);
    return textoNormalizado.includes(valorNormalizado);
  }

  contieneProducto(detallesVenta: any[], valorNormalizado: string): boolean {
    for (const detalleVenta of detallesVenta) {
      if (
        this.contieneTextoNormalizado(
          detalleVenta.producto.nombreProducto.toLowerCase(),
          valorNormalizado
        )
      ) {
        return true;
      }
    }
    return false;
  }

  ordenarVentas(criterio: string) {
    if (this.ordenActual === criterio) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = criterio;
      this.orden = 'asc';
    }

    const factor = this.orden === 'asc' ? 1 : -1;
    this.ventasFiltradas.sort((a, b) => {
      const aValue = this.obtenerValor(a, criterio);
      const bValue = this.obtenerValor(b, criterio);

      if (criterio.includes('fecha')) {
        // Para fechas
        return moment(aValue).diff(moment(bValue)) * factor;
      } else if (typeof aValue === 'string') {
        // Para strings
        return aValue.localeCompare(bValue) * factor;
      } else {
        // Para números
        return (aValue - bValue) * factor;
      }
    });
  }

  obtenerValor(venta: any, criterio: string): any {
    const keys = criterio.split('.');
    let value = venta;
    for (const key of keys) {
      value = value[key];
    }
    return value;
  }

  notification(idVenta: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar esta venta?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarVenta(idVenta);
        }
      });
  }

  eliminarVenta(idVenta: number) {
    this.ventasService.eliminarVenta(idVenta).subscribe(
      () => {
        this.obtenerTodasLasVentas();
        this.notificationService.showSuccess(
          'Venta eliminado exitosamente',
          ''
        );
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(
          'ERROR al querer eliminar la venta',
          ''
        );
      }
    );
  }

  editarVenta(idVenta: number): void {
    this.router.navigate(['/app-web/ventas/ventas-registro', idVenta]);
  }

  generarReporte() {
    // Crear una nueva instancia de jsPDF con orientación horizontal
    const doc = new jsPDF('landscape');

    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 15);

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
      { header: 'ID', dataKey: 'idVenta' },
      { header: 'Empleado', dataKey: 'empleado' },
      { header: 'Fecha Venta', dataKey: 'fechaVenta' },
      { header: 'Total', dataKey: 'total' },
      { header: 'Detalles', dataKey: 'detallesVenta' },
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

    // Mapear los datos de las ventas
    const rows = this.ventasFiltradas.map((venta) => ({
      idVenta: venta.idVenta,
      empleado:
        venta.idEmpleado && venta.idEmpleado.persona
          ? `${venta.idEmpleado.persona.nombre} ${venta.idEmpleado.persona.apellidoPaterno} ${venta.idEmpleado.persona.apellidoMaterno}`
          : 'N/A',
      fechaVenta: formatFecha(new Date(venta.fechaVenta)),
      total: `$${venta.total}`,
      detallesVenta: venta.detallesVenta
        ? venta.detallesVenta
            .map(
              (detalle: any) =>
                `Producto: ${detalle.producto.nombreProducto} - Cantidad: ${detalle.cantidad} - Precio: $${detalle.precioUnitario} - SubTotal: $${detalle.subtotal}`
            )
            .join('\n') // Cambiar a salto de línea
        : 'N/A',
      ...(this.isAdmin
        ? {
            fechaCreacion: venta.fechaCreacion
              ? formatFechaHora(new Date(venta.fechaCreacion))
              : 'N/A',
            fechaActualizacion: venta.fechaActualizacion
              ? formatFechaHora(new Date(venta.fechaActualizacion))
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
        detallesVenta: {
          cellWidth: 'auto', // Ajusta automáticamente el ancho de la celda para contenido
          fontSize: 8, // Ajusta el tamaño de la fuente para adaptarse al contenido
        },
      },
    });

    // Construir el nombre del archivo
    const nombreArchivo = `registro_ventas_${dia}-${mes}-${anio}.pdf`;

    // Guardar el archivo PDF
    doc.save(nombreArchivo);
  }
}
