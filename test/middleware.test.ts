import {
    createRoutingMiddleware,
    RouterConfig,
    callHistoryMethod,
    LOCATION_CHANGED,
    HISTORY_METHOD_CALLED,
    ROUTE_NOT_FOUND
} from '../src';
import { createMemoryHistory } from 'history';

import configureMockStore, { MockStore } from 'redux-mock-store';
import { describe, it } from 'mocha';
import { expect } from 'chai';

function initStore(config: RouterConfig): MockStore {
    const history = createMemoryHistory();
    const middleware = createRoutingMiddleware(config, history);
    const store = configureMockStore([middleware])();

    return store;
}

describe('middleware', () => {
    it('call history method with RouteArgs', () => {
        const store = initStore({ routes: { aaa: '/aaa1/:name' } });

        store.dispatch(
            callHistoryMethod({
                routeKey: 'aaa',
                params: { name: 'test-name' },
                query: { xxx: '12' },
                hash: '#kwjehfjkweh'
            })
        );

        const [action1, action2] = store.getActions();

        expect(action1.type).is.equal(HISTORY_METHOD_CALLED);
        expect(action2.type).is.equal(LOCATION_CHANGED);
        expect(action2.location.key).is.equal('aaa');
        expect(action2.location.pathname).is.equal('/aaa1/test-name');
        expect(action2.location.search).is.equal('?xxx=12');
        expect(action2.location.hash).is.equal('#kwjehfjkweh');
    });

    it('call history method with string', () => {
        const store = initStore({ routes: {} });
        store.dispatch(callHistoryMethod('/aa/bb/cc?x=1&y=2#123'));

        const [action1, action2] = store.getActions();

        expect(action1.type).is.equal(HISTORY_METHOD_CALLED);
        expect(action2.type).is.equal(LOCATION_CHANGED);
        expect(action2.location.key).is.equal(ROUTE_NOT_FOUND);
        expect(action2.location.pathname).is.equal('/aa/bb/cc');
        expect(action2.location.search).is.equal('?x=1&y=2');
        expect(action2.location.hash).is.equal('#123');
    });

    describe('history action', () => {
        it('push is default', () => {
            const store = initStore({ routes: {} });

            store.dispatch(callHistoryMethod('/xxx'));
            const [ 
                /* HISTORY_METHOD_CALLED */,
                action2  // LOCATION_CHANGED
            ] = store.getActions();

            expect(action2.action).is.equal('PUSH');
        });

        it('explicit push', () => {
            const store = initStore({ routes: {} });

            store.dispatch(callHistoryMethod('/xxx', { replace: false }));
            const [ 
                /* HISTORY_METHOD_CALLED */,
                action2  // LOCATION_CHANGED
            ] = store.getActions();

            expect(action2.action).is.equal('PUSH');
        });

        it('explicit replace', () => {
            const store = initStore({ routes: {} });

            store.dispatch(callHistoryMethod('/xxx', { replace: true }));
            const [ 
                /* HISTORY_METHOD_CALLED */,
                action2  // LOCATION_CHANGED
            ] = store.getActions();

            expect(action2.action).is.equal('REPLACE');
        });
    });

    describe('history state', () => {
        it('undefined by default', () => {
            const store = initStore({ routes: { } });

            store.dispatch(callHistoryMethod('/xxx'));
            const [ 
                /* HISTORY_METHOD_CALLED */,
                action2  // LOCATION_CHANGED
            ] = store.getActions();

            expect(action2.location.state).is.undefined;
        });

        it('known route', () => {
            const state = { a: 1 };
            const store = initStore({ routes: { aaa: '/xxx' } });

            store.dispatch(callHistoryMethod('/xxx', { state }));
            const [ 
                /* HISTORY_METHOD_CALLED */,
                action2  // LOCATION_CHANGED
            ] = store.getActions();

            expect(action2.location.key).is.eq('aaa');
            expect(action2.location.state).is.eq(state);
        });

        it('unknown route', () => {
            const state = { b: 2 };
            const store = initStore({ routes: { } });

            store.dispatch(callHistoryMethod('/yyy', { state }));
            const [ 
                /* HISTORY_METHOD_CALLED */,
                action2  // LOCATION_CHANGED
            ] = store.getActions();

            expect(action2.location.key).is.eq(ROUTE_NOT_FOUND);
            expect(action2.location.state).is.eq(state);
        });
    });
});
