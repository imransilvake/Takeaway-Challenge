// react
import React, { Component } from 'react';

// app
import Button from "@material-ui/core/Button";
import PlayerImage from '../../../../assets/images/player-dp.png';
import CPUImage from '../../../../assets/images/cpu-dp.png';
import i18n from '../../../../assets/i18n/i18n';

class Game extends Component {
	state = {
		number: 0
	};

	componentDidMount() {
		this.addGameListener();
	}

	render() {
		const { number } = this.state;

		return (
			<section className="tc-game tc-view-height">
				{/* Notice */}
				<div className="tc-alert">
					<p>{i18n.t('GAME.ALERT')}</p>
				</div>

				{/* Moves */}
				<div className="tc-moves">
					<div className="tc-user">
						<img className="tc-avatar" src={PlayerImage} alt="player"/>
						<div className="tc-desc">
							<h5>+1</h5>
							<p>[(+1 + 20)/3] = 7</p>
							<p>7</p>
						</div>
					</div>
					<div className="tc-user tc-opponent">
						<img className="tc-avatar" src={CPUImage} alt="cpu"/>
						<div className="tc-desc">
							<h5>+1</h5>
							<p>[(+1 + 20)/3] = 7</p>
							<p>7</p>
						</div>
					</div>

				</div>

				{/* Buttons */}
				<div className="tc-buttons">
					<Button>-1</Button>
					<Button>0</Button>
					<Button>+1</Button>
				</div>
			</section>
		);
	}

	addGameListener = () => {
		// generate random number
		this.generateRandomNumber();

	};

	/**
	 * generate random whole number between 100 - 5000
	 */
	generateRandomNumber = () => {
		const randomNumber = Math.floor(Math.random() * 5000) + 100;

		// set state
		this.setState({ number: randomNumber })
	}
}

export default Game;