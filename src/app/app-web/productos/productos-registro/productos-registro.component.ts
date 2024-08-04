import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: NotiServiceService
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
      this.productosService.buscarProductoId(this.id).subscribe((response) => {
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
}
