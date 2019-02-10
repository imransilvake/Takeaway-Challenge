// app
import * as actionTypes from './types';

// init game state
const initGameState = {
	start: false,
	type: '',
	refKey: null
};

// reducer: Game
const gameReducer = (state = initGameState, action) => {
	switch (action.type) {
		case actionTypes.START_GAME:
			return {
				...state,
				start: true,
				type: action.payload
			};
		case actionTypes.EXIT_GAME:
			return {
				...state,
				start: false
			};
		case actionTypes.ADD_GAME_DATA:
			return {
				...state,
				refKey: action.payload
			};
		default:
			return state;
	}
};

export default gameReducer;
