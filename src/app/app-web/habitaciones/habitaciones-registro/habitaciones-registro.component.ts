import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ToastrService } from 'ngx-toastr';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-habitaciones-registro',
  templateUrl: './habitaciones-registro.component.html',
  styleUrls: ['./habitaciones-registro.component.css'],
})
export class HabitacionesRegistroComponent {
  titulo = 'Agregar habitación';
  formHabitacion: FormGroup;
  id: any | null;
  isLoading = false;

  showSmallElements: { [key: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private habitacionesService: HabitacionesService,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: NotiServiceService
  ) {
    this.formHabitacion = this.fb.group({
      habitacion: ['', Validators.required],
      cupo: ['', [Validators.required, this.cupoValidator]],
      precioPorNoche: ['', [Validators.required, this.precioValidator]],
      depositoInicialNoche: ['', [Validators.required, this.precioValidator]],
      precioPorSemana: ['', [Validators.required, this.precioValidator]],
      depositoInicialSemana: ['', [Validators.required, this.precioValidator]],
      precioPorMes: ['', [Validators.required, this.precioValidator]],
      depositoInicialMes: ['', [Validators.required, this.precioValidator]],
      disponibilidad: ['DISPONIBLE', Validators.required],
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar habitación';
      this.isLoading = true;
      this.habitacionesService.buscarHabitacionId(this.id).subscribe(
        (response) => {
          this.isLoading = false;
          this.formHabitacion.patchValue(response);
        },
        (error) => {
          this.isLoading = false;
          this.notiService.showError('ERROR al cargar habitación');
        }
      );
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
    const habitacion = this.formHabitacion.value;
    this.habitacionesService.agregarHabitacion(habitacion).subscribe(
      (response) => {
        this.router.navigate(['/app-web/habitaciones/habitaciones-lista']);
        this.notiService.showSuccess('Habitación agregada');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al agregar habitación');
      }
    );
  }

  editar(id: any): void {
    const habitacion = this.formHabitacion.value;
    this.habitacionesService.actualizarHabitacion(id, habitacion).subscribe(
      (response) => {
        this.router.navigate(['/app-web/habitaciones/habitaciones-lista']);
        this.notiService.showSuccess('Habitación editada');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al editar habitación');
      }
    );
  }

  cupoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!Number.isInteger(value) || value < 0) {
      return { invalidCupo: true };
    }
    return null;
  }

  precioValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regex = /^\d+(\.\d{1,2})?$/;
    if (value < 0 || !regex.test(value)) {
      return { invalidPrecio: true };
    }
    return null;
  }

  toggleSmallElementsVisibility(elementId: string, show: boolean) {
    this.showSmallElements[elementId] = show;
  }
}
