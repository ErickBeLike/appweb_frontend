import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos/productos.service';
import { ToastrService } from 'ngx-toastr';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-productos-registro',
  templateUrl: './productos-registro.component.html',
  styleUrls: ['./productos-registro.component.css'],
})
export class ProductosRegistroComponent implements OnInit {
  titulo = 'Agregar Producto';
  formProducto: FormGroup;
  id: any | null;

  showSmallElements: { [key: string]: boolean } = {};

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: NotiServiceService
  ) {
    this.formProducto = this.fb.group({
      nombreProducto: ['', Validators.required],
      precioProducto: ['', [Validators.required, this.precioValidator]],
      stock: ['', [Validators.required, this.stockValidator]]
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Producto';
      this.isLoading = true;
      this.productosService.buscarProductoId(this.id).subscribe(
        (response) => {
          this.isLoading = false;
          this.formProducto.patchValue(response);
        },
        (error) => {
          this.isLoading = false;
          this.notiService.showError('ERROR al cargar producto');
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
    const producto = this.formProducto.value;
    this.productosService.agregarProducto(producto).subscribe(
      (response) => {
        this.router.navigate(['/app-web/productos/productos-lista']);
        this.notiService.showSuccess('Producto agregado');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al agregar producto');
      }
    );
  }
  editar(id: any): void {
    const producto = this.formProducto.value;
    this.productosService.actualizarProducto(id, producto).subscribe(
      (response) => {
        this.router.navigate(['/app-web/productos/productos-lista']);
        this.notiService.showSuccess('Producto editado');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al editar producto');
      }
    );
  }

  toggleSmallElementsVisibility(elementId: string, show: boolean) {
    this.showSmallElements[elementId] = show;
  }

  precioValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regex = /^\d+(\.\d{1,2})?$/;
    if (value < 0 || !regex.test(value)) {
      return { invalidPrecio: true };
    }
    return null;
  }

  stockValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regex = /^\d+$/;
    if (value < 0 || !regex.test(value)) {
      return { invalidPrecio: true };
    }
    return null;
  }
}
