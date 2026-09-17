import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api';

export interface Foto {
  id: number;
  ruta: string;
}

export interface Evento {
  id: number;
  nombre: string;
  lugar: string;
  fecha_evento: string;
  precio_foto: number;
  activo: number;
  portada?: string | null;
  fecha_creacion?: string;
  fotos?: Foto[];
}

export interface EventoData {
  nombre: string;
  lugar: string;
  fecha_evento: string;
  precio_foto: number;
  activo: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  constructor(private api: ApiService) {}

  listar(): Observable<Evento[]> {
    return this.api.get('get_eventos.php?admin=true').pipe(map((res) => res?.eventos ?? []));
  }

  obtener(id: number): Observable<Evento> {
    return this.api.get(`get_eventos.php?id=${id}`).pipe(map((res) => res?.evento));
  }

  crear(data: EventoData, fotos: File[], portada?: File | null): Observable<Evento> {
    const fd = this.formData(data, fotos, portada);
    return this.api.postForm('crear_evento.php', fd).pipe(map((res) => res?.evento ?? res));
  }

  actualizar(
    id: number,
    data: EventoData,
    fotos: File[],
    fotosEliminar: number[],
    portada?: File | null
  ): Observable<any> {
    const fd = this.formData(data, fotos, portada);
    fd.append('id', String(id));
    fotosEliminar.forEach((fid) => fd.append('fotos_eliminar[]', String(fid)));
    return this.api.postForm('editar_evento.php', fd);
  }

  eliminar(id: number): Observable<any> {
    return this.api.post('eliminar_evento.php', { id });
  }

  private formData(data: EventoData, fotos: File[], portada?: File | null): FormData {
    const fd = new FormData();
    fd.append('nombre', data.nombre);
    fd.append('lugar', data.lugar);
    fd.append('fecha_evento', data.fecha_evento);
    fd.append('precio_foto', String(data.precio_foto));
    fd.append('activo', String(data.activo));
    fotos.forEach((foto) => fd.append('fotos[]', foto, foto.name));
    if (portada) {
      fd.append('portada', portada, portada.name);
    }
    return fd;
  }
}