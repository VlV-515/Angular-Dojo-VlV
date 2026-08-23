import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'alumnos',
    loadComponent: () =>
      import('./features/senior-04-a11y-focus-trap/registro-alumnos').then(
        (m) => m.RegistroAlumnos,
      ),
  },
];
