import React from 'react';

import { callHistoryMethod, HistoryMethodCalledAction } from '../actions';
import { RouterConfig } from '../location';

export interface BaseLinkDispatchProps {
    onNavigate: (url: string) => HistoryMethodCalledAction;
}

export const dispatchProps: BaseLinkDispatchProps = {
    onNavigate: (href: string): HistoryMethodCalledAction => callHistoryMethod(href)
}

export interface BaseLinkOwnProps {
    target?: string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export interface RouterContextData {
    config?: RouterConfig;
    basename?: string
}

export const RouterContext = React.createContext<RouterContextData>({});

export abstract class BaseLinkComponent<T> extends React.Component<T & BaseLinkOwnProps & BaseLinkDispatchProps> {
    static contextType = RouterContext;

    context!: React.ContextType<typeof RouterContext>

    protected abstract getHref(): string;

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
            onNavigate(this.getHref()); // todo: memo
        }
    };

    render() {
        const { target, className, children } = this.props;
        const href = this.getHref();

        return (
            <a
                className={className}
                href={href}
                target={target}
                onClick={this.handleClick}
            >
                {children}
            </a>
        );
    }
}