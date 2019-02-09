// react
import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

// app
import ENV from '../environment/index';
import Home from './system/frame/home/Home';
import Game from './system/core/game/Game';
import Logs from './system/frame/logs/Logs';
import Redirect from 'react-router-dom/es/Redirect';
import { withTranslation } from 'react-i18next';

class AppRouter extends Component {
	render() {
		return (
			<Switch>
				<Route exact path={ENV.ROUTING.HOME} component={Home}/>
				<Route exact path={ENV.ROUTING.LOGS} component={Logs}/>
				<Route
					path={ENV.ROUTING.HOME}
					render={props => (
						this.props.gameState.start
							? (<Game {...props} gameState={this.props.gameState}/>) : (<Redirect to={ENV.ROUTING.HOME}/>)
					)}/>
			</Switch>
		);
	}
}

// props
const mapStateToProps = state => ({
	gameState: state.game
});

export default withTranslation()(withRouter(connect(mapStateToProps)(AppRouter)))
