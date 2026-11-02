import type { MockRouteConfig } from './types';
import { demoRoutes } from './fixtures/demo';
import { panelRoutes } from './fixtures/panel';

export const MOCK_ROUTES: readonly MockRouteConfig[] = [...demoRoutes, ...panelRoutes];
