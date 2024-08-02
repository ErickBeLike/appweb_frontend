import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/authentication/token.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']  // Corregir typo 'styleUrl' a 'styleUrls'
})
export class SidebarComponent implements OnInit {

  nombreUsuario: string = '';
  roles: string[] = [];

  isLogged = false;
  isAdmin = false;

  constructor(
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    if(this.tokenService.getToken()) {
      this.isLogged = true;
      this.nombreUsuario = this.tokenService.getUserName() ?? '';  // Asignar cadena vacía si getUserName() devuelve null
    } else {
      this.isLogged = false;
      this.nombreUsuario = '';
    }
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }



  onLogOut(): void {
    this.tokenService.logOut();
  }

}
