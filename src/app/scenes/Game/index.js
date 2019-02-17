// react
import React, { Component } from 'react';
import { connect } from 'react-redux';

// firebase
import firebase from '../../../firebase';

// app
import ENV from '../../../environment';
import Alert from './components/Alert';
import Moves from './components/Moves';
import Actions from './components/Actions';
import isEven from '../../utilities/Helpers';
import Loading from '../../components/Loading';
import { addGameData, updateGameData, removeGameData, exitGame, logGameResult } from '../../store/Game/actions';

class Game extends Component {
	state = {
		gameRef: firebase.database().ref('game'),
		gameInfoRef: firebase.database().ref('.info/connected'),
		gamePresenceRef: firebase.database().ref('presence'),
		gameRefKey: null,
		history: [],
		firstPlayer: true,
		secondPlayer: false,
		loading: true,
		waitingForUser: false,
		timerEnd: false
	};

	componentDidMount() {
		// detect players (active or inactive)
		this.detectPlayers();

		// create element ref
		this.scrollRef = React.createRef();
		this.timerRef = React.createRef();
	}

	componentWillReceiveProps(nextProps, nextContext) {
		const { gameRefKey } = this.state;
		const { gameState } = this.props;

		// set state
		if (nextProps.gameState.refKey && !gameRefKey) {
			const key = nextProps.gameState.refKey;
			this.setState({ gameRefKey: key }, () => {
				const prepareData = {
					type: gameState.type,
					key,
					payload: { gameRefKey: key }
				};
				this.props.updateGameData(prepareData);

				// add firebase real-time listener
				this.addFirebaseRealTimeListener();
			});
		}
	}

	render() {
		const { history, firstPlayer, secondPlayer, loading, waitingForUser } = this.state;
		const { gameState } = this.props;
		const even = history && isEven(history.length);
		const odd = history && !isEven(history.length);

		return loading ? <Loading /> : (
			<section className="tc-game tc-view-height">
				<Alert
					gameState={gameState}
					history={history}
					waitingForUser={waitingForUser}
					firstPlayer={firstPlayer}
					secondPlayer={secondPlayer}
					even={even}
					odd={odd}
					endGame={this.endGame}
					ref={this.timerRef}/>

				<Moves
					gameState={gameState}
					history={history}
					scrollRef={this.scrollRef}/>

				<Actions
					gameState={gameState}
					history={history}
					firstPlayer={firstPlayer}
					secondPlayer={secondPlayer}
					even={even}
					odd={odd}
					addNextMove={this.addNextMove}/>
			</section>
		);
	}

	/**
	 * detect players (active or inactive)
	 */
	detectPlayers = () => {
		const { gamePresenceRef } = this.state;
		const { gameState } = this.props;

		// cpu
		if (gameState.type === 'cpu') {
			// display game view
			this.setState({ loading: false });

			// init game
			this.initGame();
		}

		// player
		if (gameState.type === 'player') {
			gamePresenceRef
				.once('value', (snap) => {
					if (!snap.exists() || snap.numChildren() < 2) {
						// detect active game players
						this.handleActivePlayers();
					} else {
						// go to home
						this.props.history.push({
							pathname: ENV.ROUTING.HOME,
							info: { busy: true }
						});

						// exit game
						this.props.exitGame();
					}
				}).then()
		}
	};

	/**
	 * handle active game players
	 */
	handleActivePlayers = () => {
		const { gameRef, gameInfoRef, gamePresenceRef } = this.state;
		const { gameState } = this.props;
		const currentUserRef = gamePresenceRef.push();

		// monitor connection state on browser tab
		gameInfoRef
			.on('value', (snap) => {
				if (snap.val()) {
					// off listener
					gameInfoRef.off();

					// if network is lost then remove this user from the list
					currentUserRef.onDisconnect().remove().then();

					// set user
					currentUserRef.set(true).then();
				}
			});

		// detect users (once)
		gamePresenceRef
			.once('value', (snap) => {
				const totalUsers = snap.numChildren();

				// for two players
				if (totalUsers <= 2) {
					// display game view
					this.setState({ loading: false });

					// on player disconnect
					this.onPlayerDisconnect();
				}

				// validate game
				if (totalUsers === 1) {
					// remove game data (old)
					const prepareData = { type: gameState.type };
					this.props.removeGameData(prepareData);

					// init game
					this.initGame();
				} else {
					gameRef
						.child(gameState.type)
						.once('value', (snaps) => {
							if (snaps.exists()) {
								const snapshots = Object.values(snaps.val());

								// set state
								this.setState({
									gameRefKey: snapshots[0].gameRefKey,
									history: snapshots[0].history,
									firstPlayer: false,
									secondPlayer: true
								}, () => {
									// add firebase real-time listener
									this.addFirebaseRealTimeListener();
								});
							}
						})
						.then();
				}
			})
			.then();
	};

