import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private habitacionesService: HabitacionesService,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: NotiServiceService
  ) {
    this.formHabitacion = this.fb.group({
      habitacion: ['', Validators.required],
      cupo: ['0', Validators.required],
      precioPorNoche: ['0', Validators.required],
      depositoInicialNoche: ['0', Validators.required],
      precioPorSemana: ['0', Validators.required],
      depositoInicialSemana: ['0', Validators.required],
      precioPorMes: ['0', Validators.required],
      depositoInicialMes: ['0', Validators.required],
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
      this.habitacionesService
        .buscarHabitacionId(this.id)
        .subscribe((response) => {
          this.formHabitacion.patchValue(response);
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
}
