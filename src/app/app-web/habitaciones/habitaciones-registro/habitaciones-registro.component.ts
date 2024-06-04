import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-habitaciones-registro',
  templateUrl: './habitaciones-registro.component.html',
  styleUrls: ['./habitaciones-registro.component.css']
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
        private toastr: ToastrService

    ) {
        this.formHabitacion = this.fb.group({
            habitacion: ['', Validators.required],
            cupo: ['', Validators.required],
            precioDia: ['', Validators.required],
            disponibilidad: ['', Validators.required]
        });

        this.id = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit(): void {
        this.esEditar();
    }

    esEditar() {
        if (this.id !== null) {
            this.titulo = 'Editar habitación';
            this.habitacionesService.buscarHabitacionId(this.id).subscribe(response => {
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
            response => {
                this.router.navigate(['/app-web/habitaciones/habitaciones-lista']);
                this.toastr.success('Habitación agregada exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-agregar' 
                });
            },
            error => {
                console.error(error);
                this.toastr.success('ERROR al agregar la habitación', '', {
                    enableHtml: true,
                    toastClass: 'toast-error' 
                });
            }
        );
    }

    editar(id: any): void {
        const habitacion = this.formHabitacion.value;
        this.habitacionesService.actualizarHabitacion(id, habitacion).subscribe(
            response => {
                this.router.navigate(['/app-web/habitaciones/habitaciones-lista']);
                this.toastr.success('Habitación editada exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-editar' 
                });
            },
            error => {
                console.error(error);
            }
        );
    }
}
