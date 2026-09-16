import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Dashboard } from './dashboard';
import { VentasService } from '../../../core/services/ventas';
import { EventosService } from '../../../core/services/eventos';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: VentasService,
          useValue: {
            listar: () =>
              of([
                { id: 1, total: '100.00', estado: 'pendiente' },
                { id: 2, total: '50.00', estado: 'pagado' },
              ]),
          },
        },
        {
          provide: EventosService,
          useValue: { listar: () => of([{ id: 1 }]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('computes totals from the services', () => {
    expect(component.totalVentas).toBe(2);
    expect(component.montoVentas).toBe(150);
    expect(component.totalEventos).toBe(1);
  });
});