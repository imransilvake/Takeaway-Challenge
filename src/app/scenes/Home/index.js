// react
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// app
import i18n from '../../../assets/i18n/i18n';
import ENV from '../../../environment';
import ButtonCustom from '../../components/Button';
import { startGame } from '../../store/Game/actions';

class Home extends Component {
	render() {
		const { location } = this.props;

		return (
			<section className="tc-home tc-view-height">
				<div className="cd-vh-center cd-center-align tc-center">
					<h4>
						{!location.state && i18n.t('HOME.TITLE')}
						{location.state && location.state.result && i18n.t('HOME.RESULT.WINNER.TITLE')}
						{location.state && !location.state.result && i18n.t('HOME.RESULT.LOSER.TITLE')}
					</h4>
					<p>
						{!location.state && i18n.t('HOME.SUBTITLE')}
						{location.state && location.state.result && i18n.t('HOME.RESULT.WINNER.SUBTITLE')}
						{location.state && !location.state.result && i18n.t('HOME.RESULT.LOSER.SUBTITLE')}
					</p>
					{
						location.info && location.info.busy && (<p className="ts-busy">{i18n.t('HOME.STATUS.BUSY')}</p>)
					}
					<div className="tc-buttons">
						<Link to={ENV.ROUTING.GAME}>
							<ButtonCustom
								className="tc-button-style-two"
								onClick={this.startGame('cpu')}>
								{i18n.t('HOME.BUTTONS.CPU')}
							</ButtonCustom>
						</Link>
						<Link to={ENV.ROUTING.GAME}>
							<ButtonCustom
								className="tc-button-style-two"
								onClick={this.startGame('player')}>
								{i18n.t('HOME.BUTTONS.REAL')}
							</ButtonCustom>
						</Link>
					</div>
					<div className="tc-logs">
						{
							!location.state && (
								<Link to={ENV.ROUTING.LOGS}>
									<ButtonCustom className="tc-button-style-three">
										{i18n.t('HOME.BUTTONS.LOGS')}
									</ButtonCustom>
								</Link>
							)
						}
					</div>
				</div>
				<div className="tc-additional">
					{!location.state && (<p>{i18n.t('HOME.ADDITION.NOTE')}</p>)}
					{location.state && (<Link to={ENV.ROUTING.HOME}>{i18n.t('HOME.ADDITION.TITLE')}</Link>)}
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
