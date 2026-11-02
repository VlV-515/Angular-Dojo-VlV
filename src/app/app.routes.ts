import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'Angular Dojo VlV — catálogo de retos',
  },
  {
    path: 'practica-ssr',
    loadComponent: () =>
      import('./features/senior-03-ssr-hydration/panel-practica').then((m) => m.PanelPractica),
    title: 'Panel de práctica — SSR',
  },
];
