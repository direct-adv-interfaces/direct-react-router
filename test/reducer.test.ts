import { describe, it } from 'mocha';
import { expect } from 'chai';

import { createRoutingReducer, LOCATION_CHANGED, LocationChangedAction } from '../src';

describe('reducer', () => {
    it('takes initial location from history', () => {
        const reducer = createRoutingReducer({ routes: {} }, { pathname: '/ajfhgaj', search: '', hash: '', state: undefined });

        const initialState = reducer(undefined, { type: 'INIT' });

        expect(initialState.current.pathname).to.eq('/ajfhgaj');
        expect(initialState.previous).is.undefined;
    });

    it('use prev state from current', () => {
        const reducer = createRoutingReducer({ routes: {} }, { pathname: '/zxcv', search: '', hash: '', state: undefined });

        const initialState = reducer(undefined, { type: 'INIT' });
        const newState = reducer(initialState, { 
            type: LOCATION_CHANGED,
            location: { key: 'aaa', pathname: '/qererr' },
            action: 'PUSH'
        } as LocationChangedAction);

        expect(newState.current.pathname).to.eq('/qererr');
        expect(newState.previous!.pathname).to.eq('/zxcv');
    });

    it('don\'t change state when loaction is no changed', () => {
        const reducer = createRoutingReducer({ routes: {} }, { pathname: '/zxcv', search: '', hash: '', state: undefined });

        const initialState = reducer(undefined, { type: 'INIT' });
        const newState = reducer(initialState, { type: LOCATION_CHANGED + 1 });

        expect(newState.current.pathname).to.eq('/zxcv');
        expect(newState.previous).is.undefined;
    });
});