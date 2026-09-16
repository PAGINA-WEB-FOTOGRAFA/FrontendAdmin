import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService, AuthUser } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class AdminLayout {
  private auth = inject(AuthService);
  private router = inject(Router);

  user: AuthUser | null = this.auth.getUser();

  menuAbierto = false;

  nav: { path: string; label: string }[] = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/ventas', label: 'Ventas' },
    { path: '/admin/eventos', label: 'Eventos' },
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}