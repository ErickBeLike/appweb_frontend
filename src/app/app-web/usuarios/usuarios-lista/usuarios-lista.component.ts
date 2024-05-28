import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.css']
})
export class UsuariosListaComponent implements OnInit {

  usuarios: any[] = [];

  constructor(private usuariosService: UsuariosService) {}

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
      this.usuariosService.eliminarUsuario(idUsuario).subscribe(response => {
        this.obtenerTodosLosUsuarios();
      }, error => {
        console.error(error);
      });
    }
  }

  editarUsuario(id: number): void {
    // Implementa la lógica para editar un usuario
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }
}
