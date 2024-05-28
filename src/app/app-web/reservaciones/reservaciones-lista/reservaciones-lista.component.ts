import { Component, OnInit } from '@angular/core';
import { ReservacionesService } from '../../services/reservaciones/reservaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservaciones-lista',
  templateUrl: './reservaciones-lista.component.html',
  styleUrls: ['./reservaciones-lista.component.css']
})
export class ReservacionesListaComponent implements OnInit {

  reservaciones: any[] = [];

  constructor(private reservacionesService: ReservacionesService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerTodasLasReservaciones();
  }

  obtenerTodasLasReservaciones() {
    this.reservacionesService.obtenerTodasLasReservaciones().subscribe(response => {
      this.reservaciones = response;
    }, error => {
      console.error(error);
    });
  }

  eliminar(idReservacion: number) {
    const confirmar = confirm(`¿Estás seguro de eliminar la reservación con ID ${idReservacion}?`);
    if (confirmar) {
      this.reservacionesService.eliminarReservacion(idReservacion).subscribe(response => {
        this.obtenerTodasLasReservaciones();
      }, error => {
        console.error(error);
      });
    }
  }

  editarReservacion(id: number): void {
    // Implementa la lógica para editar un producto
  }

  generarReporte() {
    // Implementa la lógica para generar un reporte en PDF
  }
}
