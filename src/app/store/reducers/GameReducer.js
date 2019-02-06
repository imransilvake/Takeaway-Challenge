// app
import * as actionTypes from '../actions/ActionTypes';

// init game state
const initGameState = {
	start: false,
	type: ''
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
		default:
			return state;
	}
};

export default gameReducer;
