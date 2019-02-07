// react
import React from 'react';

// app
import Button from '@material-ui/core/Button';

const GameButtons = (props) => {
	const { gameState, history, firstPlayer, secondPlayer, even, odd } = props;
	const historyData = history && history.length > 0 && history[history.length - 1];
	const { allowedNumber } = historyData;
	const isEnd = historyData && historyData.value === 1;

	// set turn based on game mode
	let turn = odd;
	if (gameState.type !== 'cpu') {
		turn = (!odd && !firstPlayer) || (!even && !secondPlayer);
	}

	return (
		<section className="tc-game-buttons">
			<Button
				disabled={turn || allowedNumber !== '-1' || isEnd}
				onClick={() => props.addNextMove('-1')}>-1
			</Button>
			<Button
				disabled={turn || allowedNumber !== '0' || isEnd}
				onClick={() => props.addNextMove('0')}>0
			</Button>
			<Button
				disabled={turn || allowedNumber !== '+1' || isEnd}
				onClick={() => props.addNextMove('+1')}>+1
			</Button>
		</section>
	);
};

export default GameButtons;
