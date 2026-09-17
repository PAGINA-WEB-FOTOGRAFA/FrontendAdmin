import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Eventos } from './eventos';
import { EventosService } from '../../../core/services/eventos';
import { DialogService } from '../../../core/services/dialog';

describe('Eventos', () => {
  let component: Eventos;
  let fixture: ComponentFixture<Eventos>;
  let service: EventosService;
  let dialog: DialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eventos],
      providers: [
        {
          provide: EventosService,
          useValue: {
            listar: () =>
              of([
                { id: 1, nombre: 'Recital', fecha_evento: '2026-05-01', lugar: 'CABA', precio_foto: 20, activo: 1 },
              ]),
            obtener: () => of({ id: 1, nombre: 'Recital', fecha_evento: '2026-05-01', lugar: 'CABA', precio_foto: 20, activo: 1, fotos: [] }),
            crear: (data: unknown, fotos: File[]) => of({ ...(data as object), fotos }),
            actualizar: () => of({}),
            eliminar: () => of({}),
          },
        },
        { provide: DialogService, useValue: { confirmar: () => true, alert: () => undefined } },
      ],
    }).compileComponents();

    service = TestBed.inject(EventosService);
    dialog = TestBed.inject(DialogService);

    fixture = TestBed.createComponent(Eventos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads eventos on init', () => {
    expect(component.eventos.length).toBe(1);
    expect(component.eventos[0].nombre).toBe('Recital');
  });

  it('creates an evento and closes the form', () => {
    const crearSpy = spyOn(service, 'crear').and.callThrough();
    component.abrirNuevo();
    component.form.setValue({
      nombre: 'Nuevo',
      lugar: 'CABA',
      fecha_evento: '2026-06-01',
      precio_foto: 10,
      activo: true,
    });

    component.guardar();

    expect(crearSpy).toHaveBeenCalledWith(
      { nombre: 'Nuevo', lugar: 'CABA', fecha_evento: '2026-06-01', precio_foto: 10, activo: 1 },
      [],
      null
    );
    expect(component.showForm).toBeFalse();
  });

  it('adds and removes selected new photos', () => {
    component.abrirNuevo();
    const file = new File(['x'], 'foto.jpg', { type: 'image/jpeg' });

    component.onFilesSelected({ target: { files: [file] } } as unknown as Event);

    expect(component.fotosNuevas.length).toBe(1);

    component.quitarNueva(0);

    expect(component.fotosNuevas.length).toBe(0);
  });

  it('marks existing photos for deletion', () => {
    component.abrirEdicion(component.eventos[0]);
    component.fotosExistentes = [{ id: 9, ruta: 'uploads/a.jpg', url: '/backend/uploads/a.jpg', eliminada: false }];

    component.marcarParaEliminar(component.fotosExistentes[0]);

    expect(component.fotosExistentes[0].eliminada).toBeTrue();
  });
});