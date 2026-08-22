import type { MockRouteConfig } from './types';

function resetIfGlobal(pattern: RegExp): void {
  if (pattern.global) {
    pattern.lastIndex = 0;
  }
}

export function matchRoute(match: MockRouteConfig['match'], pathname: string): boolean {
  if (typeof match === 'string') {
    return match === pathname;
  }
  resetIfGlobal(match);
  return match.test(pathname);
}

export function extractParams(
  match: MockRouteConfig['match'],
  pathname: string,
): Record<string, string> {
  if (typeof match === 'string') {
    return {};
  }
  resetIfGlobal(match);
  const result = match.exec(pathname);
  return { ...(result?.groups ?? {}) };
}
