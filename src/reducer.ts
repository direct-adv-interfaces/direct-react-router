import { Location } from 'history';
import { RouterConfig, RouterLocation, parseLocation } from './location';

import { LocationChangedAction, LOCATION_CHANGED } from './actions';
import { Reducer, Action as ReduxAction } from 'redux';

export interface RouterState {
    current: RouterLocation;
    previous?: RouterLocation;
}

export function createRoutingReducer(
    config: RouterConfig,
    location: Location
): Reducer<RouterState, ReduxAction> {
    const initialLocation = parseLocation(config, location);

    return function(
        state: RouterState = { current: initialLocation },
        action: ReduxAction
    ): RouterState {

        if (action.type !== LOCATION_CHANGED) {
            return state;
        }

        return {
            current: (action as LocationChangedAction).location,
            previous: state.current
        };
    };
}
