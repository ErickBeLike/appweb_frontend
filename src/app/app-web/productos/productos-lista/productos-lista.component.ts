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
  productosFiltradosPaginados: any[] = [];
  ordenActual: string = 'idProducto';
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
        this.productos = response.reverse();
        this.productosFiltrados = [...this.productos];
        this.updatePagination();
      },
      (error) => {
        this.isLoading = false;
        this.notiService.showError('ERROR al cargar los productos');
      }
    );
  }

  // Función para obtener el rango de información
  getRangeInfo(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(
      this.currentPage * this.itemsPerPage,
      this.productosFiltrados.length
    );
    return `${start} - ${end} de ${this.productosFiltrados.length}`;
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.productosFiltrados.length / this.itemsPerPage
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
    this.productosFiltradosPaginados = this.productosFiltrados.slice(
      start,
      end
    );
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  buscarProducto(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor);

    if (valor === '') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter(
        (producto) =>
          this.contieneTextoNormalizado(
            producto.nombreProducto.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            producto.precioProducto.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            producto.stock.toString(),
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
    this.updatePagination();
  }

  obtenerValor(obj: any, campo: string) {
    if (campo === 'fechaCreacion' || campo === 'fechaActualizacion') {
      return new Date(obj[campo]).getTime();
    }
    return obj[campo];
  }

  notification(idProducto: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar este producto?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarProducto(idProducto);
        }
      });
  }

  eliminarProducto(idProducto: number) {
    this.productosService.eliminarProducto(idProducto).subscribe(
      () => {
        this.obtenerTodosLosProductos();
        this.notificationService.showSuccess(
          'Producto eliminado exitosamente',
          ''
        );
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(
          'ERROR al querer eliminar el producto',
          ''
        );
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
      { header: 'Precio', dataKey: 'precioProducto' },
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

    const productosOrdenados = [...this.productos].reverse();

    // Mapear los datos de los productos
    const rows = productosOrdenados.map((producto) => ({
      idProducto: producto.idProducto,
      nombreProducto: producto.nombreProducto,
      precioProducto:
        producto.precioProducto != null
          ? producto.precioProducto.toFixed(2)
          : 'N/A',
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
