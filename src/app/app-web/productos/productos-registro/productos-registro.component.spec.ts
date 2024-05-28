import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosRegistroComponent } from './productos-registro.component';

describe('ProductosRegistroComponent', () => {
  let component: ProductosRegistroComponent;
  let fixture: ComponentFixture<ProductosRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductosRegistroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductosRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
