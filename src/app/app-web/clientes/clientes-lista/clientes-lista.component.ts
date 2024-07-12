import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes/clientes.service';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode'; // Importa la función unidecode

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  clienteAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idCliente'; // Columna de orden predeterminada
  orden: string = 'asc'; // Dirección de orden predeterminada

  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosClientes();
  }

  obtenerTodosLosClientes() {
    this.clientesService.obtenerTodosLosClientes().subscribe(
      (response: any[]) => {
        this.clientes = response;
        this.clientesFiltrados = [...this.clientes];
      },
      error => {
        console.error(error);
      }
    );
  }

  buscarCliente(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor); // Normaliza el texto de búsqueda

    if (valor === '') {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clientes.filter(cliente =>
        this.contieneTextoNormalizado(cliente.persona.nombre.toLowerCase(), valorNormalizado) ||
        this.contieneTextoNormalizado(cliente.persona.apellidoPaterno.toLowerCase(), valorNormalizado) ||
        this.contieneTextoNormalizado(cliente.persona.apellidoMaterno.toLowerCase(), valorNormalizado) ||
        this.contieneTextoNormalizado(cliente.persona.telefono.toString(), valorNormalizado) ||
        this.contieneTextoNormalizado(cliente.persona.correo.toLowerCase(), valorNormalizado)
      );
    }
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto); // Normaliza el texto de la tabla
    return textoNormalizado.includes(valorNormalizado);
  }

  ordenarClientes(campo: string) {
    if (this.ordenActual === campo) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = campo;
      this.orden = 'asc';
    }

    const factor = this.orden === 'asc' ? 1 : -1;
    this.clientesFiltrados.sort((a, b) => {
      const aValue = this.obtenerValor(a, campo);
      const bValue = this.obtenerValor(b, campo);

      if (aValue < bValue) return -1 * factor;
      if (aValue > bValue) return 1 * factor;
      return 0;
    });
  }

  obtenerValor(obj: any, campo: string) {
    return campo.split('.').reduce((o, i) => o[i], obj);
  }

  openDeleteModal(idCliente: number) {
    this.clienteAEliminar = idCliente;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.clienteAEliminar = null;
  }

  confirmarEliminarCliente() {
    if (this.clienteAEliminar !== null) {
      this.clientesService.eliminarCliente(this.clienteAEliminar).subscribe(
        () => {
          this.obtenerTodosLosClientes();
          this.toastr.success('Cliente eliminado exitosamente', '', {
            enableHtml: true,
            toastClass: 'toast-eliminar'
          });
          this.closeDeleteModal();
        },
        error => {
          console.error(error);
          this.toastr.error('ERROR al querer eliminar al cliente', '', {
            enableHtml: true,
            toastClass: 'toast-error'
          });
          this.closeDeleteModal();
        }
      );
    }
  }

  editarCliente(idCliente: number) {
    this.router.navigate(['/app-web/clientes/clientes-registro', idCliente]);
  }

  generarReporte() {
    // Lógica para generar reporte PDF (puedes utilizar la implementación que ya tienes) o una acción distinta
  }
}
