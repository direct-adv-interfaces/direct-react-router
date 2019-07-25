import { describe, it } from 'mocha';
import { expect } from 'chai';
import { generateUrl, RouterConfig } from '../src/location';

describe('generateUrl', () => {
    it('генерируется url без параметров', () => {
        const config: RouterConfig = {
            routes: { aaa: '/xxx/yyy/zz' }
        };

        const result: string = generateUrl(config, { routeKey: 'aaa' });

        expect(result).is.equal('/xxx/yyy/zz');
    });

    it('параметры правильно подставляются в path', () => {
        const config: RouterConfig = {
            routes: { bbb: '/xxx/:login/yyy/:num' }
        };

        const result: string = generateUrl(config, {
            routeKey: 'bbb',
            params: { login: 'qq', num: '12' }
        });

        expect(result).is.equal('/xxx/qq/yyy/12');
    });

    it('параметры правильно подставляются в query string', () => {
        const config: RouterConfig = {
            routes: { ccc: '/zzz/:id' }
        };

        const result: string = generateUrl(config, {
            routeKey: 'ccc',
            params: { id: 'ww' },
            query: { x: '1', y: '2', z: '3' }
        });

        expect(result).is.equal('/zzz/ww?x=1&y=2&z=3');
    });

    it('параметры не подставляются в query string, если query - пустой объект', () => {
        const config: RouterConfig = {
            routes: { ddd: '/xxxx/:id' }
        };

        const result: string = generateUrl(config, {
            routeKey: 'ddd',
            params: { id: 'ee' },
            query: {}
        });

        expect(result).is.equal('/xxxx/ee');
    });

    it('в url добавляется hash, если он передан', () => {
        const config: RouterConfig = {
            routes: { eee: '/yyyy/:id' }
        };

        const result: string = generateUrl(config, {
            routeKey: 'eee',
            params: { id: 'ff' },
            hash: '#kjh'
        });

        expect(result).is.equal('/yyyy/ff#kjh');
    });

    it('если hash не начинается с #, то падает с ошибкой', () => {
        const config: RouterConfig = {
            routes: { fff: '/zzzz/:id' }
        };

        expect(() => {
            generateUrl(config, {
                routeKey: 'fff',
                params: { id: 'gg' },
                hash: 'kjh'
            });
        }).throws('Hash must be started with #');
    });

    it('если передан несуществующий ключ, то падает с ошибкой', () => {
        const config: RouterConfig = {
            routes: { ggg: '/xx/xx' }
        };

        expect(() => {
            generateUrl(config, { routeKey: 'unknown' });
        }).throws('Unknown route key');
    });

    it('query string is url encoded', () => {
        const config: RouterConfig = {
            routes: { hhh: '/xy' }
        };

        const result = generateUrl(config, {
            routeKey: 'hhh',
            query: { 'a b': 'c d' }
        });

        expect(result).is.equal('/xy?a%20b=c%20d');
    });
});
