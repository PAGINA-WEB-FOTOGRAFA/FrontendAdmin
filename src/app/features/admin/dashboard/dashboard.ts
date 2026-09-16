import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Venta, VentasService } from '../../../core/services/ventas';
import { EventosService } from '../../../core/services/eventos';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private ventas = inject(VentasService);
  private eventos = inject(EventosService);

  totalVentas = 0;
  montoVentas = 0;
  totalEventos = 0;

  ngOnInit(): void {
    this.ventas.listar().subscribe({
      next: (res) => {
        const lista = res ?? [];
        this.totalVentas = lista.length;
        this.montoVentas = lista.reduce((acc: number, v: Venta) => acc + Number(v.total ?? 0), 0);
      },
      error: () => (this.totalVentas = 0),
    });
    this.eventos.listar().subscribe({
      next: (res) => (this.totalEventos = res?.length ?? 0),
      error: () => (this.totalEventos = 0),
    });
  }
}