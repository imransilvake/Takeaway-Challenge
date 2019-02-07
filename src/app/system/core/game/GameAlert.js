// react
import React, { Component } from 'react';

// app
import i18n from '../../../../assets/i18n/i18n';

class GameAlert extends Component {
	state = {
		timer: 10
	};

	componentWillUnmount() {
		// clear timer
		this.clearTimer(this.timer);
	}

	render() {
		const { timer } = this.state;
		const { gameState, firstPlayer, secondPlayer, even, odd } = this.props;

		// set turn based on game mode
		let turn = odd;
		if (gameState.type !== 'cpu') {
			turn = (!odd && !firstPlayer) || (!even && !secondPlayer);
		}

		// set player names
		let opponentName = 'CPU';
		if (gameState.type !== 'cpu') {
			opponentName = 'Player';
		}

		return (
			<section className="tc-game-alert cd-center-align">
				<p>{i18n.t('GAME.ALERT', { name: !turn ? 'Your' : opponentName, time: timer })}</p>
			</section>
		)
	}

	/**
	 * start timer
	 */
	startTimer = () => {
		const startTime = Date.now();
		const counter = 10;
		this.timer = setInterval(() => {
			const seconds = Math.round((Date.now() - startTime) / 1000);

			// set timer
			this.setState({ timer: counter - seconds });

			// validate user status
			if (seconds === counter) {
				// clear timer
				this.clearTimer(this.timer);

				// end game
				this.props.endGame();
			}
		}, 1000);
	};

	/**
	 * restart timer
	 */
	restartTimer = () => {
		// clear timer
		this.clearTimer(this.timer);

		// start timer
		this.startTimer();
	};

	/**
	 * clear timer
	 */
	clearTimer = (timer) => {
		clearInterval(timer);
	};
}

export default GameAlert;
