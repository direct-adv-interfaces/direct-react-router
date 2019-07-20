import { Location as HistoryLocation } from 'history';
import { parse, ParsedQuery, stringify } from 'query-string';

import { matchPath, Params, QueryParams, RouteArgs } from './matchPath';
import { generatePath } from './generatePath';

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
                path: r.route,
                exact: true
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

export function generateUrl(
    { routes }: RouterConfig,
    { routeKey, params, query, hash } : RouteArgs
) {

    const [route] = routes
        .filter(r => r.key === routeKey)
        .map(r => r.route); // todo: memo

    if (!route) {
        throw new Error('Unknown route key')
    }    

    let url = generatePath(route, params);

    if (query) {
        const qs = stringify(query);
        qs && (url += '?' + qs);
    }

    if (hash) {
        if (hash[0] !== '#') {
            throw new Error('Hash must be started with #')
        }

        url += hash;
    }

    return url;
}
