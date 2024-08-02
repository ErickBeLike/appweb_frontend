import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../services/authentication/token.service';
import { AuthService } from '../services/authentication/auth.service';
import { LoginUsuario } from '../models/login-usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showPassword: boolean = false;

  loginUsuario!: LoginUsuario;
  nombreUsuario: string = '';
  contrasena: string ='';
  roles: string[] = [];

  errMsj: string = '';

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.contrasena);
    this.authService.login(this.loginUsuario).subscribe(
      data => {
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.router.navigate(['/app-web/dashboard']);
        this.toastr.success('Inicio de sesión exitoso', '', {
          enableHtml: true,
          toastClass: 'toast-agregar'
      });
      },
      err => {
        this.errMsj = "Credenciales erróneas";
        this.toastr.error('ERROR al querer iniciar sesión', '', {
          enableHtml: true,
          toastClass: 'toast-error'
        });
      }
    );
  }



  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

 

}