import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';

@Component({
  selector: 'app-habitaciones-lista',
  templateUrl: './habitaciones-lista.component.html',
  styleUrls: ['./habitaciones-lista.component.css']
})
export class HabitacionesListaComponent implements OnInit {

  habitaciones: any[] = [];

  constructor(private habitacionesService: HabitacionesService) {}

  ngOnInit(): void {
    this.obtenerTodasLasHabitaciones();
  }

  obtenerTodasLasHabitaciones() {
    this.habitacionesService.obtenerTodasLasHabitaciones().subscribe(response => {
      this.habitaciones = response;
    }, error => {
      console.error(error);
    });
  }

  eliminar(idHabitacion: number) {
    const confirmar = confirm(`¿Estás seguro de eliminar la habitación con ID ${idHabitacion}?`);
    if (confirmar) {
      this.habitacionesService.eliminarHabitacion(idHabitacion).subscribe(response => {
        this.obtenerTodasLasHabitaciones();
      }, error => {
        console.error(error);
      });
    }
  }

  editarHabitacion(id: number): void {
    // Implementa la lógica para editar una habitación
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }
}
