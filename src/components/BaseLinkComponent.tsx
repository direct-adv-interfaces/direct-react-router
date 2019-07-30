import React from 'react';

import { callHistoryMethod, HistoryMethodCalledAction } from '../actions';
import { RouterConfig } from '../location';

function normalizeHref(href?: string): string {
    return href ? href.replace(/^\//, '') : '';
}

export interface BaseLinkDispatchProps {
    onNavigate: (url: string) => HistoryMethodCalledAction;
}

export const dispatchProps: BaseLinkDispatchProps = {
    onNavigate: (href: string): HistoryMethodCalledAction =>
        callHistoryMethod(href)
};

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export interface RouterContextData {
    config?: RouterConfig;
    basename?: string;
}

export const RouterContext = React.createContext<RouterContextData>({});

export type BaseLinkOwnProps =
    React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
    >;

export abstract class BaseLinkComponent<T> extends React.Component<T & BaseLinkOwnProps & BaseLinkDispatchProps> {
    static contextType = RouterContext;

    context!: React.ContextType<typeof RouterContext>;

    protected abstract getHref(): string;

    handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
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
            onNavigate(this.getHref()); // todo: memo
        }
    };

    getRenderHref() {
        const href = normalizeHref(this.getHref());
        const basename = normalizeHref(this.context.basename);

        return basename ? `/${basename}/${href}` : `/${href}`;
    }

    render() {
        const { children } = this.props;
        const href = this.getRenderHref();

        return (
            <a
                {...this.props}
                href={href}
                onClick={this.handleClick}
            >
                {children}
            </a>
        );
    }
}
