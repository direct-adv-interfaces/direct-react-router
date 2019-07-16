import pathToRegexp from 'path-to-regexp';

const cacheLimit: number = 10000;
let cacheCount: number = 0;

const cache: {
    [key: string]: {
        [key: string]: CompiledPath;
    };
} = {};

export interface Options {
    path: string | string[];
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
}

export interface Params {
    [extraProps: string]: string
}

export interface QueryParams {
    [extraProps: string]: string | string[] | null | undefined;
}

export interface MatchedPath {
    path: string;
    url: string;
    isExact: boolean;
    params: Params;
}

interface CompileOptions {
    end: boolean;
    strict: boolean;
    sensitive: boolean;
}

interface CompiledPath {
    regexp: RegExp;
    keys: pathToRegexp.Key[];
}

function compilePath(path: string, options: CompileOptions): CompiledPath {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

    if (pathCache[path]) return pathCache[path];

    const keys: pathToRegexp.Key[] = [];
    const regexp: RegExp = pathToRegexp(path, keys, options);
    const result: CompiledPath = { regexp, keys };

    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
    }

    return result;
}

/**
 * Public API for matching a URL pathname to a path.
 */
export function matchPath(
    pathname: string,
    options: Options
): MatchedPath | null {
    const { path, exact = false, strict = false, sensitive = false } = options;

    const paths: string[] = Array.isArray(path) ? path : [path];

    return paths.reduce((matched: MatchedPath | null, path: string) => {
        if (matched) return matched;

        const { regexp, keys } = compilePath(path, {
            end: exact,
            strict,
            sensitive
        });

        const match: RegExpExecArray | null = regexp.exec(pathname);

        if (!match) return null;

        const [url, ...values]: string[] = match;
        const isExact = pathname === url;

        if (exact && !isExact) return null;

        return {
            path, // the path used to match
            url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
            isExact, // whether or not we matched exactly
            params: keys.reduce(
                (memo: { [key: string]: string }, key, index) => {
                    memo[key.name] = values[index];
                    return memo;
                },
                {}
            )
        };
    }, null);
}
