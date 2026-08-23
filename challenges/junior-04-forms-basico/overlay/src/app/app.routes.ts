import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'Angular Dojo VlV — catálogo de retos',
  },
  {
    path: 'inscripcion',
    loadComponent: () =>
      import('./features/junior-04-forms-basico/inscripcion-form').then(
        (m) => m.InscripcionForm,
      ),
  },
];
