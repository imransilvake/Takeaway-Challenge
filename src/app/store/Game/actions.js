// app
import * as actionTypes from './types';

// start game
const startGame = (type) => {
	return (dispatch) => {
		dispatch({
			type: actionTypes.START_GAME,
			payload: type
		});
	};
};

// add game data
const addGameData = (data) => {
	return (dispatch, getState, { getFirebase }) => {
		const firebase = getFirebase();
		const gameRef = firebase.database().ref('game');

		const entry = gameRef
			.child(data.type)
			.push(data.payload);

		dispatch({
			type: actionTypes.ADD_GAME_DATA,
			payload: entry.key
		});
	}
};

// update game data
const updateGameData = (data) => {
	return (dispatch, getState, { getFirebase }) => {
		const firebase = getFirebase();
		const gameRef = firebase.database().ref('game');

		gameRef
			.child(data.type)
			.child(data.key)
			.update(data.payload)
			.then();

		dispatch({
			type: actionTypes.UPDATE_GAME_DATA
		});
	}
};

// remove game data
const removeGameData = (data) => {
	return (dispatch, getState, { getFirebase }) => {
		const firebase = getFirebase();
		const gameRef = firebase.database().ref('game');
		const gamePresenceRef = firebase.database().ref('presence');

		if (data.key) {
			gameRef.child(data.type).child(data.key).remove().then();
		} else {
			gameRef.child(data.type).remove().then();
		}

		// remove presence data
		gamePresenceRef.remove().then();

		dispatch({
			type: actionTypes.REMOVE_GAME_DATA
		});
	}
};

// log game result
const logGameResult = (data) => {
	return (dispatch, getState, { getFirebase }) => {
		const firebase = getFirebase();
		const gameLogsRef = firebase.database().ref('logs');

		// push
		gameLogsRef.push(data);

		dispatch({
			type: actionTypes.LOG_GAME_RESULT
		});
	}
};

// exit game
const exitGame = () => {
	return (dispatch) => {
		dispatch({
			type: actionTypes.EXIT_GAME
		});
	};
};

export {
	startGame,
	addGameData,
	updateGameData,
	removeGameData,
	logGameResult,
	exitGame
};
