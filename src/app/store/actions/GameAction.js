// action types
import * as actionTypes from './ActionTypes';

// start game
export const startGame = (type) => {
	return {
		type: actionTypes.START_GAME,
		payload: type
	};
};

// update game
export const updateGame = (value) => {
	return {
		type: actionTypes.UPDATE_GAME,
		payload: value
	};
};
