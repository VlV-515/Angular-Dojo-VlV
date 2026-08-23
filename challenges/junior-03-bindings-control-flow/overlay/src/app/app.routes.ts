import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'Angular Dojo VlV — catálogo de retos',
  },
  {
    path: 'calentamiento',
    loadComponent: () =>
      import('./features/junior-03-bindings-control-flow/calentamiento').then(
        (m) => m.Calentamiento,
      ),
    title: 'Calentamiento — bindings y control flow',
  },
];
