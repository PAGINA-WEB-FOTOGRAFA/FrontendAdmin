import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { API_URL } from '../../../core/services/api';
import { Evento, EventosService } from '../../../core/services/eventos';
import { DialogService } from '../../../core/services/dialog';

interface FotoEditable {
  id: number;
  ruta: string;
  url: string;
  eliminada: boolean;
}

interface FotoNueva {
  file: File;
  url: string;
}

@Component({
  selector: 'app-eventos',
  imports: [ReactiveFormsModule, FormsModule, DecimalPipe],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss',
})
export class Eventos implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EventosService);
  private dialog = inject(DialogService);

  eventos: Evento[] = [];
  loading = false;
  error = '';
  editandoId: number | null = null;
  showForm = false;
  fotosExistentes: FotoEditable[] = [];
  fotosNuevas: FotoNueva[] = [];

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    lugar: ['', Validators.required],
    fecha_evento: ['', Validators.required],
    precio_foto: [0, [Validators.required, Validators.min(0)]],
    activo: [true],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.service.listar().subscribe({
      next: (res) => {
        this.eventos = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.eventos = [];
        this.loading = false;
      },
    });
  }

  fotoUrl(ruta: string): string {
    return `${API_URL}/${ruta}`;
  }

  nombreFoto(ruta: string): string {
    return ruta.split('/').pop() ?? ruta;
  }

  abrirNuevo(): void {
    this.editandoId = null;
    this.fotosExistentes = [];
    this.limpiarNuevas();
    this.form.reset({ nombre: '', lugar: '', fecha_evento: '', precio_foto: 0, activo: true });
    this.showForm = true;
  }

  abrirEdicion(e: Evento): void {
    this.editandoId = e.id;
    this.fotosExistentes = [];
    this.limpiarNuevas();
    this.form.setValue({
      nombre: e.nombre,
      lugar: e.lugar ?? '',
      fecha_evento: e.fecha_evento,
      precio_foto: Number(e.precio_foto),
      activo: e.activo === 1,
    });
    this.showForm = true;

    this.service.obtener(e.id).subscribe({
      next: (evo) => {
        this.fotosExistentes = (evo?.fotos ?? []).map((f) => ({
          id: f.id,
          ruta: f.ruta,
          url: this.fotoUrl(f.ruta),
          eliminada: false,
        }));
      },
      error: () => undefined,
    });
  }

  cerrarForm(): void {
    this.showForm = false;
    this.editandoId = null;
    this.error = '';
    this.fotosExistentes = [];
    this.limpiarNuevas();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error = '';
    this.loading = true;
    const { nombre, lugar, fecha_evento, precio_foto, activo } = this.form.getRawValue();
    const data = { nombre, lugar, fecha_evento, precio_foto, activo: activo ? 1 : 0 };
    const archivos = this.fotosNuevas.map((f) => f.file);
    const request =
      this.editandoId === null
        ? this.service.crear(data, archivos)
        : this.service.actualizar(
            this.editandoId,
            data,
            archivos,
            this.fotosExistentes.filter((f) => f.eliminada).map((f) => f.id)
          );

    request.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this.cargar();
        this.cerrarForm();
      },
      error: () => (this.error = 'No se pudo guardar el evento.'),
    });
  }

  eliminar(e: Evento): void {
    if (!this.dialog.confirmar(`¿Eliminar el evento "${e.nombre}"?`)) {
      return;
    }
    this.service.eliminar(e.id).subscribe({
      next: () => this.cargar(),
      error: () => this.dialog.alert('No se pudo eliminar el evento.'),
    });
  }

  onFilesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      for (const file of Array.from(files)) {
        this.fotosNuevas.push({ file, url: URL.createObjectURL(file) });
      }
    }
    (event.target as HTMLInputElement).value = '';
  }

  quitarNueva(index: number): void {
    const [foto] = this.fotosNuevas.splice(index, 1);
    if (foto?.url) {
      URL.revokeObjectURL(foto.url);
    }
  }

  marcarParaEliminar(foto: FotoEditable): void {
    foto.eliminada = !foto.eliminada;
  }

  private limpiarNuevas(): void {
    this.fotosNuevas.forEach((f) => URL.revokeObjectURL(f.url));
    this.fotosNuevas = [];
  }
}