import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';
import { TokenService } from '../../services/authentication/token.service';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.css'],
})
export class UsuariosListaComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  contrasenasVisiblesPorFila: { [key: number]: boolean } = {};
  usuarioAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idUsuario';
  orden: string = 'asc';

  isLogged = false;
  isAdmin = false;

  constructor(
    private authService: AuthService, // Usa el AuthService para las operaciones de usuario
    private router: Router,
    private notificationService: NotificationService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosUsuarios();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodosLosUsuarios() {
    this.authService.obtenerTodosLosUsuarios().subscribe(
      (response) => {
        this.usuarios = response;
        this.usuariosFiltrados = [...this.usuarios];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  buscarUsuario(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor); // Normaliza el texto de búsqueda

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
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto); // Normaliza el texto de la tabla
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

      if (aValue < bValue) return -1 * factor;
      if (aValue > bValue) return 1 * factor;
      return 0;
    });
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
    // Implementa la lógica para generar un reporte en PDF
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
