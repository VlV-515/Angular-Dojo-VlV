import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'padron',
    loadComponent: () =>
      import('./features/senior-01-perf-lista/padron-list').then((m) => m.PadronList),
  },
];
