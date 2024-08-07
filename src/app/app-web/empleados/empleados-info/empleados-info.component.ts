import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados/empleados.service';
import { NotiServiceService } from '../../services/notification/notyf/noti-service.service';

@Component({
  selector: 'app-empleados-info',
  templateUrl: './empleados-info.component.html',
  styleUrls: ['./empleados-info.component.css']
})
export class EmpleadosInfoComponent implements OnInit {
  empleado: any = {
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  };

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empleadosService: EmpleadosService,
    private notiService: NotiServiceService
  ) {}

  ngOnInit(): void {
    const idEmpleado = this.route.snapshot.paramMap.get('id');
    if (idEmpleado) {
      this.obtenerEmpleado(idEmpleado);
    }
  }

  obtenerEmpleado(id: string) {
    this.isLoading = true;
    this.empleadosService.buscarEmpleadoId(+id).subscribe(
      (empleado) => {
        this.isLoading = false;
        this.empleado = empleado;
      },
      (error) => {
        //console.error(error);
        this.isLoading = false;
        this.notiService.showError("ERROR al cargar empleado")
      }
    );
  }

  volver() {
    this.router.navigate(['/app-web/empleados/empleados-lista']);
  }
}
