import { Location as HistoryLocation, State as HistoryState } from 'history';
import { parse, ParsedQuery, stringify } from 'query-string';

import { matchPath, MatchedParams, QueryParams, RouteArgs } from './matchPath';
import { generatePath } from './generatePath';

export const ROUTE_NOT_FOUND = '@@direct-react-router/ROUTE_NOT_FOUND';

export interface RouterConfig {
    routes: { [key: string]: string };
}

export interface RouterLocation {
    key: string;
    pathname: string;
    search: string;
    hash: string;
    params: MatchedParams;
    query: QueryParams;
    state: HistoryState;
}

export function parseLocation(
    { routes }: RouterConfig,
    { pathname, search, hash, state }: HistoryLocation
): RouterLocation {
    const query: ParsedQuery<string> = parse(search);

    let [location, ...others]: RouterLocation[] = Object.keys(routes).reduce(
        (prev: RouterLocation[], key: string) => {
            const matched = matchPath(pathname, {
                path: routes[key],
                exact: true
            });

            matched &&
                prev.push({
                    pathname,
                    search,
                    hash,
                    key,
                    params: matched.params,
                    query,
                    state
                });

            return prev;
        },
        []
    );

    if (others.length) {
        throw new Error(`Ambiguous route match: ${[location, ...others].map(x => x.key).join(', ')}`)
    }

    return (
        location || {
            pathname,
            search,
            hash,
            key: ROUTE_NOT_FOUND,
            params: {},
            query,
            state
        }
    );
}

export function generateUrl(
    { routes }: RouterConfig,
    { routeKey, params, query, hash }: RouteArgs
): string {
    const route = routes[routeKey];

    if (!route) {
        throw new Error('Unknown route key');
    }

    let url = generatePath(route, params);

    if (query) {
        const qs = stringify(query);
        qs && (url += '?' + qs);
    }

    if (hash) {
        if (hash[0] !== '#') {
            throw new Error('Hash must be started with #');
        }

        url += hash;
    }

    return url;
}
