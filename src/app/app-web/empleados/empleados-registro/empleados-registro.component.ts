import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpleadosService } from '../../services/empleados/empleados.service';
import { CargosService } from '../../services/cargos/cargos.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-empleados-registro',
  templateUrl: './empleados-registro.component.html',
  styleUrls: ['./empleados-registro.component.css']
})
export class EmpleadosRegistroComponent implements OnInit {

  titulo = 'Agregar empleado';
  formEmpleado: FormGroup;
  id: any | null;
  empleados: any[] = [];
  cargos: any[] = [];
  sexos: string[] = ['HOMBRE', 'MUJER'];
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  horas: string[] = Array.from({length: 12}, (_, i) => (i + 1).toString());


  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService,
    private cargosService: CargosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formEmpleado = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellidoPaterno: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellidoMaterno: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/)]],
      idCargo: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, this.fechaDeNacimientoValidator()]],
      direccionEmpleado: ['', [Validators.required]],
      diasLaborales: this.fb.array([]),
      horarioEntradaHora: ['', [Validators.required]],
      horarioEntradaAMPM: ['AM', [Validators.required]]
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.obtenerEmpleados();
    this.obtenerCargos();
    this.esEditar();
  }

  obtenerEmpleados() {
    this.empleadosService.obtenerTodosLosEmpleados().subscribe(response => {
      this.empleados = response;
    });
  }

  obtenerCargos() {
    this.cargosService.obtenerTodosLosCargos().subscribe(response => {
      this.cargos = response;
    });
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Empleado';
      this.empleadosService.buscarEmpleadoId(this.id).subscribe(response => {
        setTimeout(() => {
          this.formEmpleado.patchValue(response);

          const cargoSeleccionado = this.cargos.find(cargo => cargo.idCargo === response.idCargo.idCargo);
          if (cargoSeleccionado) {
            this.formEmpleado.get('idCargo')?.setValue(cargoSeleccionado.idCargo);
          }
        }, 0);
      });
    }
  }

  agregarOEditar(): void {
    if (this.id === null) {
      this.agregar();
    } else {
      this.editar(this.id);
    }
    // Obtener el valor del horario de entrada y salida
    const horarioEntrada = this.formEmpleado.get('horarioEntrada')?.value;
    const horarioSalida = this.formEmpleado.get('horarioSalida')?.value;

    // Obtener el valor de AM/PM seleccionado
    const horarioEntradaAMPM = this.formEmpleado.get('horarioEntradaAMPM')?.value;
    const horarioSalidaAMPM = this.formEmpleado.get('horarioSalidaAMPM')?.value;

    // Concatenar AM/PM al horario
    const horarioEntradaCompleto = horarioEntrada + ' ' + horarioEntradaAMPM;
    const horarioSalidaCompleto = horarioSalida + ' ' + horarioSalidaAMPM;

    // Asignar los valores completos al formulario o realizar otras operaciones según sea necesario
    this.formEmpleado.get('horarioEntrada')?.setValue(horarioEntradaCompleto);
    this.formEmpleado.get('horarioSalida')?.setValue(horarioSalidaCompleto);

  }

  agregar(): void {
    const empleado = this.formEmpleado.value;
    empleado.persona = {
      nombre: this.formEmpleado.value.nombre,
      apellidoPaterno: this.formEmpleado.value.apellidoPaterno,
      apellidoMaterno: this.formEmpleado.value.apellidoMaterno,
      telefono: this.formEmpleado.value.telefono,
      correo: this.formEmpleado.value.correo
    };
    this.empleadosService.agregarEmpleado(empleado).subscribe(
      response => {
        this.router.navigate(['/app-web/empleados/empleados-lista']);
      },
      error => {
        console.error(error);
      }
    );
  }

  editar(id: any): void {
    const empleado = this.formEmpleado.value;
    empleado.persona = {
      nombre: this.formEmpleado.value.nombre,
      apellidoPaterno: this.formEmpleado.value.apellidoPaterno,
      apellidoMaterno: this.formEmpleado.value.apellidoMaterno,
      telefono: this.formEmpleado.value.telefono,
      correo: this.formEmpleado.value.correo
    };
    this.empleadosService.actualizarEmpleado(id, empleado).subscribe(
      response => {
        this.router.navigate(['/app-web-/empleados/empleados-lista']);
      },
      error => {
        console.error(error);
      }
    );
  }

  fechaDeNacimientoValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fechaNacimiento = new Date(control.value);
      const fechaActual = new Date();
      return fechaNacimiento >= fechaActual ? { fechaInvalida: true } : null;
    };
  }

  onCheckboxChange(event: any) {
    const diasLaborales = this.formEmpleado.get('diasLaborales');
    if (event.target.checked) {
      diasLaborales?.value.push(event.target.value);
    } else {
      const index = diasLaborales?.value.indexOf(event.target.value);
      if (index !== -1) {
        diasLaborales?.value.splice(index, 1);
      }
    }
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  }

  inTelefonoInput(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, '');

    // Limitar a 10 caracteres
    const limitedValue = newValue.slice(0, 10);

    // Aplicar formato de número de teléfono (000-000-0000)
    let formattedValue = '';
    for (let i = 0; i < limitedValue.length; i++) {
        if (i === 3 || i === 6) {
            formattedValue += '-';
        }
        formattedValue += limitedValue.charAt(i);
    }

    // Actualizar el valor del campo de teléfono en el formulario
    this.formEmpleado.get('telefono')?.setValue(formattedValue, { emitEvent: false });
}

}
