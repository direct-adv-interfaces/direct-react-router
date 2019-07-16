import { describe, it } from 'mocha';
import { expect } from 'chai';
import { createLocation } from 'history';

import { parseLocation, RouterConfig, RouterLocation, UNKNOWN_ROUTE } from '../src/location';

describe('parseLocation', () => {
    it('parse route key', () => {
        const location = createLocation('/xxx/123');
        const config: RouterConfig = {
            routes: [{ key: 'aaa', route: '/xxx/:id' }]
        };

        const result: RouterLocation = parseLocation(config, location);

        expect(result.key).is.equal('aaa');
    });

    it('parse url parts', () => {
        const location = createLocation('/yyy/123?aa=1&bb=2#qqq');
        const config: RouterConfig = {
            routes: [{ key: 'bbb', route: '/yyy/:id' }]
        };

        const result: RouterLocation = parseLocation(config, location);

        expect(result.pathname).is.equal('/yyy/123');
        expect(result.search).is.equal('?aa=1&bb=2');
        expect(result.hash).is.equal('#qqq');
    });

    it('parse empty search part', () => {
        const location = createLocation('/zzz/444?#qqq');
        const config: RouterConfig = {
            routes: [{ key: 'ccc', route: '/yyy/:id' }]
        };

        const result: RouterLocation = parseLocation(config, location);

        expect(result.search).is.equal('');
    });

    it('parse empty hash part', () => {
        const location = createLocation('/aaa/555?a=2#');
        const config: RouterConfig = {
            routes: [{ key: 'ddd', route: '/aaa/:id' }]
        };

        const result: RouterLocation = parseLocation(config, location);

        expect(result.hash).is.equal('');
    });

    it('parse url params', () => {
        const location = createLocation('/bb/12/cc/cow');
        const config: RouterConfig = {
            routes: [{ key: 'eee', route: '/bb/:num/cc/:alias' }]
        };

        const result: RouterLocation = parseLocation(config, location);

        expect(result.params.num).is.equal('12');
        expect(result.params.alias).is.equal('cow');
    });

    it('parse query string', () => {
        const location = createLocation('/bb/12/cc/cow?aa=1&bb=2#xxx');
        const config: RouterConfig = {
            routes: [{ key: 'eee', route: '/bb/:num/cc/:alias' }]
        };

        const result: RouterLocation = parseLocation(config, location);

        expect(result.query.aa).is.equal('1');
        expect(result.query.bb).is.equal('2');
    });

    it('parse unknown route', () => {
        const location = createLocation('/asfk/jfka/jgfka?aa=1#www');
        const config: RouterConfig = {
            routes: [{ key: 'eee', route: '/bb' }]
        };

        const result: RouterLocation = parseLocation(config, location);

        expect(result.key).is.equal(UNKNOWN_ROUTE);
        expect(result.pathname).is.equal('/asfk/jfka/jgfka');
        expect(result.search).is.equal('?aa=1');
        expect(result.hash).is.equal('#www');
        expect(result.query.aa).is.equal('1');
        expect(result.params).is.empty;
    });
});
