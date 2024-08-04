import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes/clientes.service';
import { NotificationService } from '../../services/notification/sweetalert2/notification.service'; // Importa tu servicio
import unidecode from 'unidecode'; // Importa la función unidecode
import { TokenService } from '../../services/authentication/token.service';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css'],
})
export class ClientesListaComponent implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  clienteAEliminar: number | null = null;
  ordenActual: string = 'idCliente'; // Columna de orden predeterminada
  orden: string = 'asc'; // Dirección de orden predeterminada

  isLogged = false;
  isAdmin = false;

  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private notificationService: NotificationService, // Inyecta el servicio de notificaciones
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosClientes();
    this.isLogged = this.tokenService.isLogged();
    this.isAdmin = this.tokenService.isAdmin();
  }

  obtenerTodosLosClientes() {
    this.clientesService.obtenerTodosLosClientes().subscribe(
      (response: any[]) => {
        this.clientes = response;
        this.clientesFiltrados = [...this.clientes];
      },
      (error) => {
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
      this.clientesFiltrados = this.clientes.filter(
        (cliente) =>
          this.contieneTextoNormalizado(
            cliente.persona.nombre.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            cliente.persona.apellidoPaterno.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            cliente.persona.apellidoMaterno.toLowerCase(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            cliente.persona.telefono.toString(),
            valorNormalizado
          ) ||
          this.contieneTextoNormalizado(
            cliente.persona.correo.toLowerCase(),
            valorNormalizado
          )
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

  notification(idCliente: number) {
    this.notificationService
      .showConfirmation(
        'Confirmar Eliminación',
        '¿Estás seguro de que deseas eliminar este cliente?'
      )
      .then((confirmed) => {
        if (confirmed) {
          this.eliminarCliente(idCliente);
        }
      });
  }

  eliminarCliente(idCliente: number) {
    this.clientesService.eliminarCliente(idCliente).subscribe(
      () => {
        this.obtenerTodosLosClientes();
        this.notificationService.showSuccess(
          'Cliente eliminado exitosamente',
          ''
        );
      },
      (error) => {
        console.error(error);
        this.notificationService.showError(
          'ERROR al querer eliminar al cliente',
          ''
        );
      }
    );
  }

  editarCliente(idCliente: number) {
    this.router.navigate(['/app-web/clientes/clientes-registro', idCliente]);
  }

  generarReporte() {
    // Lógica para generar reporte PDF (puedes utilizar la implementación que ya tienes) o una acción distinta
  }
}
