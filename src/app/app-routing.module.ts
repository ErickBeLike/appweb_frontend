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
import { DashboardComponent } from './app-web/dashboard/dashboard.component';

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
  },

  //Clientes
  {
    path: 'app-web/clientes/clientes-lista',
    component: ClientesListaComponent,
  },
  {
    path: 'app-web/clientes/clientes-registro',
    component: ClientesRegistroComponent,
  },
  {
    path: 'app-web/clientes/clientes-registro/:id',
    component: ClientesRegistroComponent,
  },

  //Empleados
  {
    path: 'app-web/empleados/empleados-lista',
    component: EmpleadosListaComponent,
  },
  {
    path: 'app-web/empleados/empleados-registro',
    component: EmpleadosRegistroComponent,
  },
  {
    path: 'app-web/empleados/empleados-registro/:id',
    component: EmpleadosRegistroComponent,
  },

  //Usuarios
  {
    path: 'app-web/usuarios/usuarios-lista',
    component: UsuariosListaComponent,
  },
  {
    path: 'app-web/usuarios/usuarios-registro',
    component: UsuariosRegistroComponent,
  },
  {
    path: 'app-web/usuarios/usuarios-registro/:id',
    component: UsuariosRegistroComponent,
  },

  //Productos
  {
    path: 'app-web/productos/productos-lista',
    component: ProductosListaComponent,
  },
  {
    path: 'app-web/productos/productos-registro',
    component: ProductosRegistroComponent,
  },
  {
    path: 'app-web/productos/productos-registro/:id',
    component: ProductosRegistroComponent,
  },

  //Habitaciones
  {
    path: 'app-web/habitaciones/habitaciones-lista',
    component: HabitacionesListaComponent,
  },
  {
    path: 'app-web/habitaciones/habitaciones-registro',
    component: HabitacionesRegistroComponent,
  },
  {
    path: 'app-web/habitaciones/habitaciones-registro/:id',
    component: HabitacionesRegistroComponent,
  },

  //Ventas
  {
    path: 'app-web/ventas/ventas-lista',
    component: VentasListaComponent,
  },
  {
    path: 'app-web/ventas/ventas-registro',
    component: VentasRegistroComponent,
  },
  {
    path: 'app-web/ventas/ventas-registro/:id',
    component: VentasRegistroComponent,
  },

  //Reservaciones
  {
    path: 'app-web/reservaciones/reservaciones-lista',
    component: ReservacionesListaComponent,
  },
  {
    path: 'app-web/reservaciones/reservaciones-registro',
    component: ReservacionesRegistroComponent,
  },
  {
    path: 'app-web/reservaciones/reservaciones-registro/:id',
    component: ReservacionesRegistroComponent,
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
