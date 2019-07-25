import { Location as HistoryLocation } from 'history';
import { parse, ParsedQuery, stringify } from 'query-string';

import { matchPath, Params, QueryParams, RouteArgs } from './matchPath';
import { generatePath } from './generatePath';

export const UNKNOWN_ROUTE = '@@direct-react-router/UNKNOWN_ROUTE';

export interface RouterConfig {
    routes: { [key: string]: string };
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
                    query
                });

            return prev;
        },
        []
    );

    if (others.length) {
        throw new Error(`ambiguous routes matches: ${others.map(x => x.key).join(', ')}`)
    }

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
    { routeKey, params, query, hash }: RouteArgs
) {
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
