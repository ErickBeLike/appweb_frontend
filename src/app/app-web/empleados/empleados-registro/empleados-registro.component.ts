import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpleadosService } from '../../services/empleados/empleados.service';
import { CargosService } from '../../services/cargos/cargos.service';
import { ToastrService } from 'ngx-toastr';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-empleados-registro',
  templateUrl: './empleados-registro.component.html',
  styleUrls: ['./empleados-registro.component.css'],
})
export class EmpleadosRegistroComponent implements OnInit {
  titulo = 'Agregar empleado';
  formEmpleado: FormGroup;
  id: any | null;
  botonGuardar: boolean = true;
  empleados: any[] = [];
  cargos: any[] = [];
  sexos: string[] = ['HOMBRE', 'MUJER'];
  showSmallElements: { [key: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private empleadosService: EmpleadosService,
    private cargosService: CargosService,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: NotiServiceService
  ) {
    this.formEmpleado = this.fb.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
          ],
        ],
        apellidoPaterno: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
          ],
        ],
        apellidoMaterno: [
          '',
          [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)],
        ],
        idCargo: ['', [Validators.required]],
        fechaNacimiento: [
          '',
          [Validators.required, this.fechaDeNacimientoValidator()],
        ],
        sexo: ['', [Validators.required]],
        correo: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/),
          ],
        ],
        telefono: ['', [Validators.required, Validators.minLength(12)]],
        direccionEmpleado: ['', [Validators.required]],
        LUNES: [false],
        MARTES: [false],
        MIERCOLES: [false],
        JUEVES: [false],
        VIERNES: [false],
        SABADO: [false],
        DOMINGO: [false],
        horarioEntradaHora: [
          '',
          [
            Validators.required,
            Validators.pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
          ],
        ],
        horarioEntradaAMPM: ['AM', [Validators.required]],
        horarioSalidaHora: [
          '',
          [
            Validators.required,
            Validators.pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
          ],
        ],
        horarioSalidaAMPM: ['PM', [Validators.required]],
      },
      { validators: atLeastOneDayValidator }
    );

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngAfterViewInit(): void {
    this.esEditar();
  }

  ngOnInit(): void {
    this.obtenerEmpleados();
    this.obtenerCargos();
    this.esEditar();
  }

  obtenerEmpleados() {
    this.empleadosService.obtenerTodosLosEmpleados().subscribe((response) => {
      this.empleados = response;
    });
  }

  obtenerCargos() {
    this.cargosService.obtenerTodosLosCargos().subscribe((response) => {
      this.cargos = response;
    });
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Empleado';
      this.empleadosService.buscarEmpleadoId(this.id).subscribe((response) => {
        this.formEmpleado.patchValue({
          nombre: response.persona.nombre,
          apellidoPaterno: response.persona.apellidoPaterno,
          apellidoMaterno: response.persona.apellidoMaterno,
          correo: response.persona.correo,
          telefono: response.persona.telefono,
          direccionEmpleado: response.direccionEmpleado,
          fechaNacimiento: response.fechaNacimiento,
          sexo: response.sexo,
          horarioEntradaHora: response.horarioEntrada.split(' ')[0], // Separar hora y AM/PM
          horarioEntradaAMPM: response.horarioEntrada.split(' ')[1],
          horarioSalidaHora: response.horarioSalida.split(' ')[0], // Separar hora y AM/PM
          horarioSalidaAMPM: response.horarioSalida.split(' ')[1],
        });

        // Cargar cargo
        this.formEmpleado.get('idCargo')?.setValue(response.idCargo.idCargo);

        // Marcar los días laborales seleccionados
        const diasLaboralesControl = this.formEmpleado.controls;
        response.diasLaborales.forEach((dia: string) => {
          diasLaboralesControl[dia]?.setValue(true);
        });
      });
    }
  }

  agregarOEditar(): void {
    if (this.id === null) {
      this.agregar();
    } else {
      this.editar(this.id);
    }
  }

  agregar(): void {
    const empleado = this.prepareSaveEmpleado();
    this.empleadosService.agregarEmpleado(empleado).subscribe(
      (response) => {
        this.router.navigate(['/app-web/empleados/empleados-lista']);
        this.notiService.showSuccess('Empleado agregado');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al agregar empleado');
      }
    );
  }

  editar(id: any): void {
    const empleado = this.prepareSaveEmpleado();
    this.empleadosService.actualizarEmpleado(id, empleado).subscribe(
      (response) => {
        this.router.navigate(['/app-web/empleados/empleados-lista']);
        this.notiService.showSuccess('Empleado editado');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al editar empleado');
      }
    );
  }

  prepareSaveEmpleado() {
    const formModel = this.formEmpleado.value;
    const diasLaborales = Object.keys(formModel).filter(
      (key) =>
        key !== 'nombre' &&
        key !== 'apellidoPaterno' &&
        key !== 'apellidoMaterno' &&
        key !== 'idCargo' &&
        key !== 'fechaNacimiento' &&
        key !== 'sexo' &&
        key !== 'correo' &&
        key !== 'telefono' &&
        key !== 'direccionEmpleado' &&
        key !== 'horarioEntradaHora' &&
        key !== 'horarioEntradaAMPM' &&
        key !== 'horarioSalidaHora' &&
        key !== 'horarioSalidaAMPM' &&
        formModel[key]
    );

    const persona = {
      nombre: formModel.nombre,
      apellidoPaterno: formModel.apellidoPaterno,
      apellidoMaterno: formModel.apellidoMaterno,
      telefono: formModel.telefono,
      correo: formModel.correo,
    };

    return {
      persona: persona,
      sexo: formModel.sexo,
      idCargo: formModel.idCargo,
      fechaNacimiento: formModel.fechaNacimiento,
      direccionEmpleado: formModel.direccionEmpleado,
      diasLaborales: diasLaborales,
      horarioEntrada:
        formModel.horarioEntradaHora + ' ' + formModel.horarioEntradaAMPM,
      horarioSalida:
        formModel.horarioSalidaHora + ' ' + formModel.horarioSalidaAMPM,
    };
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.formEmpleado.get('nombre')?.setValue(newValue, { emitEvent: false });
  }

  onInputPa(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.formEmpleado
      .get('apellidoPaterno')
      ?.setValue(newValue, { emitEvent: false });
  }

  onInputMa(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.formEmpleado
      .get('apellidoMaterno')
      ?.setValue(newValue, { emitEvent: false });
  }

  inTelefonoInput(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, '');
    const limitedValue = newValue.slice(0, 10);
    let formattedValue = '';
    for (let i = 0; i < limitedValue.length; i++) {
      if (i === 3 || i === 6) {
        formattedValue += '-';
      }
      formattedValue += limitedValue.charAt(i);
    }
    this.formEmpleado
      .get('telefono')
      ?.setValue(formattedValue, { emitEvent: false });
  }

  onDiasLaboralesChange(dia: string) {
    const control = this.formEmpleado.get('diasLaborales')?.get(dia);
    if (control) {
      control.setValue(!control.value);
    }
  }

  fechaDeNacimientoValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fechaDeNacimiento = control.value;
      if (fechaDeNacimiento) {
        const fecha = new Date(fechaDeNacimiento);
        const limiteInferior = new Date('1964-01-01');
        const limiteSuperior = new Date('2006-12-31');
        if (
          isNaN(fecha.getTime()) ||
          fecha < limiteInferior ||
          fecha > limiteSuperior
        ) {
          return { fechaInvalida: true };
        }
      }
      return null;
    };
  }

  formatearHorario(event: any): void {
    const input = event.target;
    let valor = input.value.replace(/[^0-9]/g, '');

    if (valor.length >= 1 && valor.length <= 2) {
      if (valor.length === 1 && valor !== '0' && valor !== '1') {
        valor = '0' + valor;
      }
      if (
        valor.length === 2 &&
        valor.charAt(0) === '2' &&
        parseInt(valor.charAt(1), 10) > 3
      ) {
        valor = '0' + valor.charAt(1);
      }
      if (valor.length === 2 && parseInt(valor.charAt(0), 10) > 2) {
        valor = '0' + valor.charAt(0);
      }
    }

    if (valor.length > 2) {
      valor = valor.substring(0, 2) + ':' + valor.substring(2, 4);
    }

    input.value = valor;
  }

  toggleSmallElementsVisibility(elementId: string, show: boolean) {
    this.showSmallElements[elementId] = show;
  }
}

function atLeastOneDayValidator(
  formGroup: FormGroup
): { [key: string]: boolean } | null {
  const days = [
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO',
  ];
  const atLeastOneSelected = days.some((day) => formGroup.get(day)?.value);
  return atLeastOneSelected ? null : { atLeastOneDayRequired: true };
}
