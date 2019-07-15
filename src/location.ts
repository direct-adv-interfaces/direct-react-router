import { Location as HistoryLocation } from 'history';
import { parse } from 'qs';

import { matchPath, Params } from './matchPath';

export const UNKNOWN_PATH = '@@direct-react-router/UNKNOWN_PATH';

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
    query: Params;
}

export function parseLocation(
    { routes }: RouterConfig,
    { pathname, search, hash }: HistoryLocation
): RouterLocation {
    const query = parse(search);

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
            key: UNKNOWN_PATH,
            params: {},
            query
        }
    );
}
