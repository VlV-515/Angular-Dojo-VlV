import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'tecnicas',
    loadComponent: () =>
      import('./features/junior-01-routing/tecnicas-list').then((m) => m.TecnicasList),
  },
  {
    path: 'tecnicas/:id',
    loadComponent: () =>
      import('./features/junior-01-routing/tecnicas-detail').then((m) => m.TecnicasDetail),
  },
];
