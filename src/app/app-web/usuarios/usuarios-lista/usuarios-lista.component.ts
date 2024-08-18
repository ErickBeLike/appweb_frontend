import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';
import { TokenService } from '../../services/authentication/token.service';
import unidecode from 'unidecode';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.css'],
})
export class UsuariosListaComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  usuariosFiltradosPaginados: any[] = [];
  contrasenasVisiblesPorFila: { [key: number]: boolean } = {};
  usuarioAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idUsuario';
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
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private notiService: NotiServiceService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosUsuarios();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodosLosUsuarios() {
    this.isLoading = true;
    this.authService.obtenerTodosLosUsuarios().subscribe(
      (response) => {
        this.isLoading = false;
        this.usuarios = response.reverse();
        this.usuariosFiltrados = [...this.usuarios];
        this.updatePagination();
      },
      (error) => {
        this.isLoading = false;
        this.notiService.showError('ERROR al cargar los usuarios');
      }
    );
  }

  // Función para obtener el rango de información
  getRangeInfo(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(
      this.currentPage * this.itemsPerPage,
      this.usuariosFiltrados.length
    );
    return `${start} - ${end} de ${this.usuariosFiltrados.length}`;
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.usuariosFiltrados.length / this.itemsPerPage
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
    this.usuariosFiltradosPaginados = this.usuariosFiltrados.slice(start, end);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  buscarUsuario(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor);

    if (valor === '') {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      this.usuariosFiltrados = this.usuarios.filter(
        (usuario) =>
          this.contieneTextoNormalizado(
            usuario.rol.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            usuario.nombreUsuario.toLowerCase(),
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

  ordenarUsuarios(campo: string) {
    if (this.ordenActual === campo) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = campo;
      this.orden = 'asc';
    }

    const factor = this.orden === 'asc' ? 1 : -1;
    this.usuariosFiltrados.sort((a, b) => {
      const aValue = this.obtenerValor(a, campo);
      const bValue = this.obtenerValor(b, campo);

      if (campo === 'fechaCreacion' || campo === 'fechaActualizacion') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return (dateA.getTime() - dateB.getTime()) * factor;
      }

      if (aValue < bValue) return -1 * factor;
      if (aValue > bValue) return 1 * factor;
      return 0;
    });
    this.updatePagination();
  }

  obtenerValor(obj: any, campo: string) {
    return campo.split('.').reduce((o, i) => o[i], obj);
  }

  notification(idUsuario: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar este usuario?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarUsuario(idUsuario);
        }
      });
  }

  eliminarUsuario(idUsuario: number) {
    this.authService.eliminarUsuario(idUsuario).subscribe(
      () => {
        this.obtenerTodosLosUsuarios();
        this.notificationService.showSuccess(
          'Usuario eliminado exitosamente',
          ''
        );
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(
          'ERROR al querer eliminar el usuario',
          ''
        );
      }
    );
  }

  editarUsuario(idUsuario: number): void {
    this.router.navigate(['/app-web/usuarios/usuarios-registro', idUsuario]);
  }

  generarReporte() {
    // Crear una nueva instancia de jsPDF con orientación horizontal
    const doc = new jsPDF('landscape');

    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Usuarios', 14, 15);

    // Obtener la fecha actual en formato dia-mes-año
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Mes es 0-indexado
    const anio = fechaActual.getFullYear();
    const fechaFormato = `${dia}/${mes}/${anio}`;

    // Añadir la fecha de generación del reporte
    doc.setFontSize(12);
    doc.text(`Generado el: ${fechaFormato}`, 14, 23);

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

    // Definir las columnas
    const columns = [
      { header: 'ID', dataKey: 'idUsuario' },
      { header: 'Nombre de Usuario', dataKey: 'nombreUsuario' },
      { header: 'Roles', dataKey: 'roles' },
      { header: 'Contraseña', dataKey: 'contrasena' },
      ...(this.isAdmin
        ? [
            { header: 'Fecha de Creación', dataKey: 'fechaCreacion' },
            { header: 'Fecha de Actualización', dataKey: 'fechaActualizacion' },
          ]
        : []),
    ];

    // Función para obtener la contraseña desencriptada (solo para propósitos de demostración)
    const obtenerContrasenaDesencriptada = (usuario: any) => {
      return usuario.contrasenaUncripted
        ? usuario.contrasenaUncripted
        : '*****';
    };

    // Función para obtener los roles como una cadena
    const obtenerRolesComoCadena = (roles: any[]) => {
      if (roles && roles.length > 0) {
        return roles.map((rol) => rol.rolNombre).join(', ');
      } else {
        return 'Sin rol';
      }
    };

    const usuariosOrdenados = [...this.usuarios].reverse();

    // Mapear los datos de los usuarios
    const rows = usuariosOrdenados.map((usuario) => ({
      idUsuario: usuario.idUsuario,
      nombreUsuario: usuario.nombreUsuario,
      roles: obtenerRolesComoCadena(usuario.roles),
      contrasena: obtenerContrasenaDesencriptada(usuario),
      ...(this.isAdmin
        ? {
            fechaCreacion: usuario.fechaCreacion
              ? formatFechaHora(new Date(usuario.fechaCreacion))
              : '',
            fechaActualizacion: usuario.fechaActualizacion
              ? formatFechaHora(new Date(usuario.fechaActualizacion))
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
    const nombreArchivo = `registro_usuarios_${dia}-${mes}-${anio}.pdf`;

    // Guardar el archivo PDF
    doc.save(nombreArchivo);
  }

  ocultarContrasena(contrasena: string): string {
    return contrasena.replace(/./g, '•');
  }

  alternarVisibilidadContrasenas() {
    this.contrasenasVisiblesPorFila = {};
  }

  alternarVisibilidadContrasenaFila(idUsuario: number) {
    if (this.contrasenasVisiblesPorFila[idUsuario] === undefined) {
      this.contrasenasVisiblesPorFila[idUsuario] = true;
    } else {
      this.contrasenasVisiblesPorFila[idUsuario] =
        !this.contrasenasVisiblesPorFila[idUsuario];
    }
  }
}
