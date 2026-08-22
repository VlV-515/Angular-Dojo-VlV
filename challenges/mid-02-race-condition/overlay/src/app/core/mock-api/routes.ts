import type { MockRouteConfig } from './types';
import { demoRoutes } from './fixtures/demo';
import { buscadorRoutes } from './fixtures/buscador';

export const MOCK_ROUTES: readonly MockRouteConfig[] = [...demoRoutes, ...buscadorRoutes];
