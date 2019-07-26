import React from 'react';

import { Provider } from 'react-redux';
import { mount  } from 'enzyme';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store'

import { Link } from '../../src';

const mockStore = configureMockStore();

function render2(node: React.ReactNode) {
    const store = mockStore();
    const link = mount(<Provider store={store}>{node}</Provider>);

    return { link, store };
}

// базовый путь
// генерируется action по клику

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
});
