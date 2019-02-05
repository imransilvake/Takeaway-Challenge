// react
import React, { Component } from 'react';
import { connect } from 'react-redux';

// firebase
import firebase from '../../../../firebase';

// app
import ENV from '../../../../environment';
import GameAlert from './GameAlert';
import GameMoves from './GameMoves';
import GameButtons from './GameButtons';
import { exitGame, updateGame } from '../../../store/actions/GameAction';

class Game extends Component {
	state = {
		gameRef: firebase.database().ref('game'),
		gameRefKey: null,
		gameLogsRef: firebase.database().ref('logs'),
		history: [],
		allowedNumber: null,
		firstPlayer: false,
		secondPlayer: false,
		timer: 0
	};

	componentDidMount() {
		// setup game
		this.setupGame();

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
		const { history, allowedNumber, timer, firstPlayer, secondPlayer } = this.state;
		const { gameState } = this.props;

		return (
			<section className="tc-game tc-view-height">
				{/* Alert */}
				<GameAlert
					gameState={gameState}
					timer={timer}
				/>

				{/* Moves */}
				<GameMoves
					gameState={gameState}
					history={history}
					myRef={this.myRef}
				/>

				{/* Buttons */}
				<GameButtons
					firstPlayer={firstPlayer}
					secondPlayer={secondPlayer}
					history={history}
					allowedNumber={allowedNumber}
					addNextMove={this.addNextMove}
				/>
			</section>
		);
	}

	/**
	 * setup game
	 */
	setupGame = () => {
		const { gameRef } = this.state;
		const { gameState } = this.props;

		// cpu
		if (gameState.type === 'cpu') {
			// init game
			this.initGame();
		} else {
			gameRef
				.child(gameState.type)
				.once('value', (snaps) => {
					if (snaps.exists()) {
						const snapshots = Object.values(snaps.val());
						const allowedNumber = this.validateNumberForNextMove(snapshots[0].history[0].number);

						// update game state to redux
						this.props.updateGame(snapshots[0].history[0].number);

						// set state
						this.setState({
							gameRefKey: snapshots[0].history[0].gameRefKey,
							history: snapshots[0].history,
							secondPlayer: true,
							allowedNumber
						});
					} else {
						this.setState({
							firstPlayer: true
						}, () => {
							// init game
							this.initGame();
						});
					}
				})
				.then();
		}
	};

	/**
	 * init game
	 */
	initGame = () => {
		// generate random whole number between 100 - 5000
		const randomNumber = Math.floor(Math.random() * 5000) + 100;

		// update game
		this.updateGame(randomNumber, '-1');
	};

	/**
	 * update game state: firebase and redux
	 *
	 * @param value
	 * @param action
	 */
	updateGame = (value, action) => {
		const { gameRef, history, gameRefKey } = this.state;
		const { gameState } = this.props;
		const allowedNumber = this.validateNumberForNextMove(value);
		const dataPayload = {
			number: value,
			gameRefKey,
			action,
			allowedNumber
		};
		const updateHistory = history.concat(dataPayload);

		// set state
		this.setState({
			history: updateHistory,
			allowedNumber
		}, () => {
			// random turn: first push to database
			if (!gameRefKey) {
				// update to firebase real-time database
				const newGameRefKey = gameRef
					.child(gameState.type)
					.push({ history: updateHistory })
					.key;

				// set state
				this.setState({ gameRefKey: newGameRefKey }, () => {
					if (newGameRefKey) {
						dataPayload.gameRefKey = newGameRefKey;
						gameRef
							.child(gameState.type)
							.child(newGameRefKey)
							.update({ history: history.concat(updateHistory) })
							.then();
					}

					// add firebase real-time listener
					this.addFirebaseRealTimeListener();
				});
			} else {
				gameRef
					.child(gameState.type)
					.child(gameRefKey)
					.update({ history: updateHistory })
					.then(() => {
						// add firebase real-time listener
						this.addFirebaseRealTimeListener();
					});
			}
		});
	};

	/**
	 * end game
	 */
	endGame = () => {
		const { history, firstPlayer } = this.state;

		// validate result
		let result = false;
		if (firstPlayer) {
			result = !(history && history.length % 2 === 0);
		} else {
			result = (history && history.length % 2 === 0);
		}

		// timeout added to delay the route and show the final move on the screen.
		// usually I don't recommend using setTimeout in a project.
		setTimeout(() => {
			this.props.history.push({
				pathname: ENV.ROUTING.HOME,
				state: { result }
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
					const lastHistoryItem = data.history[data.history.length - 1];

					// update game state to redux
					this.props.updateGame(lastHistoryItem.number);

					// turn: cpu
					if (gameState.type === 'cpu') {
						if (data.history && !(data.history.length % 2 === 0) && lastHistoryItem.number > 1) {
							// evaluate to true if the variable is divisible by 3
							this.addNextMove(this.validateNumberForNextMove(lastHistoryItem.number));

							// restart timer
							this.restartTimer();
						}
					} else {
						// set state
						this.setState({ history: data.history }, () => {
							// scroll element to end
							this.myRef.current.scrollIntoView({
								behavior: 'smooth',
								block: 'center'
							});

							// if number reaches 1, we need to finish the game and declare the winner.
							if (lastHistoryItem.number === 1) {
								// end game
								this.endGame();
							}
						});
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
			if (seconds === 300) {
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
		const { gameRef, gameRefKey, gameLogsRef, history } = this.state;
		const { gameState } = this.props;
		const isFinished = history && history[history.length - 1].number === 1;

		// set player name
		let user1 = 'CPU';
		let user2 = 'Player';
		if (gameState.type !== 'cpu') {
			user1 = 'Player 2';
			user2 = 'Player 1';
		}

		// payload
		const logPayload = {
			mode: gameState.type === 'cpu' ? 'CPU vs Player' : 'Player1 vs Player2',
			status: isFinished ? 'Finished' : 'Interrupted',
			winner: history && history.length % 2 === 0 ? user1 : user2,
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
