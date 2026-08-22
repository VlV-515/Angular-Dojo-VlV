import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'buscador',
    loadComponent: () =>
      import('./features/mid-02-race-condition/buscador').then((m) => m.Buscador),
  },
];
