import {
    Middleware,
    MiddlewareAPI,
    Action as ReduxAction,
    Dispatch,
    Store
} from 'redux';
import { History, Location as HistoryLocation, Action as HistoryAction } from 'history';

import { RouterConfig, parseLocation, generateUrl } from './location';
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
        history.listen((location: HistoryLocation, action: HistoryAction) => {
            const parsed = parseLocation(config, location);
            store.dispatch(changeLocation(parsed, action));
        });

        return (next: Dispatch) => {
            return (action: ReduxAction) => {
                const result = next(action);

                if (action.type === HISTORY_METHOD_CALLED) {
                    const { url, replace, state } = action as HistoryMethodCalledAction;
                    const href: string = typeof url === 'string'
                        ? url
                        : generateUrl(config, url);

                    if (replace) {
                        history.replace(href, state);
                    } else {
                        history.push(href, state);
                    }
                }

                return result;
            };
        };
    };
};
