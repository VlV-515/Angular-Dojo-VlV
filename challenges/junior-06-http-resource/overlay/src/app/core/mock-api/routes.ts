import type { MockRouteConfig } from './types';
import { demoRoutes } from './fixtures/demo';
import { fichasRoutes } from './fixtures/fichas';

export const MOCK_ROUTES: readonly MockRouteConfig[] = [...demoRoutes, ...fichasRoutes];
