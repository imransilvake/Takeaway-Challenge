// redux
import { combineReducers } from 'redux';

// app
import gameReducer from './GameReducer';

// root reducer
const rootReducer = combineReducers({
	game: gameReducer
});

export default rootReducer;
