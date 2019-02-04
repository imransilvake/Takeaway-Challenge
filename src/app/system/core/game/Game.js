// react
import React, { Component } from 'react';
import { connect } from 'react-redux';

// firebase
import firebase from '../../../../firebase';

// app
import ENV from '../../../../environment';
import { exitGame, updateGame } from '../../../store/actions/GameAction';
import GameAlert from './GameAlert';
import GameMoves from './GameMoves';
import GameButtons from './GameButtons';

class Game extends Component {
	state = {
		gameRef: firebase.database().ref('game'),
		gameRefKey: null,
		gameLogsRef: firebase.database().ref('logs'),
		history: [],
		firstPlayerTurn: true,
		allowedNumber: null,
		timer: 0
	};

	componentDidMount() {
		// init game
		this.initGame();

		// create element ref
		this.myRef = React.createRef();
	}

	componentWillUnmount() {
		// log game state
		this.logGameState();

		// clear timer
		this.clearTimer(this.timer);
	}

	render() {
		const { history, firstPlayerTurn, allowedNumber, timer } = this.state;
		const { gameState } = this.props;

		return (
			<section className="tc-game tc-view-height">
				{/* Alert */}
				<GameAlert
					gameState={gameState}
					firstPlayerTurn={firstPlayerTurn}
					timer={timer}
				/>

				{/* Moves */}
				<GameMoves
					gameType={gameState.type}
					history={history}
					myRef={this.myRef}
				/>

				{/* Buttons */}
				<GameButtons
					history={history}
					firstPlayerTurn={firstPlayerTurn}
					allowedNumber={allowedNumber}
					addNextMove={this.addNextMove}
				/>
			</section>
		);
	}

	/**
	 * init game
	 */
	initGame = () => {
		// generate random whole number between 100 - 5000
		const randomNumber = Math.floor(Math.random() * 5000) + 100;

		// update game
		this.updateGame(randomNumber);
	};

	/**
	 * update game state: firebase and redux
	 *
	 * @param value
	 * @param action
	 */
	updateGame = (value, action = '') => {
		const { gameRef, firstPlayerTurn, history, gameRefKey} = this.state;
		const { gameState } = this.props;
		const allowedNumber = this.validateNumberForNextMove(value);
		const dataPayload = {
			number: value,
			action,
			firstPlayerTurn: !firstPlayerTurn
		};
		const updateHistory = history.concat(dataPayload);

		// set state
		this.setState({
			history: updateHistory,
			firstPlayerTurn: !firstPlayerTurn,
			allowedNumber
		}, () => {
			// update game state to redux
			this.props.updateGame(value);

			// random turn: first push to database
			if (!gameRefKey) {
				// update to firebase real-time database
				const gameRefKey = gameRef
					.child(gameState.type)
					.push({ history: updateHistory })
					.key;

				// set state
				this.setState({ gameRefKey: gameRefKey }, () => {
					// start timer
					this.startTimer();

					// add firebase real-time listener
					this.addFirebaseRealTimeListener();
				});
			} else {
				gameRef
					.child(gameState.type)
					.child(gameRefKey)
					.update({ history: updateHistory })
					.then(() => {
						// restart timer
						this.restartTimer();
					});
			}

			// scroll element to end
			this.myRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});

			// if number reaches 1, we need to finish the game and declare the winner.
			if (value === 1) {
				// end game
				this.endGame();
			}
		});
	};

	/**
	 * end game
	 */
	endGame = () => {
		const { firstPlayerTurn } = this.state;

		// timeout added to delay the route and show the final move on the screen.
		// usually I don't recommend using setTimeout in a project.
		setTimeout(() => {
			this.props.history.push({
				pathname: ENV.ROUTING.HOME,
				state: {
					result: !firstPlayerTurn
				}
			});

			// update game state to redux
			this.props.exitGame();
		}, 1000);
	};

	/**
	 * add firebase real-time listener
	 */
	addFirebaseRealTimeListener = () => {
		const { gameRef, gameRefKey } = this.state;
		const { gameState } = this.props;

		// real-time database live listener
		gameRef
			.child(gameState.type)
			.child(gameRefKey)
			.on('value', (snap) => {
				if (snap.exists()) {
					const data = snap.val();
					const lastHistoryItem = data.history[data.history.length-1];

					// turn: cpu
					if (!lastHistoryItem.firstPlayerTurn && lastHistoryItem.number > 1) {
						// evaluate to true if the variable is divisible by 3
						this.addNextMove(this.validateNumberForNextMove(lastHistoryItem.number));
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

		// update game
		this.updateGame(value, action);
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
			if (seconds === 30) {
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
		const { gameRef, gameRefKey, gameLogsRef, firstPlayerTurn, history } = this.state;
		const { gameState } = this.props;
		const isFinished = history && history[history.length - 1].number === 1;

		// payload
		const logPayload = {
			mode: gameState.type === 'cpu' ? 'CPU vs Player' : 'Player vs Player',
			status: isFinished ? 'Finished' : 'Interrupted',
			winner: firstPlayerTurn ? 'CPU' : 'Player',
			timestamp: Date.now()
		};

		// update log to firebase real-time database
		gameLogsRef
			.push(logPayload)
			.then(() => {
				// empty data from firebase
				gameRef
					.child(gameState.type)
					.child(gameRefKey)
					.remove()
					.then(() => {
						// remove live listeners
						gameRef.child(gameState.type).off();
						gameLogsRef.off();
					});
			});
	};
}

export default connect(null, { updateGame, exitGame })(Game);
