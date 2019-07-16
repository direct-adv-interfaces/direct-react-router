import { Location as HistoryLocation } from 'history';
import { parse, ParsedQuery } from 'query-string';

import { matchPath, Params, QueryParams } from './matchPath';

export const UNKNOWN_ROUTE = '@@direct-react-router/UNKNOWN_ROUTE';

export interface RouteInfo {
    key: string;
    route: string;
}

export interface RouterConfig {
    routes: RouteInfo[];
    // todo: basePath
}

export interface RouterLocation {
    key: string;
    pathname: string;
    search: string;
    hash: string;
    params: Params;
    query: QueryParams;
}

export function parseLocation(
    { routes }: RouterConfig,
    { pathname, search, hash }: HistoryLocation
): RouterLocation {
    const query: ParsedQuery<string> = parse(search);

    let location: RouterLocation | null = routes.reduce(
        (prev: RouterLocation | null, r: RouteInfo) => {
            if (prev) {
                return prev;
            }

            const matched = matchPath(pathname, {
                path: r.route
            });

            return matched
                ? {
                      pathname,
                      search,
                      hash,
                      key: r.key,
                      params: matched.params,
                      query
                  }
                : null;
        },
        null
    );

    return (
        location || {
            pathname,
            search,
            hash,
            key: UNKNOWN_ROUTE,
            params: {},
            query
        }
    );
}
