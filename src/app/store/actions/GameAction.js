// action types
import * as actionTypes from './ActionTypes';

// start game
export const startGame = (type) => {
	return {
		type: actionTypes.START_GAME,
		payload: type
	};
};

// exit game
export const exitGame = () => {
	return {
		type: actionTypes.EXIT_GAME
	};
};
