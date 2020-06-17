import { Action as HistoryAction, State as HistoryState } from 'history';

import { RouterLocation } from './location';
import { RouteArgs, HistoryMethodOptions } from './matchPath';

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
    state: HistoryState;
}

export function changeLocation(
    location: RouterLocation,
    action: HistoryAction = HistoryAction.Push
): LocationChangedAction {
    return {
        type: LOCATION_CHANGED,
        location,
        action
    };
}

export function callHistoryMethod(
    url: string | RouteArgs,
    options: HistoryMethodOptions = {}
): HistoryMethodCalledAction {
    const { replace = false, state = null } = options;

    return {
        type: HISTORY_METHOD_CALLED,
        url,
        replace,
        state
    };
}
