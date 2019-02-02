// react
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// app
import Button from '@material-ui/core/Button';
import i18n from '../../../../assets/i18n/i18n';
import ENV from '../../../../environment/index';
import { startGame } from '../../../store/actions/GameAction';

class Home extends Component {
	render() {
		return (
			<section className="tc-home tc-view-height">
				<div className="cd-vh-center cd-center-align tc-center">
					<h4>{i18n.t('HOME.TITLE')}</h4>
					<p>{i18n.t('HOME.SUBTITLE')}</p>
					<div className="tc-buttons">
						<Link to={ENV.ROUTING.GAME}>
							<Button onClick={this.startGame('cpu')}>{i18n.t('HOME.BUTTONS.CPU')}</Button>
							<Button onClick={this.startGame('player')}>{i18n.t('HOME.BUTTONS.REAL')}</Button>
						</Link>
					</div>
				</div>
			</section>
		);
	}

	/**
	 * start game
	 */
	startGame = type => () => {
		// set redux state
		this.props.startGame(type);
	}
}

export default connect(null, { startGame })(Home);
