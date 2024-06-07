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
  empleadosFiltrados: any[] = [];
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
        this.empleadosFiltrados = [...this.empleados];
      },
      error => {
        console.error(error);
      }
    );
  }

  buscarEmpleado(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.empleadosFiltrados = this.empleados.filter(empleado => 
      empleado.persona.nombre.toLowerCase().includes(valor) ||
      empleado.persona.apellidoPaterno.toLowerCase().includes(valor) ||
      empleado.persona.apellidoMaterno.toLowerCase().includes(valor) ||
      empleado.persona.telefono.includes(valor) ||
      empleado.persona.correo.toLowerCase().includes(valor)
    );
  }

  ordenarEmpleados(campo: string, orden: string) {
    const factor = orden === 'asc' ? 1 : -1;
    this.empleadosFiltrados.sort((a, b) => {
      const aValue = this.obtenerValor(a, campo);
      const bValue = this.obtenerValor(b, campo);

      if (aValue < bValue) return -1 * factor;
      if (aValue > bValue) return 1 * factor;
      return 0;
    });
  }

  obtenerValor(obj: any, campo: string) {
    return campo.split('.').reduce((o, i) => o[i], obj);
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
