import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionesListaComponent } from './reservaciones-lista.component';

describe('ReservacionesListaComponent', () => {
  let component: ReservacionesListaComponent;
  let fixture: ComponentFixture<ReservacionesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservacionesListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservacionesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
