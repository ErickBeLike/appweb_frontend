import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosRegistroComponent } from './empleados-registro.component';

describe('EmpleadosRegistroComponent', () => {
  let component: EmpleadosRegistroComponent;
  let fixture: ComponentFixture<EmpleadosRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpleadosRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpleadosRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
