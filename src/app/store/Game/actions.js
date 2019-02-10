// action types
import * as actionTypes from './types';

// start game
const startGame = (type) => {
	return {
		type: actionTypes.START_GAME,
		payload: type
	};
};

// exit game
const exitGame = () => {
	return {
		type: actionTypes.EXIT_GAME
	};
};

export { startGame, exitGame };
