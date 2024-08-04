import {
  Component,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: any;
  private isZoomEnabled: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  private initMap(): void {
    import('leaflet').then((L) => {
      this.map = L.map('map', {
        center: [18.869646, -96.908049], // Coordenadas para Suites Center, Rancho Nuevo, 94696 Córdoba, Ver.
        zoom: 15,
        zoomControl: false, // Deshabilitar los controles de zoom predeterminados
      });

      this.map.scrollWheelZoom.disable();

      // Agregar un control de zoom personalizado
      L.control
        .zoom({
          position: 'bottomright',
        })
        .addTo(this.map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Agregar un marcador al mapa
      const marker = L.marker([18.869646, -96.908049]).addTo(this.map);
      marker
        .bindPopup('<b>Suites Center</b><br>Rancho Nuevo, 94696 Córdoba, Ver.')
        .openPopup();

      // Agrega un botón de centrar al mapa
      const centerButton = document.createElement('button');
      centerButton.innerHTML = '<i class="fa-solid fa-map-pin"></i>';
      centerButton.classList.add(
        'leaflet-bar',
        'leaflet-control',
        'custom-control-button'
      );
      centerButton.onclick = () => {
        this.map.setView([18.869646, -96.908049], 15);
      };
      centerButton.style.fontSize = '24px'; // Cambia el tamaño de la fuente
      this.map
        .getContainer()
        .querySelector('.leaflet-top.leaflet-right')
        .appendChild(centerButton);
    });
  }
}
