import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.css']
})
export class UsuariosListaComponent implements OnInit {

  usuarios: any[] = [];
  contrasenasVisiblesPorFila: { [key: number]: boolean } = {};
  usuarioAEliminar: number | null = null;
  showDeleteModal: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosUsuarios();
  }

  obtenerTodosLosUsuarios() {
    this.usuariosService.obtenerTodosLosUsuarios().subscribe(response => {
      this.usuarios = response;
    }, error => {
      console.error(error);
    });
  }

  eliminarUsuario(idUsuario: number) {
    const confirmar = confirm(`¿Estás seguro de eliminar el usuario con ID ${idUsuario}?`);
    if (confirmar) {
      this.usuarioAEliminar = idUsuario;
      this.showDeleteModal = true;
    }
  }

  confirmarEliminarUsuario() {
    if (this.usuarioAEliminar !== null) {
      this.usuariosService.eliminarUsuario(this.usuarioAEliminar).subscribe(response => {
        this.obtenerTodosLosUsuarios();
        this.toastr.success('Usuario eliminado exitosamente', '', {
          enableHtml: true,
          toastClass: 'toast-eliminar' 
      });
      this.closeDeleteModal();
      }, error => {
        console.error(error);
        this.toastr.success('ERROR al querer eliminar el usuario', '', {
          enableHtml: true,
          toastClass: 'toast-error' 
      });
      this.closeDeleteModal();
      });
    }
  }

  editarUsuario(idUsuario: number): void {
    this.router.navigate(['/app-web/usuarios/usuarios-registro', idUsuario]);
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }

  ocultarContrasena(contrasena: string): string {
    return contrasena.replace(/./g, '*');
  }

  alternarVisibilidadContrasenas() {
    this.contrasenasVisiblesPorFila = {};
  }

  alternarVisibilidadContrasenaFila(idUsuario: number) {
    if (this.contrasenasVisiblesPorFila[idUsuario] === undefined) {
      this.contrasenasVisiblesPorFila[idUsuario] = true;
    } else {
      this.contrasenasVisiblesPorFila[idUsuario] = !this.contrasenasVisiblesPorFila[idUsuario];
    }
  }

  openDeleteModal(idUsuario: number) {
    this.usuarioAEliminar = idUsuario;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.usuarioAEliminar = null;
  }
}
