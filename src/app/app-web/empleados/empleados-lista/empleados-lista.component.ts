import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados/empleados.service';

@Component({
  selector: 'app-empleados-lista',
  templateUrl: './empleados-lista.component.html',
  styleUrls: ['./empleados-lista.component.css']
})
export class EmpleadosListaComponent implements OnInit {
  empleados: any[] = [];

  constructor(private empleadosService: EmpleadosService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerTodosLosEmpleados();
  }

  obtenerTodosLosEmpleados() {
    this.empleadosService.obtenerTodosLosEmpleados().subscribe(
      (response: any[]) => {
        this.empleados = response;
      },
      error => {
        console.error(error);
      }
    );
  }

  eliminarEmpleado(idEmpleado: number) {
    const confirmar = confirm(`¿Estás seguro de eliminar el empleado con ID ${idEmpleado}?`);
    if (confirmar) {
      this.empleadosService.eliminarEmpleado(idEmpleado).subscribe(
        () => {
          this.obtenerTodosLosEmpleados();
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  editarEmpleado(idEmpleado: number) {
    this.router.navigate(['/empleados/registro-empleados', idEmpleado]);
  }

  generarReporte() {
    // Aquí va tu lógica para generar el reporte en PDF, similar a como lo tienes en el componente de clientes
  }
}
