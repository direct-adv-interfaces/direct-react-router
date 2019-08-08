import { connect } from 'react-redux';

import { BaseLinkComponent, BaseLinkOwnProps, BaseLinkDispatchProps, dispatchProps } from './BaseLinkComponent';

import { RouteArgs } from '../matchPath';
import { generateUrl } from '../location';

interface AdvancedLinkOwnProps extends RouteArgs {

}

class AdvancedLinkComponent extends BaseLinkComponent<AdvancedLinkOwnProps> {
    protected getHref(): string {
        const { config } = this.context;

        if (!config) {
            throw new Error('Routes configuration is not specified');
        }

        return generateUrl(config, this.props);
    }
}

export const AdvancedLink = connect<{}, BaseLinkDispatchProps, AdvancedLinkOwnProps & BaseLinkOwnProps>(
    null,
    dispatchProps
)(AdvancedLinkComponent);
