// react
import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

// app
import ENV from '../environment/index';
import Home from './system/frame/home/Home';
import Component404 from './system/frame/404/Component404';

class AppRouter extends Component {
	render() {
		return (
			<Switch>
				<Route exact path={ENV.ROUTING.HOME} component={Home}/>
				<Route exact from="*" component={Component404}/>
			</Switch>
		);
	}
}

export default withRouter(AppRouter);
