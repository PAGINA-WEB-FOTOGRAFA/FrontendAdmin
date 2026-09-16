import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { Ventas } from './ventas';
import { Venta, VentasService } from '../../../core/services/ventas';

describe('Ventas', () => {
  let component: Ventas;
  let fixture: ComponentFixture<Ventas>;

  const venta: Venta = {
    id: 1,
    nombre: 'Cliente',
    apellido: 'A',
    whatsapp: '5491122334455',
    email: 'cliente@mail.com',
    total: '150.00',
    estado: 'pendiente',
    fecha: '2026-01-01 10:00:00',
    cantidad_fotos: 2,
    fotos: [
      { foto_id: 1, precio: '100.00', ruta: 'uploads/a.jpg', evento_nombre: 'Evento 1' },
      { foto_id: 2, precio: '50.00', ruta: 'uploads/b.jpg', evento_nombre: 'Evento 1' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ventas],
      providers: [
        {
          provide: VentasService,
          useValue: { listar: (): Observable<Venta[]> => of([venta]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Ventas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads ventas on init', () => {
    expect(component.ventas.length).toBe(1);
  });

  it('filters ventas by estado', () => {
    expect(component.visibles.length).toBe(1);

    component.filtro = 'pagado';

    expect(component.visibles.length).toBe(0);
  });

  it('builds the customer name', () => {
    expect(component.cliente(venta)).toBe('Cliente A');
  });
});