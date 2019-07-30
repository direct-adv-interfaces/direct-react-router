import React from 'react';

import { Provider } from 'react-redux';
import { mount  } from 'enzyme';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store'

import { Link, RouterContext } from '../../src';

const mockStore = configureMockStore();

function render2(node: React.ReactNode) {
    const store = mockStore();
    const link = mount(<Provider store={store}>{node}</Provider>);

    return { link, store };
}

describe('Link', () => {
    it('proper href', () => {
        const { link } = render2(<Link href='/aaa'>111</Link>);

        expect(link.getDOMNode().getAttribute('href')).is.eq('/aaa');
    });

    it('proper action', () => {
        const { link, store } = render2(<Link href='/aaa' />);

        link.simulate('click', { button: 0 });
        const [action] = store.getActions();

        expect(action.type).is.eq('@@direct-react-router/HISTORY_METHOD_CALLED');
        expect(action.url).is.eq('/aaa');
    });

    it('render url with basename', () => {
        const { link } = render2(<RouterContext.Provider value={{ basename: 'mimi1' }}>
            <Link href='/bbb' />
        </RouterContext.Provider>);

        expect(link.getDOMNode().getAttribute('href')).is.eq('/mimi1/bbb');
    });

    it('action\'s url without basename', () => {
        const { link, store } = render2(<RouterContext.Provider value={{ basename: 'mimi2' }}>
            <Link href='/ccc' />
        </RouterContext.Provider>);

        link.simulate('click', { button: 0 });
        const [action] = store.getActions();

        expect(action.url).is.eq('/ccc');
    });

    it('proper attributes', () => {
        const { link } = render2(<Link 
            href='/aaa' 
            className='action' 
            id='123' 
            dangerouslySetInnerHTML={{
                __html: '<strong>123</strong>'
            }}
            target='fdasgsgs' />);

        expect(link.html()).is.eq('/aaa');
    });

});
