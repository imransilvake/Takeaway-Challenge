// react
import React from 'react';
// import { Provider } from 'react-redux';

// app
import Game from './index';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

describe('<Game>', () => {
	const initialState = {};
	const mockStore = configureStore();
	const store = mockStore(initialState);

	it('should render Game scene without errors', () => {
		shallow(<Game />);
	});

	it('should have a component wrapper class', () => {
		// const wrapper = shallow(<Provider store={store}> <Game /> </Provider>).dive();
		// expect(wrapper.find('.tc-game').length).toBe(1);
	});

	// todo
});