import { connect } from 'react-redux';

import { BaseLinkComponent, BaseLinkOwnProps, BaseLinkDispatchProps, dispatchProps } from './BaseLinkComponent';

interface LinkOwnProps {
    href: string;
}

class LinkComponent extends BaseLinkComponent<LinkOwnProps> {
    protected getHref(): string {
        return this.props.href;
    }
}

export const Link = connect<{}, BaseLinkDispatchProps, LinkOwnProps & BaseLinkOwnProps>(
    null,
    dispatchProps
)(LinkComponent);
