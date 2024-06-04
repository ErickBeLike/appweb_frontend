import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../services/clientes/clientes.service';
import { ReservacionesService } from '../../services/reservaciones/reservaciones.service';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservaciones-registro',
  templateUrl: './reservaciones-registro.component.html',
  styleUrls: ['./reservaciones-registro.component.css']
})
export class ReservacionesRegistroComponent implements OnInit {

    titulo = 'Agregar Reservación';
    formReservacion: FormGroup;
    id: any | null;
    clientes: any[] = [];
    habitaciones: any[] = [];

    constructor(
        private fb: FormBuilder,
        private clientesService: ClientesService,
        private reservacionesService: ReservacionesService,
        private habitacionesService: HabitacionesService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.formReservacion = this.fb.group({
            idCliente: ['', [Validators.required]],
            fechaInicio: ['', [Validators.required]],
            dias: ['', [Validators.required]],
            idHabitacion: ['', [Validators.required]],
        });

        this.id = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit(): void {
        this.obtenerClientes();
        this.obtenerHabitaciones();
        this.esEditar();
    }

    obtenerClientes() {
        this.clientesService.obtenerTodosLosClientes().subscribe(response => {
            this.clientes = response;
        });
    }

    obtenerHabitaciones() {
        this.habitacionesService.obtenerTodasLasHabitaciones().subscribe(response => {
            this.habitaciones = response;
        });
    }

    esEditar() {
        if (this.id !== null) {
            this.titulo = 'Editar Reservación';
            this.reservacionesService.buscarReservacionPorId(this.id).subscribe(response => {
                this.formReservacion.patchValue({
                    idCliente: response.idCliente.idCliente,
                    fechaInicio: response.fechaInicio,
                    dias: response.dias,
                    idHabitacion: response.idHabitacion.idHabitacion
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
        const reservacion = this.prepareSaveReservacion();
        this.reservacionesService.agregarReservacion(reservacion).subscribe(
            response => {
                this.router.navigate(['/app-web/reservaciones/reservaciones-lista']);
                this.toastr.success('Reservación agregada exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-agregar' 
                });
            },
            error => {
                console.error(error);
                this.toastr.success('ERROR al querer agregar la reservación', '', {
                    enableHtml: true,
                    toastClass: 'toast-error' 
                });
            }
        );
    }

    editar(id: any): void {
        const reservacion = this.prepareSaveReservacion();
        this.reservacionesService.actualizarReservacion(id, reservacion).subscribe(
            response => {
                this.router.navigate(['/app-web/reservaciones/reservaciones-lista']);
                this.toastr.success('Reservación editada exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-editar' 
                });
            },
            error => {
                console.error(error);
                this.toastr.success('ERROR al querer editar la reservación', '', {
                    enableHtml: true,
                    toastClass: 'toast-error' 
                });

            }
        );
    }

    prepareSaveReservacion() {
        const formModel = this.formReservacion.value;
        return {
            idCliente: formModel.idCliente,
            fechaInicio: formModel.fechaInicio,
            dias: formModel.dias,
            idHabitacion: formModel.idHabitacion
        };
    }
}
