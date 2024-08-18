import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/authentication/token.service';
import { NotiServiceService } from '../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  nombreUsuario: string = '';
  roles: string[] = [];

  isLogged = false;
  isAdmin = false;
  
  isSidebarMinimized = true; // Nueva propiedad para manejar el estado del sidebar

  constructor(
    private tokenService: TokenService,
    private notiService: NotiServiceService
  ) {}

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.nombreUsuario = this.tokenService.getUserName() ?? '';
    } else {
      this.isLogged = false;
      this.nombreUsuario = '';
    }
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.notiService.showSuccess('Has cerrado sesión');
  }
}
