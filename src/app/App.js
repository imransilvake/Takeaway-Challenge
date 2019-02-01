// react
import React, { Component } from 'react';
import BrowserRouter from 'react-router-dom/es/BrowserRouter';

// redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// app
import AppRouter from './AppRouter';
import Header from "./system/frame/header/Header";
import Footer from "./system/frame/footer/Footer";

// redux store
const store = createStore(() => {}, composeWithDevTools());

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<React.Fragment>
						<section className="tc-app">
							{/* Header */}
							<Header/>

							{/* Router */}
							<AppRouter/>

							{/* Footer */}
							<Footer/>
						</section>
					</React.Fragment>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
