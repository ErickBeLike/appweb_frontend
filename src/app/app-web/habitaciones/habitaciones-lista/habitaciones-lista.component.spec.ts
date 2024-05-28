import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionesListaComponent } from './habitaciones-lista.component';

describe('HabitacionesListaComponent', () => {
  let component: HabitacionesListaComponent;
  let fixture: ComponentFixture<HabitacionesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitacionesListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HabitacionesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
