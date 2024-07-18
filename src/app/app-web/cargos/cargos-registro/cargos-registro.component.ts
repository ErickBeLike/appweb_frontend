import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CargosService } from '../../services/cargos/cargos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cargos-registro',
  templateUrl: './cargos-registro.component.html',
  styleUrls: ['./cargos-registro.component.css']
})
export class CargosRegistroComponent {

    titulo = 'Agregar cargo';
    formCargo: FormGroup;
    id: any | null;
    showSmallElements: { [key: string]: boolean } = {};


    @ViewChild('smallElements') smallElements!: ElementRef[];

    constructor(
        private fb: FormBuilder,
        private cargosService: CargosService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.formCargo = this.fb.group({
            nombreCargo: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
            descripcionCargo: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
        });

        this.id = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit(): void {
        this.esEditar();
    }

    esEditar() {
        if (this.id !== null) {
            this.titulo = 'Editar cargo';
            this.cargosService.buscarCargoId(this.id).subscribe(response => {
                this.formCargo.patchValue(response);
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
        const cargo = this.formCargo.value;
        this.cargosService.agregarCargo(cargo).subscribe(
            response => {
                this.router.navigate(['/app-web/cargos/cargos-lista']);
                this.toastr.success('Cargo agregado exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-agregar'
                });

            },
            error => {
                console.error(error);
            }
        );
    }

    editar(id: any): void {
        const cargo = this.formCargo.value;
        this.cargosService.actualizarCargo(id, cargo).subscribe(
            response => {
                this.router.navigate(['/app-web/cargos/cargos-lista']);
                this.toastr.success('Cargo editado exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-editar'
                });
            },
            error => {
                console.error(error);
            }
        );
    }

    onInput(event: any) {
        const inputValue = event.target.value;
        const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); 
        this.formCargo.get('nombreCargo')?.setValue(newValue, { emitEvent: false });
    }

    onInputDescripcion(event: any) {
        const inputValue = event.target.value;
        const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); 
        this.formCargo.get('descripcionCargo')?.setValue(newValue, { emitEvent: false });
    }

    toggleSmallElementsVisibility(smallId: string, show: boolean) {
        this.showSmallElements[smallId] = show;
    }
}
