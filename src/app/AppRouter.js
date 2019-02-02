// react
import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

// app
import ENV from '../environment/index';
import Component404 from './system/frame/404/Component404';
import Home from './system/frame/home/Home';
import Game from "./system/core/game/Game";

class AppRouter extends Component {
	componentWillMount() {
		console.log(this.props.location);
	}

	render() {
		return (
			<Switch>
				<Route exact path={ENV.ROUTING.HOME} component={Home}/>
				<Route exact path={ENV.ROUTING.GAME} component={Game}/>
				<Route from="*" component={Component404}/>
			</Switch>
		);
	}
}

export default withRouter(AppRouter);
