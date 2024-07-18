import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargosRegistroComponent } from './cargos-registro.component';

describe('CargosRegistroComponent', () => {
  let component: CargosRegistroComponent;
  let fixture: ComponentFixture<CargosRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CargosRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargosRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
