import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'rutina',
    loadComponent: () =>
      import('./features/junior-05-signals-basico/rutina-diaria').then((m) => m.RutinaDiaria),
  },
];
