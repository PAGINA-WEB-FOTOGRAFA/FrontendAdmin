import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api';

export interface VentaFoto {
  foto_id: number;
  precio: string;
  ruta: string;
  evento_nombre: string;
}

export interface Venta {
  id: number;
  nombre: string;
  apellido: string;
  whatsapp: string;
  email: string;
  total: string | number;
  estado: 'pendiente' | 'pagado';
  fecha: string;
  cantidad_fotos: number;
  fotos?: VentaFoto[];
}

export const ESTADOS_VENTA = ['pendiente', 'pagado'];

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  constructor(private api: ApiService) {}

  listar(): Observable<Venta[]> {
    return this.api.get('get_ventas.php').pipe(map((res) => res?.ventas ?? []));
  }

  obtener(id: number): Observable<Venta> {
    return this.api.get(`get_ventas.php?id=${id}`).pipe(map((res) => res?.ventas?.[0]));
  }
}