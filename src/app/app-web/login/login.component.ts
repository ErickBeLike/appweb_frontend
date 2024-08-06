import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/authentication/token.service';
import { AuthService } from '../services/authentication/auth.service';
import { LoginUsuario } from '../models/login-usuario';
import 'notyf/notyf.min.css'; // Importa los estilos
import { NotiServiceService } from '../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;

  loginUsuario!: LoginUsuario;
  nombreUsuario: string = '';
  contrasena: string = '';
  roles: string[] = [];

  errMsj: string = '';

  isLoading = false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private notiService: NotiServiceService
  ) {}

  ngOnInit() {}

  onLogin(): void {
    this.isLoading = true;
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.contrasena);
    this.authService.login(this.loginUsuario).subscribe(
      (data) => {
        this.isLoading = false;
        this.tokenService.setToken(data.token);
        this.router.navigate(['/app-web/dashboard']);
        this.notiService.showSuccess('Inicio de sesión exitoso');
      },
      (err) => {
        this.isLoading = false;
        this.errMsj = 'Credenciales erróneas';
        this.notiService.showError('ERROR al iniciar sesión');
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
