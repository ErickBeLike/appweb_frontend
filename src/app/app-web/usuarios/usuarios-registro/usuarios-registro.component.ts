import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios-registro',
  templateUrl: './usuarios-registro.component.html',
  styleUrls: ['./usuarios-registro.component.css']
})
export class UsuariosRegistroComponent implements OnInit {

    titulo = 'Agregar usuario';
    formUsuario: FormGroup;
    id: any | null;
    passwordVisible: boolean = false;
    roles: string[] = ['USER', 'ADMIN'];
    showSmallElements: { [key: string]: boolean } = {};

    constructor(
        private fb: FormBuilder,
        private usuariosService: UsuariosService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.formUsuario = this.fb.group({
            rol: ['', [Validators.required]],
            nombreUsuario: ['', [Validators.required]],
            contrasenaUsuario: ['', [Validators.required, Validators.minLength(8)]],
        });

        this.id = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit(): void {
        this.esEditar();
    }

    esEditar() {
        if (this.id !== null) {
            this.titulo = 'Editar usuario';
            this.usuariosService.buscarUsuarioId(this.id).subscribe(response => {
                this.formUsuario.patchValue(response);
            });
        }
    }

    agregarOEditar(): void {
        if (this.id === null) {
            this.agregar();
        } else {
            this.editar(this.id);
        }
    }

    agregar(): void {
        const usuario = this.formUsuario.value;
        this.usuariosService.agregarUsuario(usuario).subscribe(
            response => {
                this.router.navigate(['/app-web/usuarios/usuarios-lista']);
                this.toastr.success('Usuario agregado exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-agregar' 
                });
            },
            error => {
                console.error(error);
                this.toastr.success('ERROR al querer agregar el usuario', '', {
                    enableHtml: true,
                    toastClass: 'toast-error' 
                });
            }
        );
    }

    editar(id: any): void {
        const usuario = this.formUsuario.value;
        this.usuariosService.actualizarUsuario(id, usuario).subscribe(
            response => {
                this.router.navigate(['/app-web/usuarios/usuarios-lista']);
                this.toastr.success('Usuario editado exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-editar' 
                });
            },
            error => {
                console.error(error);
                this.toastr.success('ERROR al querer editar el usuario', '', {
                    enableHtml: true,
                    toastClass: 'toast-error' 
                });
            }
        );
    }

    togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }

    toggleSmallElementsVisibility(smallId: string, show: boolean) {
        this.showSmallElements[smallId] = show;
    }
}
