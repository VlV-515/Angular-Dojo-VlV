import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'ficha-tecnica',
    loadComponent: () =>
      import('./features/junior-06-http-resource/ficha-tecnica').then((m) => m.FichaTecnica),
  },
];
