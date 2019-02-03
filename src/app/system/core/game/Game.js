// react
import React, { Component } from 'react';
import { connect } from 'react-redux';

// firebase
import firebase from '../../../../firebase';

// app
import ENV from '../../../../environment';
import { updateGame } from '../../../store/actions/GameAction';
import GameAlert from './GameAlert';
import GameMoves from './GameMoves';
import GameButtons from './GameButtons';

class Game extends Component {
	state = {
		gameRef: firebase.database().ref('game'),
		history: [],
		userTurn: true,
		allowedNumber: 0,
		finalOutcome: false,
		timer: 0
	};

	componentDidMount() {
		this.addGameListener();

		// create element ref
		this.myRef = React.createRef();

		// start timer
		this.startTimer();
	}

	componentWillUnmount() {
		const { gameRef } = this.state;
		const { gameState } = this.props;

		// log game state
		this.logGameState();

		// remove live listener
		gameRef.child(gameState.type).off();

		// clear timer
		this.clearTimer(this.timer);
	}

	render() {
		const { history, userTurn, allowedNumber, finalOutcome, timer } = this.state;

		return (
			<section className="tc-game tc-view-height">
				{/* Alert */}
				<GameAlert
					userTurn={userTurn}
					timer={timer}
				/>

				{/* Moves */}
				<GameMoves
					history={history}
					myRef={this.myRef}
				/>

				{/* Buttons */}
				<GameButtons
					userTurn={userTurn}
					allowedNumber={allowedNumber}
					finalOutcome={finalOutcome}
					updateData={this.updateData}
					addNextMove={this.addNextMove}
				/>
			</section>
		);
	}

	/**
	 * add game listener
	 */
	addGameListener = () => {
		// init game
		this.initGame();

		// add firebase real-time listener
		this.addFirebaseRealTimeListener();
	};

	/**
	 * generate random whole number between 100 - 5000
	 */
	initGame = () => {
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
			});
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
			// restart timer
			this.restartTimer();

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
				block: 'center'
			});

			// if number reaches 1, we need to finish the game and declare the winner.
			if (value === 1) {
				this.endGame();
			}
		});
	};

	/**
	 * end the game
	 */
	endGame = () => {
		const { gameRef, userTurn } = this.state;
		const { gameState } = this.props;

		// set state
		this.setState({ finalOutcome: true }, () => {
			// empty data from firebase
			gameRef
				.child(gameState.type)
				.remove()
				.then(() => {
					// log game state
					this.logGameState();
				});

			// timeout added to delay the route and show the final move on the screen.
			// usually I don't recommend using setTimeout in a project.
			setTimeout(() => {
				this.props.history.push({
					pathname: ENV.ROUTING.HOME,
					state: {
						result: !userTurn
					}
				});
			}, 1000);
		});
	};

	/**
	 * start timer
	 */
	startTimer = () => {
		const startTime = Date.now();
		this.timer = setInterval(() => {
			const seconds = Math.round((Date.now() - startTime) / 1000);

			// set timer
			this.setState({ timer: seconds });

			// validate user status
			if (seconds === 20) {
				// clear timer
				this.clearTimer(this.timer);

				// end game
				this.endGame();
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
		// clear interval
		clearInterval(timer);
	};

	/**
	 * log game state
	 */
	logGameState = () => {
		const { gameRef, userTurn, history } = this.state;
		const { gameState } = this.props;
		const isFinished = history && history[history.length-1].number === 1;

		// payload
		const logPayload = {
			mode: gameState.type === 'cpu' ? 'CPU vs Player' : 'Player vs Player',
			status: isFinished ? 'Finished' : 'Interrupted',
			winner: userTurn ? 'CPU' : 'Player'
		};

		// update log to firebase real-time database
		gameRef
			.child('logs')
			.push(logPayload)
			.then();
	};
}

export default connect(null, { updateGame })(Game);
