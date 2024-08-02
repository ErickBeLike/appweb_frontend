import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './landing-page/inicio/inicio.component';
import { ServiciosComponent } from './landing-page/servicios/servicios.component';
import { ContactoComponent } from './landing-page/contacto/contacto.component';
import { LoginComponent } from './app-web/login/login.component';
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
import { DashboardComponent } from './app-web/dashboard/dashboard.component';
import { ProdGuardService as guard } from './app-web/guards/guard-service.service';

const routes: Routes = [

  //Ruta predeterminada
  {
    path: '',
    redirectTo: '/landing-page/inicio',
    pathMatch: 'full'
  },

  //Rutas de la Landing Page
  {
    path: 'landing-page/inicio',
    component: InicioComponent,
  },
  {
    path: 'landing-page/servicios',
    component: ServiciosComponent,
  },
  {
    path: 'landing-page/contacto',
    component: ContactoComponent,
  },

  //Rutas de la App Web
  //Login
  {
    path: 'app-web/login',
    component: LoginComponent,
  },

  //Dashboard
  {
    path: 'app-web/dashboard',
    component: DashboardComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },

  //Clientes
  {
    path: 'app-web/clientes/clientes-lista',
    component: ClientesListaComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'app-web/clientes/clientes-registro',
    component: ClientesRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'app-web/clientes/clientes-registro/:id',
    component: ClientesRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },

  //Empleados
  {
    path: 'app-web/empleados/empleados-lista',
    component: EmpleadosListaComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },
  {
    path: 'app-web/empleados/empleados-registro',
    component: EmpleadosRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },
  {
    path: 'app-web/empleados/empleados-registro/:id',
    component: EmpleadosRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },

  //Cargos
  {
    path: 'app-web/cargos/cargos-lista',
    component: CargosListaComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },
  {
    path: 'app-web/cargos/cargos-registro',
    component: CargosRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },
  {
    path: 'app-web/cargos/cargos-registro/:id',
    component: CargosRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },

  //Usuarios
  {
    path: 'app-web/usuarios/usuarios-lista',
    component: UsuariosListaComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },
  {
    path: 'app-web/usuarios/usuarios-registro',
    component: UsuariosRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },
  {
    path: 'app-web/usuarios/usuarios-registro/:id',
    component: UsuariosRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },

  //Productos
  {
    path: 'app-web/productos/productos-lista',
    component: ProductosListaComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'app-web/productos/productos-registro',
    component: ProductosRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },
  {
    path: 'app-web/productos/productos-registro/:id',
    component: ProductosRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },

  //Habitaciones
  {
    path: 'app-web/habitaciones/habitaciones-lista',
    component: HabitacionesListaComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'app-web/habitaciones/habitaciones-registro',
    component: HabitacionesRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },
  {
    path: 'app-web/habitaciones/habitaciones-registro/:id',
    component: HabitacionesRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin'] },
  },

  //Ventas
  {
    path: 'app-web/ventas/ventas-lista',
    component: VentasListaComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'app-web/ventas/ventas-registro',
    component: VentasRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'app-web/ventas/ventas-registro/:id',
    component: VentasRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },

  //Reservaciones
  {
    path: 'app-web/reservaciones/reservaciones-lista',
    component: ReservacionesListaComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'app-web/reservaciones/reservaciones-registro',
    component: ReservacionesRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },
  {
    path: 'app-web/reservaciones/reservaciones-registro/:id',
    component: ReservacionesRegistroComponent,
    canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
  },

  // Ruta de comodín para manejar rutas no encontradas
  {
    path: '**',
    redirectTo: '/landing-page/inicio'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
