import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados/empleados.service';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode'; // Nota: utiliza 'unidecode' en lugar de '{ unidecode }'


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
  ordenActual: string = 'idEmpleado'; // Columna de orden predeterminada
  orden: string = 'asc'; // Dirección de orden predeterminada

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
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor); // Normaliza el texto de búsqueda

    if (valor === '') {
      this.empleadosFiltrados = [...this.empleados];
    } else {
      this.empleadosFiltrados = this.empleados.filter(empleado => 
        this.contieneTextoNormalizado(empleado.idEmpleado.toString(), valorNormalizado) ||
        this.contieneTextoNormalizado(empleado.persona.nombre.toLowerCase(), valorNormalizado) ||
        this.contieneTextoNormalizado(empleado.idCargo.nombreCargo.toLowerCase(), valorNormalizado) ||
        this.contieneTextoNormalizado(empleado.fechaNacimiento.toString(), valorNormalizado) ||
        this.contieneTextoNormalizado(empleado.sexo.toLowerCase(), valorNormalizado) ||
        this.contieneTextoNormalizado(empleado.persona.correo.toLowerCase(), valorNormalizado) ||
        this.contieneTextoNormalizado(empleado.persona.telefono.toString(), valorNormalizado) ||
        this.contieneTextoNormalizado(empleado.direccionEmpleado.toLowerCase(), valorNormalizado) ||
        empleado.diasLaborales.some((dia: string) => this.contieneTextoNormalizado(dia.toLowerCase(), valorNormalizado))
      );
    }
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto); // Normaliza el texto de la tabla
    return textoNormalizado.includes(valorNormalizado);
  }

  ordenarEmpleados(columna: string) {
    if (columna === this.ordenActual) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = columna;
      this.orden = 'asc';
    }

    this.empleadosFiltrados.sort((a, b) => {
      const valorA = this.obtenerValorParaOrden(a, columna);
      const valorB = this.obtenerValorParaOrden(b, columna);

      if (valorA > valorB) {
        return this.orden === 'asc' ? 1 : -1;
      } else if (valorA < valorB) {
        return this.orden === 'asc' ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  obtenerValorParaOrden(obj: any, campo: string) {
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
