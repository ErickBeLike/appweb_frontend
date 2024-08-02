import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NuevoUsuario } from '../../models/nuevo-usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.css'],
})
export class UsuariosRegistroComponent implements OnInit {

    titulo = 'Agregar usuario';
    esEditar: boolean = false;
    id: any | null = null;

    showPassword: boolean = false;
    showSmallElements: { [key: string]: boolean } = {};
    esAdmin: boolean = false;
    nombreUsuario: string = '';
    contrasena: string = '';
    errMsj: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.esEditar = this.id !== null;
        if (this.esEditar) {
            this.titulo = 'Editar usuario';
            this.cargarUsuario(this.id); // Cargar datos del usuario
        }
    }

    onRegister(): void {
        const roles = this.esAdmin ? ['admin'] : ['user'];
        const nuevoUsuario = new NuevoUsuario(this.nombreUsuario, this.contrasena, roles);

        if (this.esEditar) {
            this.editar(this.id, nuevoUsuario);
        } else {
            this.agregar(nuevoUsuario);
        }
    }

    agregar(nuevoUsuario: NuevoUsuario): void {
        this.authService.nuevo(nuevoUsuario).subscribe(
            data => {
                this.toastr.success('Usuario agregado exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-agregar',
                });
                this.router.navigate(['/app-web/usuarios/usuarios-lista']);
            },
            err => {
                this.errMsj = err.error.mensaje;
                this.toastr.error('ERROR al querer agregar al usuario', '', {
                    enableHtml: true,
                    toastClass: 'toast-error',
                });
            }
        );
    }

    editar(id: any, nuevoUsuario: NuevoUsuario): void {
        this.authService.actualizarUsuario(id, nuevoUsuario).subscribe(
            data => {
                this.toastr.success('Usuario editado exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-editar',
                });
                this.router.navigate(['/app-web/usuarios/usuarios-lista']);
            },
            err => {
                this.errMsj = err.error.mensaje;
                this.toastr.error('ERROR al querer editar al usuario', '', {
                    enableHtml: true,
                    toastClass: 'toast-error',
                });
            }
        );
    }

    cargarUsuario(id: any): void {
        this.authService.obtenerUsuarioPorId(id).subscribe(
            data => {
                this.nombreUsuario = data.nombreUsuario;
                this.contrasena = data.contrasenaUncripted;
                // Verificar si el usuario tiene el rol de admin
                this.esAdmin = data.roles.some((rol: any) => rol.rolNombre === 'ROLE_ADMIN');
            },
            err => {
                this.toastr.error('ERROR al cargar los datos del usuario', '', {
                    enableHtml: true,
                    toastClass: 'toast-error',
                });
            }
        );
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    toggleSmallElementsVisibility(smallId: string, show: boolean) {
        this.showSmallElements[smallId] = show;
    }
}
