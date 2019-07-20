import React from 'react';
import { connect } from 'react-redux';

import { BaseLinkComponent, BaseLinkOwnProps, BaseLinkDispatchProps, dispatchProps } from './BaseLinkComponent';

import { RouteArgs } from '../matchPath';
import { generateUrl } from '../location';
import { RouterConfig } from '..';


interface AdvancedLinkOwnProps extends RouteArgs {

}

export interface RouterContextData {
    config?: RouterConfig;
}

export const RouterContext = React.createContext<RouterContextData>({});

class AdvancedLinkComponent extends BaseLinkComponent<AdvancedLinkOwnProps> {
    static contextType = RouterContext;

    context!: React.ContextType<typeof RouterContext>

    protected getHref(): string {
        const { config } = this.context;

        if (!config) {
            throw new Error(); // todo: add error info
        }

        return generateUrl(config, this.props);
    }
}

export const AdvancedLink = connect<{}, BaseLinkDispatchProps, AdvancedLinkOwnProps & BaseLinkOwnProps>(
    null,
    dispatchProps
)(AdvancedLinkComponent);
