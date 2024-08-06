import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos/productos.service';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';
import { TokenService } from '../../services/authentication/token.service';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-productos-lista',
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css'],
})
export class ProductosListaComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  ordenActual: string = 'idProducto';
  orden: string = 'asc';
  isLogged = false;
  isAdmin = false;
  isLoading = false;

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private notificationService: NotificationService,
    private notiService: NotiServiceService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosProductos();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodosLosProductos() {
    this.isLoading = true;
    this.productosService.obtenerTodosLosProductos().subscribe(
      (response: any[]) => {
        this.isLoading = false;
        this.productos = response;
        this.productosFiltrados = [...this.productos];
      },
      (error) => {
        this.isLoading = false;
        this.notiService.showError('ERROR al cargar los productos');
      }
    );
  }

  buscarProducto(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor);

    if (valor === '') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter(
        (producto) =>
          this.contieneTextoNormalizado(producto.nombreProducto.toLowerCase(), valorNormalizado) ||
          this.contieneTextoNormalizado(producto.precioProducto.toString(), valorNormalizado)
      );
    }
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto);
    return textoNormalizado.includes(valorNormalizado);
  }

  ordenarProductos(campo: string) {
    if (this.ordenActual === campo) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = campo;
      this.orden = 'asc';
    }

    const factor = this.orden === 'asc' ? 1 : -1;
    this.productosFiltrados.sort((a, b) => {
      const aValue = this.obtenerValor(a, campo);
      const bValue = this.obtenerValor(b, campo);

      if (aValue < bValue) return -1 * factor;
      if (aValue > bValue) return 1 * factor;
      return 0;
    });
  }

  obtenerValor(obj: any, campo: string) {
    if (campo === 'fechaCreacion' || campo === 'fechaActualizacion') {
      return new Date(obj[campo]).getTime();
    }
    return obj[campo];
  }

  notification(idProducto: number) {
    this.notificationService.showConfirmation('Confirmar Eliminación', '¿Estás seguro de que deseas eliminar este producto?')
      .then(confirmed => {
        if (confirmed) {
          this.eliminarProducto(idProducto);
        }
      });
  }

  eliminarProducto(idProducto: number) {
    this.productosService.eliminarProducto(idProducto).subscribe(
      () => {
        this.obtenerTodosLosProductos();
        this.notificationService.showSuccess('Producto eliminado exitosamente', '');
      },
      (error) => {
        console.error(error);
        this.notificationService.showError('ERROR al querer eliminar el producto', '');
      }
    );
  }

  editarProducto(idProducto: number) {
    this.router.navigate(['/app-web/productos/productos-registro', idProducto]);
  }

  generarReporte() {
    // Crear una nueva instancia de jsPDF con orientación horizontal
    const doc = new jsPDF('landscape');

    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Productos', 14, 15);

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
      { header: 'ID', dataKey: 'idProducto' },
      { header: 'Nombre', dataKey: 'nombreProducto' },
      { header: 'Precio por Unidad', dataKey: 'precioPorUnidad' },
      { header: 'Precio por Paquete', dataKey: 'precioPorPaquete' },
      { header: 'Precio por Mayor', dataKey: 'precioPorMayor' },
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

    // Mapear los datos de los productos
    const rows = this.productosFiltrados.map((producto) => ({
      idProducto: producto.idProducto,
      nombreProducto: producto.nombreProducto,
      precioPorUnidad: producto.precioPorUnidad != null ? producto.precioPorUnidad.toFixed(2) : 'N/A',
      precioPorPaquete: producto.precioPorPaquete != null ? producto.precioPorPaquete.toFixed(2) : 'N/A',
      precioPorMayor: producto.precioPorMayor != null ? producto.precioPorMayor.toFixed(2) : 'N/A',
      ...(this.isAdmin
        ? {
            fechaCreacion: producto.fechaCreacion
              ? formatFechaHora(new Date(producto.fechaCreacion))
              : 'N/A',
            fechaActualizacion: producto.fechaActualizacion
              ? formatFechaHora(new Date(producto.fechaActualizacion))
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
    const nombreArchivo = `registro_productos_${dia}-${mes}-${anio}.pdf`;

    // Guardar el archivo PDF
    doc.save(nombreArchivo);
  }
}
