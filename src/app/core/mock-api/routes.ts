import type { MockRouteConfig } from './types';
import { demoRoutes } from './fixtures/demo';
import { practicaRoutes } from './fixtures/practica';

export const MOCK_ROUTES: readonly MockRouteConfig[] = [...demoRoutes, ...practicaRoutes];
