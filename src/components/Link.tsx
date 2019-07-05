import React from 'react';
import { connect } from 'react-redux';

import { callHistoryMethod, HistoryMethodCalledAction } from '../actions';
import { Params } from '../matchPath';
import { RouterConfig } from '..';
import { generatePath } from '../generatePath';

interface OwnProps {
    target?: string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

abstract class BaseLinkComponent<T> extends React.Component<T & OwnProps & DispatchProps> {

    protected abstract getDisplayLink(): string;

    protected abstract getNavigationLink(): string;

    handleClick = (event: React.MouseEvent<HTMLElement>) => {
        const { target, onClick, onNavigate } = this.props;

        if (onClick) {
            onClick(event);
        }

        if (
            !event.defaultPrevented && // onClick prevented default
            event.button === 0 && // ignore everything but left clicks
            (!target || target === '_self') && // let browser handle "target=_blank" etc.
            !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
            event.preventDefault();
            onNavigate(this.getNavigationLink());
        }
    };

    render() {
        const { target, className, children } = this.props;

        return (
            <a
                className={className}
                href={this.getDisplayLink()}
                target={target}
                onClick={this.handleClick}
            >
                {children}
            </a>
        );
    }
}

interface LinkOwnProps {
    href: string;
}

class LinkComponent extends BaseLinkComponent<LinkOwnProps> {
    protected getDisplayLink(): string {
        return this.props.href;
    }

    protected getNavigationLink(): string {
        return this.props.href;
    }
}

interface DispatchProps {
    onNavigate: (url: string) => HistoryMethodCalledAction;
}

const dispatchProps: DispatchProps = {
    onNavigate: (href: string): HistoryMethodCalledAction => callHistoryMethod(href)
}

export const Link = connect<{}, DispatchProps, LinkOwnProps & OwnProps>(
    null,
    dispatchProps
)(LinkComponent);

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
        const path = this.context.config.routes[routeKey];

        return generatePath(path, params);
    }

    protected getNavigationLink(): string {
        return this.getDisplayLink();
    }
}

export const AdvancedLink = connect<{}, DispatchProps, AdvancedLinkOwnProps & OwnProps>(
    null,
    dispatchProps
)(AdvancedLinkComponent);
