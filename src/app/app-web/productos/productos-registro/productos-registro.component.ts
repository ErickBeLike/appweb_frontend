import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos/productos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-productos-registro',
  templateUrl: './productos-registro.component.html',
  styleUrls: ['./productos-registro.component.css']
})
export class ProductosRegistroComponent implements OnInit {

    titulo = 'Agregar Producto';
    formProducto: FormGroup;
    id: any | null;

    constructor(
        private fb: FormBuilder,
        private productosService: ProductosService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.formProducto = this.fb.group({
            nombreProducto: ['', Validators.required],
            precioProducto: ['', Validators.required],
        });

        this.id = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit(): void {
        this.esEditar();
    }

    esEditar() {
        if (this.id !== null) {
            this.titulo = 'Editar Producto';
            this.productosService.buscarProductoId(this.id).subscribe(response => {
                this.formProducto.patchValue(response);
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
        const producto = this.formProducto.value;
        this.productosService.agregarProducto(producto).subscribe(
            response => {
                this.router.navigate(['/app-web/productos/productos-lista']);
                this.toastr.success('Prodducto agregado exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-agregar' 
                });
            },
            error => {
                console.error(error);
                this.toastr.success('ERROR al querer agregar el producto', '', {
                    enableHtml: true,
                    toastClass: 'toast-error' 
                });
            }
        );
    }
    editar(id: any): void {
        const producto = this.formProducto.value;
        this.productosService.actualizarProducto(id, producto).subscribe(
            response => {
                this.router.navigate(['/app-web/productos/productos-lista']);
                this.toastr.success('Producto editado exitosamente', '', {
                    enableHtml: true,
                    toastClass: 'toast-editar' 
                });
            },
            error => {
                console.error(error);
                this.toastr.success('ERROR al querer editar el producto', '', {
                    enableHtml: true,
                    toastClass: 'toast-error' 
                });
            }
        );
    }
}

