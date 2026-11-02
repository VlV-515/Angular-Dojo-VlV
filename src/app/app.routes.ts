import { Routes } from '@angular/router';

import { PREFIJO_AVISO } from './features/mid-03-di-ng0203/avisos.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'Angular Dojo VlV — catálogo de retos',
  },
  {
    path: 'mid-03-di-ng0203',
    providers: [{ provide: PREFIJO_AVISO, useValue: '🔔 ' }],
    loadComponent: () =>
      import('./features/mid-03-di-ng0203/panel-avisos').then((m) => m.PanelAvisos),
  },
];
