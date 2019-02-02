// react
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';

// firebase
import firebase from '../../../../firebase';

// app
import PlayerImage from '../../../../assets/images/player-dp.png';
import CPUImage from '../../../../assets/images/cpu-dp.png';
import i18n from '../../../../assets/i18n/i18n';
import { updateGame } from '../../../store/actions/GameAction';

class Game extends Component {
	state = {
		gameRef: firebase.database().ref('game'),
		history: [],
		userTurn: true,
		allowedNumber: 0,
		finalOutcome: false
	};

	componentDidMount() {
		this.addGameListener();

		// create element ref
		this.myRef = React.createRef();
	}

	componentWillUnmount() {
		const { gameRef } = this.state;
		const { gameState } = this.props;

		// remove live listener
		gameRef.child(gameState.type).off();
	}

	render() {
		const { history, userTurn, allowedNumber, finalOutcome } = this.state;

		return (
			<section className="tc-game tc-view-height">
				{/* Notice */}
				<div className="tc-alert">
					<p>{i18n.t('GAME.ALERT', { type: userTurn ? 'Your' : 'CPU' })}</p>
				</div>

				{/* Moves */}
				<div className="tc-moves">
					{
						history && history.length && history.map((item, i) => (
							<div key={i} className={!item.userTurn ? 'tc-user' : 'tc-user tc-opponent'}>
								<img className="tc-avatar" src={!item.userTurn ? PlayerImage : CPUImage} alt="cpu"/>
								<div className="tc-desc">
									{ item.action && (<h5>{item.action}</h5>) }
									{ item.action && (<p>[({item.action} + {history[i - 1] && history[i - 1].number}) / 3] = {item.number}</p>) }
									<p ref={history.length - 1 === i ? this.myRef : null}>{item.number}</p>
								</div>
							</div>
						))
					}
				</div>

				{/* Buttons */}
				<div className="tc-buttons">
					<Button
						disabled={!userTurn || allowedNumber !== '-1' || finalOutcome}
						onClick={() => this.addNextMove('-1')}>-1
					</Button>
					<Button
						disabled={!userTurn || allowedNumber !== '0' || finalOutcome}
						onClick={() => this.addNextMove('0')}>0
					</Button>
					<Button
						disabled={!userTurn || allowedNumber !== '+1' || finalOutcome}
						onClick={() => this.addNextMove('+1')}>+1
					</Button>
				</div>
			</section>
		);
	}

	/**
	 * add game listener
	 */
	addGameListener = () => {
		// init game
		this.init();

		// add firebase real-time listener
		this.addFirebaseRealTimeListener();
	};

	/**
	 * generate random whole number between 100 - 5000
	 */
	init = () => {
		const randomNumber = Math.floor(Math.random() * 5000) + 100;
		this.updateData(randomNumber);
	};

	/**
	 * add firebase real-time listener
	 */
	addFirebaseRealTimeListener = () => {
		const { gameRef } = this.state;
		const { gameState } = this.props;

		// game ref
		gameRef
			.child(gameState.type)
			.on('value', (snap) => {
				if (snap.exists()) {
					const data = snap.val();

					// turn: cpu
					if (!data.history.userTurn && data.history.number > 1) {
						// evaluate to true if the variable is divisible by 3
						this.addNextMove(this.validateNumberForNextMove(data.history.number));
					}
				}
			})
	};

	/**
	 * evaluate to true if the variable is divisible by 3
	 *
	 * @param num
	 * @returns {string}
	 */
	validateNumberForNextMove = (num) => {
		let value = '-1';
		if (num % 3 === 0) {
			value = '0'
		} else if ((num + 1) % 3 === 0) {
			value = '+1';
		}

		return value;
	};

	/**
	 * add next move
	 *
	 * @param action
	 * @returns {Function}
	 */
	addNextMove = (action) => {
		const { history } = this.state;
		const oldValue = history[history.length - 1];
		const value = (oldValue.number + (Number(action))) / 3;

		// update
		this.updateData(value, action);
	};

	/**
	 * update data to firebase and redux
	 *
	 * @param value
	 * @param action
	 */
	updateData = (value, action = '') => {
		const { gameRef, userTurn, history } = this.state;
		const { gameState } = this.props;
		const allowedNumber = this.validateNumberForNextMove(value);
		const dataPayload = {
			number: value,
			action,
			userTurn: !userTurn
		};

		// set state
		this.setState({
			history: history.concat(dataPayload),
			userTurn: !userTurn,
			allowedNumber
		}, () => {
			// store game state to redux
			this.props.updateGame(value);

			// update to firebase real-time database
			gameRef
				.child(gameState.type)
				.update({ history: dataPayload })
				.then();

			// scroll element to end
			this.myRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center'
			});

			// if number reaches 1
			if (value === 1) {
				this.setState({ finalOutcome: true });
			}
		});
	};
}

export default connect(null, { updateGame })(Game);
