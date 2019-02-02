// app
import * as actionTypes from '../actions/ActionTypes';

// init game state
const initGameState = {
	start: false,
	type: '',
	value: 0
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
		case actionTypes.UPDATE_GAME:
			return {
				...state,
				value: action.payload
			};
		default:
			return state;
	}
};

export default gameReducer;