	/**
	 * write a current player disconnect
	 */
	onPlayerDisconnect = () => {
		const { gamePresenceRef } = this.state;

		// when user disconnected (on)
		gamePresenceRef
			.once('child_removed', () => {
				const { history, timerEnd } = this.state;
				const lastHistoryItem = history[history.length - 1];

				// check if game is finished or interrupted
				if (lastHistoryItem && lastHistoryItem.value !== 1 && !timerEnd) {
					// remove
					gamePresenceRef.remove().then();

					// end game
					this.endGame(true);
				}
			})
			.then();
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
		const { history, gameRefKey } = this.state;
		const { gameState } = this.props;
		const allowedNumber = this.validateNumberForNextMove(value);
		const dataPayload = {
			value,
			allowedNumber
		};
		const updateHistory = history.concat(dataPayload);

		// set state
		this.setState({ history: updateHistory }, () => {
			// first push to database when game starts
			if (!gameRefKey) {
				const prepareData = {
					type: gameState.type,
					payload: { history: updateHistory }
				};
				this.props.addGameData(prepareData);
			} else {
				const prepareData = {
					type: gameState.type,
					key: gameRefKey,
					payload: { history: updateHistory }
				};
				this.props.updateGameData(prepareData);

				// validate game state
				if (gameState.type === 'cpu') {
					this.validateGameState(value);
				}
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
							// add next move
							this.addNextMove(this.validateNumberForNextMove(lastHistoryItem.value));
						}
					} else {
						this.setState({ history: data.history }, () => {
							// validate game state
							this.validateGameState(lastHistoryItem.value);
						});
					}

					// after second user made a move
					if (data && data.history.length > 1) {
						// restart timer
						this.timerRef.current.restartTimer();

						// disable wait
						this.setState({ waitingForUser: false });
					} else if (!this.state.waitingForUser) {
						// enable wait
						this.setState({ waitingForUser: true });
					}
				}
			});
	};

	/**
	 * evaluate number for next move
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

		// if number reaches 1, finish the game and declare the winner.
		if (number === 1) {
			// end game
			this.endGame();
		}
	};

	/**
	 * end game
	 *
	 * @param isDisconnected
	 * @param isLogResult
	 * @param isTerminated
	 */
	endGame = (isDisconnected = false, isLogResult = true, isTerminated = false) => {
		const { history, firstPlayer, secondPlayer } = this.state;

		// set terminate
		if (isTerminated) {
			this.setState({ timerEnd: isTerminated });
		}

		// log result
		if (isLogResult) {
			this.logFinalResult(isDisconnected);
		}

		// validate result
		let result = false;
		if (firstPlayer) {
			result = history && !isEven(history.length);
		} else {
			result = history && isEven(history.length);
		}

		// on disconnect
		if (isDisconnected) {
			result = firstPlayer || secondPlayer;
		}

		// timeout added to delay the route and show the final move on the screen.
		// usually I don't recommend using setTimeout in a project.
		setTimeout(() => {
			this.props.history.push({
				pathname: ENV.ROUTING.HOME,
				state: { result }
			});

			// exit game
			this.props.exitGame();
		}, 1000);
	};

	/**
	 * log final result
	 *
	 * @param isDisconnected
	 */
	logFinalResult = (isDisconnected = false) => {
		const { gameRef, gameRefKey, gamePresenceRef, history, firstPlayer } = this.state;
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
			winner,
			timestamp: Date.now()
		};

		// output logs, remove game data, clear listeners
		if (gameState.type === 'cpu' || !firstPlayer || isDisconnected) {
			// logs game result
			this.props.logGameResult(logPayload);

			// remove game data
			const prepareData = {
				type: gameState.type,
				key: gameRefKey
			};
			this.props.removeGameData(prepareData);

			// clear presence for player vs player
			if (gameState.type === 'player') {
				// remove presence data
				gamePresenceRef.remove().then();
			}

			// clear listeners
			gameRef.child(gameState.type).off();
		}
	};
}

// dispatch
const mapDispatchToProps = (dispatch) => {
	return ({
		addGameData: data => dispatch(addGameData(data)),
		updateGameData: data => dispatch(updateGameData(data)),
		removeGameData: data => dispatch(removeGameData(data)),
		logGameResult: data => dispatch(logGameResult(data)),
		exitGame: () => dispatch(exitGame())
	})
};

export default connect(null, mapDispatchToProps)(Game);
