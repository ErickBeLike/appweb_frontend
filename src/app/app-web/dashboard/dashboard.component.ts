import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/authentication/token.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent /*implements OnInit*/ {
  isLogged: boolean = false;

  constructor(private tokenService: TokenService) {}
  /*
  ngOnInit() {
    if(this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }
*/
}
