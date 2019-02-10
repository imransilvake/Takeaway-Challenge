// react
import React from 'react';

// app
import Button from '../../../../components/Button';

const Actions = (props) => {
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
				className="tc-button-style-one"
				disabled={turn || allowedNumber !== '-1' || isEnd}
				onClick={() => props.addNextMove('-1')}>-1
			</Button>
			<Button
				className="tc-button-style-one"
				disabled={turn || allowedNumber !== '0' || isEnd}
				onClick={() => props.addNextMove('0')}>0
			</Button>
			<Button
				className="tc-button-style-one"
				disabled={turn || allowedNumber !== '+1' || isEnd}
				onClick={() => props.addNextMove('+1')}>+1
			</Button>
		</section>
	);
};

export default Actions;
