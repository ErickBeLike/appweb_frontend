import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados/empleados.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empleados-lista',
  templateUrl: './empleados-lista.component.html',
  styleUrls: ['./empleados-lista.component.css']
})
export class EmpleadosListaComponent implements OnInit {
  empleados: any[] = [];
  empleadoAEliminar: number | null = null;
  showDeleteModal: boolean = false;

  constructor(
    private empleadosService: EmpleadosService, 
    private router: Router,
    private toastr: ToastrService
  ) {}

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

  openDeleteModal(idEmpleado: number) {
    this.empleadoAEliminar = idEmpleado;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.empleadoAEliminar = null;
  }

  confirmarEliminarEmpleado() {
    if (this.empleadoAEliminar !== null) {
      this.empleadosService.eliminarEmpleado(this.empleadoAEliminar).subscribe(
        () => {
          this.obtenerTodosLosEmpleados();
          this.toastr.success('Empleado eliminado exitosamente', '', {
            enableHtml: true,
            toastClass: 'toast-eliminar'
          });
          this.closeDeleteModal();
        },
        error => {
          console.error(error);
          this.toastr.error('ERROR al eliminar al empleado', '', {
            enableHtml: true,
            toastClass: 'toast-error'
          });
          this.closeDeleteModal();
        }
      );
    }
  }

  editarEmpleado(idEmpleado: number) {
    this.router.navigate(['/app-web/empleados/empleados-registro', idEmpleado]);
  }

  generarReporte() {
    // Aquí va tu lógica para generar el reporte en PDF, similar a como lo tienes en el componente de clientes
  }
}
