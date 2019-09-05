import { Action as HistoryAction } from 'history';

import { RouterLocation } from './location';
import { RouteArgs } from './matchPath';

export const LOCATION_CHANGED = '@@direct-react-router/LOCATION_CHANGED';
export type LOCATION_CHANGED = typeof LOCATION_CHANGED;

export const HISTORY_METHOD_CALLED =
    '@@direct-react-router/HISTORY_METHOD_CALLED';
export type HISTORY_METHOD_CALLED = typeof HISTORY_METHOD_CALLED;

export interface LocationChangedAction {
    type: LOCATION_CHANGED;
    location: RouterLocation;
    action: HistoryAction;
}

export interface HistoryMethodCalledAction {
    type: HISTORY_METHOD_CALLED;
    url: string | RouteArgs;
    replace: boolean;
    state?: any;
}

export function changeLocation(
    location: RouterLocation,
    action: HistoryAction = 'PUSH'
): LocationChangedAction {
    return {
        type: LOCATION_CHANGED,
        location,
        action
    };
}

export function callHistoryMethod(
    url: string | RouteArgs,
    options: { replace?: boolean; state?: any } = {}
): HistoryMethodCalledAction {
    const { replace = false, state} = options;

    return {
        type: HISTORY_METHOD_CALLED,
        url,
        replace,
        state
    };
}
