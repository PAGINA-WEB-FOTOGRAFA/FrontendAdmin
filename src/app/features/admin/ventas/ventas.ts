import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { API_URL } from '../../../core/services/api';
import { ESTADOS_VENTA, Venta, VentasService } from '../../../core/services/ventas';

@Component({
  selector: 'app-ventas',
  imports: [FormsModule, DecimalPipe, NgClass],
  templateUrl: './ventas.html',
  styleUrl: './ventas.scss',
})
export class Ventas implements OnInit {
  private service = inject(VentasService);

  ventas: Venta[] = [];
  estados = ESTADOS_VENTA;
  filtro = 'todos';
  loading = false;

  ngOnInit(): void {
    this.cargar();
  }

  get visibles(): Venta[] {
    if (this.filtro === 'todos') {
      return this.ventas;
    }
    return this.ventas.filter((v) => v.estado === this.filtro);
  }

  cliente(v: Venta): string {
    return `${v.nombre ?? ''} ${v.apellido ?? ''}`.trim();
  }

  fotoUrl(ruta: string): string {
    return `${API_URL}/${ruta}`;
  }

  cargar(): void {
    this.loading = true;
    this.service.listar().subscribe({
      next: (res) => {
        this.ventas = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.ventas = [];
        this.loading = false;
      },
    });
  }
}