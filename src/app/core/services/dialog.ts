import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  confirmar(mensaje: string): boolean {
    return window.confirm(mensaje);
  }

  alert(mensaje: string): void {
    window.alert(mensaje);
  }
}