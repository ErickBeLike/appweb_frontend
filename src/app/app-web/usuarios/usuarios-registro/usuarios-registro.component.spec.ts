import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosRegistroComponent } from './usuarios-registro.component';

describe('UsuariosRegistroComponent', () => {
  let component: UsuariosRegistroComponent;
  let fixture: ComponentFixture<UsuariosRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsuariosRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuariosRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
