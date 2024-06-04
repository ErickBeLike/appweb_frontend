import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nombreUsuario: string = '';
  contrasena: string = '';
  mensaje: string = '';
  showPassword: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit(): void {
    this.loginService.login({ nombreUsuario: this.nombreUsuario, contrasena: this.contrasena })
      .subscribe({
        next: response => {
          this.mensaje = response.mensaje;
          this.router.navigate(['/app-web/dashboard']);
        },
        error: err => {
          this.mensaje = 'Error al iniciar sesión';
          console.error('Error en el inicio de sesión', err);
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
