import { Routes } from '@angular/router';

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
    // Bug: el guard `authGuard` existe y está bien escrito, pero nunca se conectó aquí con
    // `canActivate`. Sin eso, la ruta queda tan abierta como cualquier otra.
    loadComponent: () => import('./features/mid-04-guards-interceptors/panel').then((m) => m.Panel),
  },
];
