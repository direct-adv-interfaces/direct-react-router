import { Location } from 'history';
import { RouterConfig, RouterLocation, parseLocation } from './location';

import { LocationChangedAction, LOCATION_CHANGED } from './actions';
import { Reducer, Action as ReduxAction } from 'redux';

export function createRoutingReducer(
    config: RouterConfig,
    location: Location
): Reducer<RouterLocation, ReduxAction> {
    const initialLocation = parseLocation(config, location);

    return function(
        state: RouterLocation = initialLocation,
        action: ReduxAction
    ): RouterLocation {
        return action.type === LOCATION_CHANGED
            ? (action as LocationChangedAction).location
            : state;
    };
}
