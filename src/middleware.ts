import {
    Middleware,
    MiddlewareAPI,
    Action as ReduxAction,
    Dispatch,
    Store
} from 'redux';
import { History, Location as HistoryLocation } from 'history';

import { RouterConfig, parseLocation } from './location';
import {
    HistoryMethodCalledAction,
    HISTORY_METHOD_CALLED,
    changeLocation
} from './actions';

export const createRoutingMiddleware = (
    config: RouterConfig,
    history: History
): Middleware => {
    return (store: MiddlewareAPI<Dispatch, Store>) => {
        // todo: when to unsubscribe?
        history.listen((location: HistoryLocation) => {
            const parsed = parseLocation(config, location);
            store.dispatch(changeLocation(parsed));
        });

        return (next: Dispatch) => {
            return (action: ReduxAction) => {
                const result = next(action);

                if (action.type === HISTORY_METHOD_CALLED) {
                    const { url } = action as HistoryMethodCalledAction;
                    history.push(url); // todo: поддержать остальные методы, кроме push
                }

                return result;
            };
        };
    };
};
