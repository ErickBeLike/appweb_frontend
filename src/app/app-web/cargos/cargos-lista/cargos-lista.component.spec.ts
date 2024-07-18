import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargosListaComponent } from './cargos-lista.component';

describe('CargosListaComponent', () => {
  let component: CargosListaComponent;
  let fixture: ComponentFixture<CargosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CargosListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
