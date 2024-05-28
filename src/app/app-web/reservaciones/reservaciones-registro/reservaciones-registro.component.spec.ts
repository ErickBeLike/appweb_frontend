import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionesRegistroComponent } from './reservaciones-registro.component';

describe('ReservacionesRegistroComponent', () => {
  let component: ReservacionesRegistroComponent;
  let fixture: ComponentFixture<ReservacionesRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservacionesRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservacionesRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
