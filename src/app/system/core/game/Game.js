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
import { exitGame } from '../../../store/actions/GameAction';
import isEven from '../../utilities/helpers/Helpers';

class Game extends Component {
	state = {
		gameRef: firebase.database().ref('game'),
		gameInfoRef: firebase.database().ref('info/connected'),
		gameLogsRef: firebase.database().ref('logs'),
		gameRefKey: null,
		history: [],
		firstPlayer: true,
		secondPlayer: false
	};

	constructor(props) {
		super(props);

		// create element ref
		this.scrollRef = React.createRef();
		this.timerRef = React.createRef();
	}

	componentDidMount() {
		const { gameState } = this.props;

		// detect online status
		if (!navigator.onLine) {
			this.props.history.push({
				pathname: ENV.ROUTING.HOME
			});
		}

		// on user disconnect with firebase
		if (gameState.type !== 'cpu') {
			this.onUserDisconnectWithFirebase();
		}

		// validate players
		this.validatePlayers();
	}

	render() {
		const { history, firstPlayer, secondPlayer } = this.state;
		const { gameState } = this.props;
		const even = history && isEven(history.length);
		const odd = history && !isEven(history.length);

		return (
			<section className="tc-game tc-view-height">
				{/* Alert */}
				<GameAlert
					gameState={gameState}
					history={history}
					firstPlayer={firstPlayer}
					secondPlayer={secondPlayer}
					even={even}
					odd={odd}
					endGame={this.endGame}
					ref={this.timerRef}
				/>

				{/* Moves */}
				<GameMoves
					gameState={gameState}
					history={history}
					scrollRef={this.scrollRef}
				/>

				{/* Buttons */}
				<GameButtons
					gameState={gameState}
					history={history}
					firstPlayer={firstPlayer}
					secondPlayer={secondPlayer}
					even={even}
					odd={odd}
					addNextMove={this.addNextMove}
				/>
			</section>
		);
	}

	/**
	 * validate players
	 */
	validatePlayers = () => {
		const { gameRef } = this.state;
		const { gameState } = this.props;

		// cpu
		if (gameState.type === 'cpu') {
			this.initGame();
		} else {
			gameRef
				.child(gameState.type)
				.once('value', (snaps) => {
					if (snaps.exists()) {
						const snapshots = Object.values(snaps.val());

						// set state
						this.setState({
							gameRefKey: snapshots[0].history[0].gameRefKey,
							history: snapshots[0].history,
							firstPlayer: false,
							secondPlayer: true
						}, () => {
							this.timerRef.current.restartTimer();
						});
					} else {
						this.initGame();
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
		this.updateGame(randomNumber);
	};

	/**
	 * update game state: firebase and redux
	 *
	 * @param value
	 */
	updateGame = (value) => {
		const { gameRef, history, gameRefKey } = this.state;
		const { gameState } = this.props;
		const allowedNumber = this.validateNumberForNextMove(value);
		const dataPayload = {
			value,
			gameRefKey,
			allowedNumber
		};
		const updateHistory = history.concat(dataPayload);

		// set state
		this.setState({ history: updateHistory }, () => {
			// random turn: first push to database
			if (!gameRefKey) {
				// push
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

						// validate game state
						this.validateGameState(value);
					});
			}
		});
	};

	/**
	 * add firebase real-time listener
	 */
	addFirebaseRealTimeListener = () => {
		const { gameRef, gameRefKey } = this.state;
		const { gameState } = this.props;

		gameRef
			.child(gameState.type)
			.child(gameRefKey)
			.on('value', (snap) => {
				if (snap.exists()) {
					const data = snap.val();
					const lastHistoryItem = data.history[data.history.length - 1];

					// turn: cpu
					if (gameState.type === 'cpu') {
						if (data.history && !isEven(data.history.length) && lastHistoryItem.value > 1) {
							// evaluate to true if the variable is divisible by 3
							this.addNextMove(this.validateNumberForNextMove(lastHistoryItem.value));
						}
					} else {
						this.setState({ history: data.history }, () => {
							// validate game state
							this.validateGameState(lastHistoryItem.value);
						});
					}

					// restart timer
					this.timerRef.current.restartTimer();
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
		const value = (oldValue.value + (Number(action))) / 3;

		// update game
		this.updateGame(value);
	};

	/**
	 * validate game state
	 *
	 * @param number
	 */
	validateGameState = (number) => {
		// scroll element to end
		this.scrollRef.current.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});

		// if number reaches 1, we need to finish the game and declare the winner.
		if (number === 1) {
			// end game
			this.endGame();
		}
	};

	/**
	 * end game
	 *
	 * @param isDisconnected
	 */
	endGame = (isDisconnected = false) => {
		const { history, firstPlayer, secondPlayer } = this.state;

		// log result
		this.logGameResult(isDisconnected);

		// validate result
		let result = false;
		if (firstPlayer) {
			result = history && !isEven(history.length);
		} else {
			result = history && isEven(history.length);
		}

		// on disconnect
		if (isDisconnected) {
			result = firstPlayer ? firstPlayer : secondPlayer;
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
	 * log game result
	 *
	 * @param isDisconnected
	 */
	logGameResult = (isDisconnected = false) => {
		const { gameRef, gameRefKey, gameLogsRef, history, firstPlayer } = this.state;
		const { gameState } = this.props;
		const isFinished = history && history[history.length - 1].value === 1;

		// set player names
		let user1 = 'CPU';
		let user2 = 'Player';
		if (gameState.type !== 'cpu') {
			user1 = 'Player 2';
			user2 = 'Player 1';
		}

		// set winner
		let winner = history && isEven(history.length) ? user1 : user2;
		if (isDisconnected) {
			winner = firstPlayer ? user2 : user1;
		}

		// payload
		const logPayload = {
			mode: gameState.type === 'cpu' ? 'CPU vs Player' : 'Player1 vs Player2',
			status: isFinished ? 'Finished' : 'Interrupted',
			winner: winner,
			timestamp: Date.now()
		};

		// empty data from firebase database
		// remove live listeners
		gameLogsRef
			.push(logPayload)
			.then(() => {
				gameRef
					.child(gameState.type)
					.child(gameRefKey)
					.remove()
					.then(() => {
						gameRef.child(gameState.type).off();
						gameLogsRef.off();
					});
			});
	};

	/**
	 * write a string when this (current) client loses connection
	 */
	onUserDisconnectWithFirebase = () => {
		const { gameInfoRef } = this.state;

		// remove on init
		gameInfoRef.remove().then();

		// listener
		gameInfoRef.on('child_added', () => {
			// end game
			this.endGame(true);

			// off
			gameInfoRef.off();

			// remove
			gameInfoRef.remove().then();
		});

		// on disconnect
		gameInfoRef
			.onDisconnect()
			.update({value: 'Connected'})
			.then();
	};
}

export default connect(null, { exitGame })(Game);
