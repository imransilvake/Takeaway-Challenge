// react
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';

// firebase
import firebase from './firebase';

// app
import AppRouter from './AppRouter';
import Header from './app/scenes/Common/Header';
import Footer from './app/scenes/Common/Footer';
import rootReducer from './app/store';

// store with firebase
const middleware = [ReduxThunk.withExtraArgument({ getFirebase })];
const store = createStore(rootReducer, composeWithDevTools(
	applyMiddleware(...middleware),
	reactReduxFirebase(firebase)
));

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<React.Fragment>
						<Header/>

						<AppRouter/>

						<Footer/>
					</React.Fragment>
				</Router>
			</Provider>
		);
	}
}

export default App;
