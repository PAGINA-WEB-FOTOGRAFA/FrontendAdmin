import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { AdminLayout } from './features/admin/layout/layout';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { Ventas } from './features/admin/ventas/ventas';
import { Eventos } from './features/admin/eventos/eventos';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [loginGuard] },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'ventas', component: Ventas },
      { path: 'eventos', component: Eventos },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];