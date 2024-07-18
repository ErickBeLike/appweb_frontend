import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CargosService } from '../../services/cargos/cargos.service';
import { ToastrService } from 'ngx-toastr';
import unidecode from 'unidecode'; // Importa la función unidecode

@Component({
  selector: 'app-cargos-lista',
  templateUrl: './cargos-lista.component.html',
  styleUrls: ['./cargos-lista.component.css']
})
export class CargosListaComponent implements OnInit {
  cargos: any[] = [];
  cargosFiltrados: any[] = [];
  cargoAEliminar: number | null = null;
  showDeleteModal: boolean = false;
  ordenActual: string = 'idCargo'; // Columna de orden predeterminada
  orden: string = 'asc'; // Dirección de orden predeterminada

  constructor(
    private cargosService: CargosService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerTodosLosCargos();
  }

  obtenerTodosLosCargos() {
    this.cargosService.obtenerTodosLosCargos().subscribe(
      (response: any[]) => {
        this.cargos = response;
        this.cargosFiltrados = [...this.cargos];
      },
      error => {
        console.error(error);
      }
    );
  }

  buscarCargo(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    const valorNormalizado = unidecode(valor); // Normaliza el texto de búsqueda

    if (valor === '') {
      this.cargosFiltrados = [...this.cargos];
    } else {
      this.cargosFiltrados = this.cargos.filter(cargo =>
        this.contieneTextoNormalizado(cargo.nombreCargo.toLowerCase(), valorNormalizado) ||
        this.contieneTextoNormalizado(cargo.descripcionCargo.toLowerCase(), valorNormalizado)
      );
    }
  }

  contieneTextoNormalizado(texto: string, valorNormalizado: string): boolean {
    const textoNormalizado = unidecode(texto); // Normaliza el texto de la tabla
    return textoNormalizado.includes(valorNormalizado);
  }

  ordenarCargos(campo: string) {
    if (this.ordenActual === campo) {
      this.orden = this.orden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = campo;
      this.orden = 'asc';
    }

    const factor = this.orden === 'asc' ? 1 : -1;
    this.cargosFiltrados.sort((a, b) => {
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

  openDeleteModal(idCargo: number) {
    this.cargoAEliminar = idCargo;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.cargoAEliminar = null;
  }

  confirmarEliminarCargo() {
    if (this.cargoAEliminar !== null) {
      this.cargosService.eliminarCargo(this.cargoAEliminar).subscribe(
        () => {
          this.obtenerTodosLosCargos();
          this.toastr.success('Cargo eliminado exitosamente', '', {
            enableHtml: true,
            toastClass: 'toast-eliminar'
          });
          this.closeDeleteModal();
        },
        error => {
          console.error(error);
          this.toastr.error('ERROR al querer eliminar el cargo', '', {
            enableHtml: true,
            toastClass: 'toast-error'
          });
          this.closeDeleteModal();
        }
      );
    }
  }

  editarCargo(idCargo: number) {
    this.router.navigate(['/app-web/cargos/cargos-registro', idCargo]);
  }

  generarReporte() {
    // Lógica para generar reporte PDF (puedes utilizar la implementación que ya tienes) o una acción distinta
  }
}
