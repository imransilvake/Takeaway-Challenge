// redux
import { combineReducers } from 'redux';

// app
import gameReducer from './Game/reducer';

// root reducer
const rootReducer = combineReducers({
	game: gameReducer
});

export default rootReducer;
