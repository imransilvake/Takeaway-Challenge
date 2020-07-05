// react
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

// app
import i18n from '../../../assets/i18n/i18n';
import ENV from '../../../environment';
import Button from '../../components/Button';
import { startGame } from '../../store/Game/actions';

class Home extends Component {
	render() {
		const { location } = this.props;

		return (
			<section className="tc-home tc-position-fixed tc-normal">
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
							<Button
								className="tc-button-style-two"
								onClick={this.startGame('cpu')}>
								{i18n.t('HOME.BUTTONS.CPU')}
							</Button>
						</Link>
						<Link to={ENV.ROUTING.GAME}>
							<Button
								className="tc-button-style-two"
								onClick={this.startGame('player')}>
								{i18n.t('HOME.BUTTONS.REAL')}
							</Button>
						</Link>
					</div>
					<div className="tc-logs">
						{
							!location.state && (
								<Link to={ENV.ROUTING.LOGS}>
									<Button className="tc-button-style-three">
										{i18n.t('HOME.BUTTONS.LOGS')}
									</Button>
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

// dispatch
const mapDispatchToProps = (dispatch) => {
	return ({
		startGame: data => dispatch(startGame(data))
	})
};

export default withTranslation()(connect(null, mapDispatchToProps)(Home));
