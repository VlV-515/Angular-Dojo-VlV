import type { HttpRequest } from '@angular/common/http';

export type MockHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface MockRouteContext {
  readonly request: HttpRequest<unknown>;
  readonly params: Readonly<Record<string, string>>;
}

export interface MockRouteConfig {
  readonly method: MockHttpMethod;
  readonly match: string | RegExp;
  readonly handler: (context: MockRouteContext) => unknown;
  readonly latencyMs?: number | ((context: MockRouteContext) => number);
  readonly shouldFail?: () => boolean;
  readonly failStatus?: number;
  readonly failMessage?: string;
}
