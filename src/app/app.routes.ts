import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'asistencia',
    loadComponent: () =>
      import('./features/mid-01-zoneless-no-refresca/asistencia-board').then(
        (m) => m.AsistenciaBoard,
      ),
  },
];
