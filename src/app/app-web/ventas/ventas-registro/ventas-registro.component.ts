import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VentasService } from '../../services/ventas/ventas.service';
import { ProductosService } from '../../services/productos/productos.service';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-ventas-registro',
  templateUrl: './ventas-registro.component.html',
  styleUrls: ['./ventas-registro.component.css'],
})
export class VentasRegistroComponent implements OnInit {
  titulo = 'Agregar venta';
  formVenta: FormGroup;
  productos: any[] = [];
  productosVenta: any[] = [];
  showModal: boolean = false;
  idVenta: any;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private ventasService: VentasService,
    private productosService: ProductosService,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: NotiServiceService,
    private notificationService: NotificationService // Agregado para SweetAlert2
  ) {
    this.formVenta = this.fb.group({
      productos: this.fb.array([], Validators.required),
    });

    this.idVenta = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
    this.obtenerProductos();
  }

  esEditar() {
    if (this.idVenta !== null) {
      this.titulo = 'Editar venta';
      this.cargarVenta(this.idVenta);
    }
  }

  cargarVenta(idVenta: any): void {
    this.isLoading = true;
    this.ventasService.buscarVentaId(idVenta).subscribe(
      (response: any) => {
        if (response) {
          this.isLoading = false;
          this.formVenta.patchValue({});
          this.productosVenta = [];

          for (const detalle of response.detallesVenta) {
            const producto = {
              idProducto: detalle.producto.idProducto,
              nombreProducto: detalle.producto.nombreProducto,
              cantidad: detalle.cantidad,
            };
            this.productosVenta.push(producto);
            const control = this.formVenta.get('productos') as FormArray;
            control.push(
              this.fb.group({
                idProducto: [producto.idProducto, Validators.required],
                cantidad: [
                  producto.cantidad,
                  [Validators.required, Validators.min(1)],
                ],
              })
            );
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.notiService.showError('ERROR al cargar venta');
      }
    );
  }

  obtenerProductos() {
    this.productosService.obtenerTodosLosProductos().subscribe((response) => {
      this.productos = response;
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  agregarProducto(producto: any) {
    const idProducto = Number(producto.idProducto);
    this.productosVenta.push({ ...producto, idProducto });
    const control = this.formVenta.get('productos') as FormArray;
    control.push(
      this.fb.group({
        idProducto: [idProducto, Validators.required],
        cantidad: [1, [Validators.required, Validators.min(1)]],
      })
    );
    this.closeModal();
  }

  eliminarProducto(index: number) {
    this.productosVenta.splice(index, 1);
    const control = this.formVenta.get('productos') as FormArray;
    control.removeAt(index);
  }

  agregarOEditar(): void {
    const productos = this.formVenta.value.productos.map((producto: any) => ({
      ...producto,
      idProducto: Number(producto.idProducto),
    }));

    const venta = {
      productos: productos,
    };

    if (this.idVenta) {
      this.editarVenta(this.idVenta, venta);
    } else {
      this.agregarVenta(venta);
    }
  }

  agregarVenta(venta: any): void {
    this.ventasService.agregarVenta(venta).subscribe(
      (response) => {
        this.router.navigate(['/app-web/ventas/ventas-lista']);
        this.notiService.showSuccess('Venta agregada');
      },
      (error) => {
        this.notiService.showError('ERROR al agregar venta');
      }
    );
  }

  editarVenta(idVenta: any, venta: any): void {
    this.ventasService.actualizarVenta(idVenta, venta).subscribe(
      (response) => {
        this.router.navigate(['/app-web/ventas/ventas-lista']);
        this.notiService.showSuccess('Venta editada');
      },
      (error) => {
        this.notiService.showError('ERROR al editar venta');
      }
    );
  }

  getControl(index: number): FormControl {
    const control = (this.formVenta.get('productos') as FormArray).controls[
      index
    ].get('cantidad') as FormControl;
    return control;
  }
}
