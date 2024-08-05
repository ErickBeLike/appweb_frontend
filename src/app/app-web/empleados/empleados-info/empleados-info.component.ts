import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados/empleados.service';

@Component({
  selector: 'app-empleados-info',
  templateUrl: './empleados-info.component.html',
  styleUrls: ['./empleados-info.component.css']
})
export class EmpleadosInfoComponent implements OnInit {
  empleado: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    const idEmpleado = this.route.snapshot.paramMap.get('id');
    if (idEmpleado) {
      this.obtenerEmpleado(idEmpleado);
    }
  }

  obtenerEmpleado(id: string) {
    this.empleadosService.buscarEmpleadoId(+id).subscribe(
      (empleado) => {
        this.empleado = empleado;
        // Aquí puedes usar el servicio para obtener más detalles del empleado y asignarlos a this.empleado
      },
      (error) => {
        console.error(error);
      }
    );
  }

  volver() {
    this.router.navigate(['/app-web/empleados/empleados-lista']);
  }
}
