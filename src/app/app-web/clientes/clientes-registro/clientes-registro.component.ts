import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../services/clientes/clientes.service';
import { ToastrService } from 'ngx-toastr';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-clientes-registro',
  templateUrl: './clientes-registro.component.html',
  styleUrls: ['./clientes-registro.component.css'],
})
export class ClientesRegistroComponent {
  titulo = 'Agregar cliente';
  formCliente: FormGroup;
  id: any | null;
  showSmallElements: { [key: string]: boolean } = {};

  isLoading = false;

  @ViewChild('smallElements') smallElements!: ElementRef[];

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute,
    private notiService: NotiServiceService
  ) {
    this.formCliente = this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)],
      ],
      apellidoPaterno: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)],
      ],
      apellidoMaterno: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      correo: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/),
        ],
      ],
      telefono: ['', [Validators.required, Validators.minLength(12)]],
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar cliente';
      this.isLoading = true;
      this.clientesService.buscarClienteId(this.id).subscribe((response) => {
        this.isLoading = false;
        this.formCliente.patchValue(response.persona);
      },
    (error) => {
      this.isLoading = false;
      this.notiService.showError("ERROR al cargar cliente")
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
    this.isLoading = true;
    const cliente = { persona: this.formCliente.value };
    this.clientesService.agregarCliente(cliente).subscribe(
      (response) => {
        this.router.navigate(['/app-web/clientes/clientes-lista']);
        this.notiService.showSuccess('Cliente agregado');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al gregar cliente');
      }
    );
  }

  editar(id: any): void {
    const cliente = { persona: this.formCliente.value };
    this.clientesService.actualizarCliente(id, cliente).subscribe(
      (response) => {
        this.router.navigate(['/app-web/clientes/clientes-lista']);
        this.notiService.showSuccess('Cliente actualizado');
      },
      (error) => {
        console.error(error);
        this.notiService.showError('ERROR al actualizar cliente');
      }
    );
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.formCliente.get('nombre')?.setValue(newValue, { emitEvent: false });
  }

  onInputPa(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.formCliente
      .get('apellidoPaterno')
      ?.setValue(newValue, { emitEvent: false });
  }

  onInputMa(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.formCliente
      .get('apellidoMaterno')
      ?.setValue(newValue, { emitEvent: false });
  }

  inTelefonoInput(event: any) {
    const inputValue = event.target.value;
    const newValue = inputValue.replace(/[^0-9]/g, '');

    // Limitar a 10 caracteres
    const limitedValue = newValue.slice(0, 10);

    // Aplicar formato de número de teléfono (000-000-0000)
    let formattedValue = '';
    for (let i = 0; i < limitedValue.length; i++) {
      if (i === 3 || i === 6) {
        formattedValue += '-';
      }
      formattedValue += limitedValue.charAt(i);
    }

    this.formCliente
      .get('telefono')
      ?.setValue(formattedValue, { emitEvent: false });
  }

  toggleSmallElementsVisibility(smallId: string, show: boolean) {
    this.showSmallElements[smallId] = show;
  }
}
