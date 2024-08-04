import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados/empleados.service';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';

@Component({
  selector: 'app-empleados-lista',
  templateUrl: './empleados-lista.component.html',
  styleUrls: ['./empleados-lista.component.css'],
})
export class EmpleadosListaComponent implements OnInit {
  empleados: any[] = [];
  empleadosFiltrados: any[] = [];
  empleadoAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idEmpleado';
  orden: string = 'asc';

  constructor(
    private empleadosService: EmpleadosService,
    private router: Router,
    private notificationService: NotificationService
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
      (error) => {
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
      this.empleadosFiltrados = this.empleados.filter(
        (empleado) =>
          this.contieneTextoNormalizado(
            empleado.idEmpleado.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.persona.nombre.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.idCargo.nombreCargo.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.fechaNacimiento.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.sexo.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.persona.correo.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.persona.telefono.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            empleado.direccionEmpleado.toLowerCase(),
            valorNormalizado
          ) ||
          empleado.diasLaborales.some((dia: string) =>
            this.contieneTextoNormalizado(dia.toLowerCase(), valorNormalizado)
          )
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

  notification(idEmpleaddo: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar este empleado?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarEmpleado(idEmpleaddo);
        }
      });
  }

  eliminarEmpleado(idEmpleado: number) {
    this.empleadosService.eliminarEmpleado(idEmpleado).subscribe(
      () => {
        this.obtenerTodosLosEmpleados();
        this.notificationService.showSuccess(
          'Empleado eliminado exitosamente',
          ''
        );
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(
          'ERROR al querer eliminar al empleado',
          ''
        );
      }
    );
  }

  editarEmpleado(idEmpleado: number) {
    this.router.navigate(['/app-web/empleados/empleados-registro', idEmpleado]);
  }

  generarReporte() {
    // Aquí va tu lógica para generar el reporte en PDF, similar a como lo tienes en el componente de clientes
  }
}
