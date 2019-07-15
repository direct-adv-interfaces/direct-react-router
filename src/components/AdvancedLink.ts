import React from 'react';
import { connect } from 'react-redux';

import { BaseLinkComponent, BaseLinkOwnProps, BaseLinkDispatchProps, dispatchProps } from './BaseLinkComponent';

import { Params } from '../matchPath';
import { RouterConfig } from '..';
import { generatePath } from '../generatePath';

interface AdvancedLinkOwnProps {
    routeKey: string;
    params?: Params;
}

export interface RouterContextData {
    config?: RouterConfig;
}

export const RouterContext = React.createContext<RouterContextData>({});

class AdvancedLinkComponent extends BaseLinkComponent<AdvancedLinkOwnProps> {
    static contextType = RouterContext;

    context!: React.ContextType<typeof RouterContext>

    protected getDisplayLink(): string {
        if (!this.context.config) {
            throw new Error(); // todo: add error info
        }

        const { routeKey, params }  = this.props;
        const [path] = this.context.config.routes
            .filter(r => r.key === routeKey)
            .map(r => r.route); // todo: memo

        return generatePath(path, params);
    }

    protected getNavigationLink(): string {
        return this.getDisplayLink();
    }
}

export const AdvancedLink = connect<{}, BaseLinkDispatchProps, AdvancedLinkOwnProps & BaseLinkOwnProps>(
    null,
    dispatchProps
)(AdvancedLinkComponent);
