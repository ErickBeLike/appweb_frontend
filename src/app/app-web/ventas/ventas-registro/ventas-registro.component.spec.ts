import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasRegistroComponent } from './ventas-registro.component';

describe('VentasRegistroComponent', () => {
  let component: VentasRegistroComponent;
  let fixture: ComponentFixture<VentasRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentasRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
