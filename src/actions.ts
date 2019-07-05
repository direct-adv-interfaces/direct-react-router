import { RouterLocation } from './location';

// todo: заменить @@xxx
export const LOCATION_CHANGED = '@@xxx/LOCATION_CHANGED';
export type LOCATION_CHANGED = typeof LOCATION_CHANGED;

export const HISTORY_METHOD_CALLED = '@@xxx/HISTORY_METHOD_CALLED';
export type HISTORY_METHOD_CALLED = typeof HISTORY_METHOD_CALLED;

export interface LocationChangedAction {
    type: LOCATION_CHANGED;
    location: RouterLocation;
}

export interface HistoryMethodCalledAction {
    type: HISTORY_METHOD_CALLED;
    url: string;
}

export function changeLocation(
    location: RouterLocation
): LocationChangedAction {
    return {
        type: LOCATION_CHANGED,
        location
    };
}

export function callHistoryMethod(url: string): HistoryMethodCalledAction {
    return {
        type: HISTORY_METHOD_CALLED,
        url
    };
}
