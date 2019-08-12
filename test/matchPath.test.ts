import { describe, it } from 'mocha';
import { expect } from 'chai';

import { matchPath } from '../src/matchPath';

// /:foo/:bar   // named parameters
// /:foo/:bar?  // optional parameters
// /:foo*       // zero or more
// /:foo+       // one or more

// details: https://npmjs.org/package/path-to-regexp

describe('matchPath', () => {
    it('named parameters', () => {
        const result: any = matchPath('/xxx/test/zzz/route', {
            path: '/xxx/:foo/zzz/:bar'
        });

        expect(result.params.foo).is.eq('test');
        expect(result.params.bar).is.eq('route');
    });

    it('optional parameters - exists', () => {
        const result: any = matchPath('/moo/zzz/meow', {
            path: '/:cowSays/zzz/:catSays?'
        });

        expect(result.params.cowSays).is.eq('moo');
        expect(result.params.catSays).is.eq('meow');
    });

    it('optional parameters - not exists', () => {
        const result: any = matchPath('/moo/zzz', {
            path: '/:cowSays/zzz/:catSays?'
        });

        expect(result.params.cowSays).is.eq('moo');
        expect(result.params.catSays).is.undefined;
    });

    it('zero or more - empty', () => {
        const result: any = matchPath('/aaa/', {
            path: '/aaa/:path*'
        });

        expect(result).is.not.null;
        expect(result.params.path).is.undefined;
    });

    it('zero or more - not empty', () => {
        const result: any = matchPath('/aaa/moo/meow/', {
            path: '/aaa/:path*'
        });

        expect(result).is.not.null;
        expect(result.params.path).is.eq('moo/meow');
    });

    it('one or more - empty', () => {
        const result: any = matchPath('/aaa/', {
            path: '/aaa/:path+'
        });

        expect(result).is.null;
    });

    it('one or more - not empty', () => {
        const result: any = matchPath('/aaa/bb/cc/', {
            path: '/aaa/:path+'
        });

        expect(result).is.not.null;
        expect(result.params.path).is.eq('bb/cc');
    });

    it('invalid url => null', () => {
        const result = matchPath('invalid-url', {
            path: '/users/:login/edit/start'
        });

        expect(result).is.null;
    });
});
