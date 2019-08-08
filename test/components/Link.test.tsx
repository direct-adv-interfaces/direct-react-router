import React from 'react';

import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';

import { Link, RouterContext } from '../../src';

const mockStore = configureMockStore();

function render2(node: React.ReactNode) {
    const store = mockStore();
    const link = mount(<Provider store={store}>{node}</Provider>);

    return { link, store };
}

describe('Link', () => {
    describe('parameters', () => {
        it('proper content', () => {
            const { link } = render2(<Link href="/aaa">ggghhhjjjjkkk</Link>);

            expect(link.getDOMNode().innerHTML).is.eq('ggghhhjjjjkkk');
        });

        it('proper html content', () => {
            const { link } = render2(<Link 
                href="/aaa" 
                dangerouslySetInnerHTML={{
                    __html: '<strong>123</strong>'
                }}/>);

            expect(link.getDOMNode().innerHTML).is.eq('<strong>123</strong>');
        });

        it('proper href', () => {
            const { link } = render2(<Link href="/aaa">111</Link>);

            expect(link.getDOMNode().getAttribute('href')).is.eq('/aaa');
        });

        it('proper attributes', () => {
            const { link } = render2(
                <Link
                    href="/aaa"
                    className="action"
                    target="fdasgsgs"
                    attrs={{
                        id: 123,
                        xxx: 'yyy',
                        'aria-label': 'test1'
                    }}
                />
            );

            // base
            expect(link.getDOMNode().getAttribute('class')).is.eq('action');
            expect(link.getDOMNode().getAttribute('target')).is.eq('fdasgsgs');

            // custom
            expect(link.getDOMNode().getAttribute('id')).is.eq('123');
            expect(link.getDOMNode().getAttribute('xxx')).is.eq('yyy');
            expect(link.getDOMNode().getAttribute('aria-label')).is.eq('test1');
        });
    });

    describe('basename', () => {

        it('render url with basename', () => {
            const { link } = render2(
                <RouterContext.Provider value={{ basename: 'mimi1' }}>
                    <Link href="/bbb" />
                </RouterContext.Provider>
            );

            expect(link.getDOMNode().getAttribute('href')).is.eq('/mimi1/bbb');
        });

        it("action's url without basename", () => {
            const { link, store } = render2(
                <RouterContext.Provider value={{ basename: 'mimi2' }}>
                    <Link href="/ccc" />
                </RouterContext.Provider>
            );

            link.simulate('click', { button: 0 });
            const [action] = store.getActions();

            expect(action.url).is.eq('/ccc');
        });
    });

    describe('click handler', () => {
        it('proper action', () => {
            const { link, store } = render2(<Link href="/aaa" />);

            link.simulate('click', { button: 0 });
            const [action] = store.getActions();

            expect(action.type).is.eq(
                '@@direct-react-router/HISTORY_METHOD_CALLED'
            );
            expect(action.url).is.eq('/aaa');
        });

        it('handler runs on click', () => {
            let event: any;
            const { link } = render2(<Link 
                href="/aaa" 
                onClick={(e) => { event = e }} />);
    
            link.simulate('click', { button: 0, clientX: 12, clientY: 14 });
            
            expect(event.button).is.eq(0);
            expect(event.clientX).is.eq(12);
            expect(event.clientY).is.eq(14);
        });

        it('action not fired when preventDefault is called', () => {
            const { link, store } = render2(<Link 
                href="/aaa" 
                onClick={(e) => { e.preventDefault(); }} />);
    
            link.simulate('click', { button: 0 });
            const actions = store.getActions();
            
            expect(actions).is.empty;
        });

        it('fire action on left button click', () => {
            const { link, store } = render2(<Link href="/aaa0" />);

            link.simulate('click', { button: 0 });
            const [action] = store.getActions();

            expect(action.url).is.eq('/aaa0');
        });

        it('don\'t fire action on middle button click', () => {
            const { link, store } = render2(<Link href="/aaa1" />);

            link.simulate('click', { button: 1 });
            const actions = store.getActions();

            expect(actions).is.empty;
        });

        it('don\'t fire action on right button click', () => {
            const { link, store } = render2(<Link href="/aaa2" />);

            link.simulate('click', { button: 2 });
            const actions = store.getActions();

            expect(actions).is.empty;
        });

        it('don\'t fire action when link has target', () => {
            const { link, store } = render2(<Link href="/bbb" target="zzzz" />);

            link.simulate('click', { button: 0 });
            const actions = store.getActions();

            expect(actions).is.empty;
        });

        it('fire action when link target is \'_self\'', () => {
            const { link, store } = render2(<Link href="/ccc" target="_self" />);

            link.simulate('click', { button: 0 });
            const [action] = store.getActions();

            expect(action.url).is.eq('/ccc');
        });

        it('don\'t fire action when Alt key is pressed', () => {
            const { link, store } = render2(<Link href="/vvv1" />);

            link.simulate('click', { button: 0, altKey: true });
            const actions = store.getActions();

            expect(actions).is.empty;
        });

        it('don\'t fire action when Ctrl key is pressed', () => {
            const { link, store } = render2(<Link href="/vvv2" />);

            link.simulate('click', { button: 0, ctrlKey: true });
            const actions = store.getActions();

            expect(actions).is.empty;
        });

        it('don\'t fire action when Shift key is pressed', () => {
            const { link, store } = render2(<Link href="/vvv3" />);

            link.simulate('click', { button: 0, shiftKey: true });
            const actions = store.getActions();

            expect(actions).is.empty;
        });

        it('don\'t fire action when meta key is pressed', () => {
            const { link, store } = render2(<Link href="/vvv4" />);

            link.simulate('click', { button: 0, metaKey: true });
            const actions = store.getActions();

            expect(actions).is.empty;
        });
    });
});
