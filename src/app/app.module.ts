import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientesListaComponent } from './app-web/clientes/clientes-lista/clientes-lista.component';
import { ClientesRegistroComponent } from './app-web/clientes/clientes-registro/clientes-registro.component';
import { EmpleadosListaComponent } from './app-web/empleados/empleados-lista/empleados-lista.component';
import { EmpleadosRegistroComponent } from './app-web/empleados/empleados-registro/empleados-registro.component';
import { UsuariosListaComponent } from './app-web/usuarios/usuarios-lista/usuarios-lista.component';
import { UsuariosRegistroComponent } from './app-web/usuarios/usuarios-registro/usuarios-registro.component';
import { ProductosListaComponent } from './app-web/productos/productos-lista/productos-lista.component';
import { ProductosRegistroComponent } from './app-web/productos/productos-registro/productos-registro.component';
import { HabitacionesListaComponent } from './app-web/habitaciones/habitaciones-lista/habitaciones-lista.component';
import { HabitacionesRegistroComponent } from './app-web/habitaciones/habitaciones-registro/habitaciones-registro.component';
import { VentasListaComponent } from './app-web/ventas/ventas-lista/ventas-lista.component';
import { VentasRegistroComponent } from './app-web/ventas/ventas-registro/ventas-registro.component';
import { ReservacionesListaComponent } from './app-web/reservaciones/reservaciones-lista/reservaciones-lista.component';
import { ReservacionesRegistroComponent } from './app-web/reservaciones/reservaciones-registro/reservaciones-registro.component';
import { CargosListaComponent } from './app-web/cargos/cargos-lista/cargos-lista.component';
import { CargosRegistroComponent } from './app-web/cargos/cargos-registro/cargos-registro.component';
import { LoginComponent } from './app-web/login/login.component';
import { DashboardComponent } from './app-web/dashboard/dashboard.component';
import { SidebarComponent } from './app-web/sidebar/sidebar.component';

import { CommonModule } from '@angular/common'; // Necesario para ngClass

import { InicioComponent } from './landing-page/inicio/inicio.component';
import { ServiciosComponent } from './landing-page/servicios/servicios.component';
import { ContactoComponent } from './landing-page/contacto/contacto.component';
import { NavBarComponent } from './landing-page/nav-bar/nav-bar.component';
import { FooterComponent } from './landing-page/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './landing-page/map/map.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { interceptorProvider } from './app-web/interceptors/prod-interceptor-service.service';

@NgModule({
  declarations: [
    AppComponent,
    ClientesListaComponent,
    ClientesRegistroComponent,
    EmpleadosListaComponent,
    EmpleadosRegistroComponent,
    UsuariosListaComponent,
    UsuariosRegistroComponent,
    ProductosListaComponent,
    ProductosRegistroComponent,
    HabitacionesListaComponent,
    HabitacionesRegistroComponent,
    VentasListaComponent,
    VentasRegistroComponent,
    ReservacionesListaComponent,
    ReservacionesRegistroComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,

    InicioComponent,
    ServiciosComponent,
    ContactoComponent,
    NavBarComponent,
    FooterComponent,
    MapComponent,
    CargosRegistroComponent,
    CargosListaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
    }),
  ],
  providers: [provideClientHydration(), interceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
