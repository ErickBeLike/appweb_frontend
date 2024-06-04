import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes/clientes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {
  clientes: any[] = [];
  clienteAEliminar: number | null = null;
  showDeleteModal: boolean = false;

  constructor(private clientesService: ClientesService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.obtenerTodosLosClientes();
  }

  obtenerTodosLosClientes() {
    this.clientesService.obtenerTodosLosClientes().subscribe(
      (response: any[]) => {
        this.clientes = response;
      },
      error => {
        console.error(error);
      }
    );
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
          this.obtenerTodosLosClientes();
          this.toastr.success('ERROR al querer eliminar al cliente', '', {
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
