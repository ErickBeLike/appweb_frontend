import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionesRegistroComponent } from './habitaciones-registro.component';

describe('HabitacionesRegistroComponent', () => {
  let component: HabitacionesRegistroComponent;
  let fixture: ComponentFixture<HabitacionesRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitacionesRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HabitacionesRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
