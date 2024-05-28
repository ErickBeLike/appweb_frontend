import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from '../../services/clientes/clientes.service';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {
  clientes: any[] = [];

  constructor(private clientesService: ClientesService, private router: Router) {}

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

  eliminarCliente(idCliente: number) {
    const confirmar = confirm(`¿Estás seguro de eliminar el cliente con ID ${idCliente}?`);
    if (confirmar) {
      this.clientesService.eliminarCliente(idCliente).subscribe(
        () => {
          this.obtenerTodosLosClientes();
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  editarCliente(idCliente: number) {
    this.router.navigate(['/clientes/registro-clientes', idCliente]);
  }

  generarReporte() {
    // Lógica para generar reporte PDF (puedes utilizar la implementación que ya tienes) o una accion distinta
  }
}
