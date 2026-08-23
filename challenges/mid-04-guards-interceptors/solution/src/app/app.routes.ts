import { Routes } from '@angular/router';

import { authGuard } from './features/mid-04-guards-interceptors/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'panel-entrada',
    loadComponent: () =>
      import('./features/mid-04-guards-interceptors/panel-entrada').then((m) => m.PanelEntrada),
  },
  {
    path: 'panel',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mid-04-guards-interceptors/panel').then((m) => m.Panel),
  },
];
