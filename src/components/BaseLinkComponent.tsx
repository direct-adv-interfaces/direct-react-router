import React from 'react';

import { callHistoryMethod, HistoryMethodCalledAction } from '../actions';
import { RouterConfig } from '../location';
import { HistoryMethodOptions } from '../matchPath';

// helpers
function normalizeHref(href?: string): string {
    return href ? href.replace(/^\//, '') : '';
}

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

// context
export interface RouterContextData {
    config?: RouterConfig;
    basename?: string;
}

export const RouterContext = React.createContext<RouterContextData>({});

// component props
export type BaseLinkOwnProps = HistoryMethodOptions & {
    target?: string;
    className?: string;
    attrs?: { [key: string]: string | number };
    dangerouslySetInnerHTML?: { __html: string };
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export interface BaseLinkDispatchProps {
    onNavigate: (url: string, options: HistoryMethodOptions) => HistoryMethodCalledAction;
}

export const dispatchProps: BaseLinkDispatchProps = {
    onNavigate: (href: string, options: HistoryMethodOptions): HistoryMethodCalledAction =>
        callHistoryMethod(href, options)
};

export abstract class BaseLinkComponent<T> extends React.Component<
    T & BaseLinkOwnProps & BaseLinkDispatchProps
> {
    static contextType = RouterContext;

    context!: React.ContextType<typeof RouterContext>;

    protected abstract getHref(): string;

    handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        const { target, onClick, onNavigate, replace, state } = this.props;

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
            onNavigate(this.getHref(), { replace, state }); // todo: memo
        }
    };

    getRenderHref() {
        const href = normalizeHref(this.getHref());
        const basename = normalizeHref(this.context.basename);

        return basename ? `/${basename}/${href}` : `/${href}`;
    }

    render() {
        const { attrs, children, className, target, dangerouslySetInnerHTML } = this.props;
        const href = this.getRenderHref();

        const props:any = {
            ...attrs,
            href, className, target
        };

        dangerouslySetInnerHTML && (props.dangerouslySetInnerHTML = dangerouslySetInnerHTML);

        return (
            <a {...props} onClick={this.handleClick}>
                {children}
            </a>
        );
    }
}
