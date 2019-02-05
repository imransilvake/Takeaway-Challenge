// react
import React from 'react';

// app
import Button from '@material-ui/core/Button';

const GameButtons = (props) => {
	const { history, firstPlayer, secondPlayer } = props;
	const historyData = history && history.length > 0 && history[history.length - 1];
	const { allowedNumber } = historyData;
	const even = history && history.length % 2 === 0;
	const odd = !(history && history.length % 2 === 0);
	const isEnd = historyData.number === 1;

	return (
		<section className="tc-game-buttons">
			<Button
				disabled={(!odd && !firstPlayer) || (!even && !secondPlayer) || allowedNumber !== '-1' || isEnd}
				onClick={() => props.addNextMove('-1')}>-1
			</Button>
			<Button
				disabled={(!odd && !firstPlayer) || (!even && !secondPlayer) || allowedNumber !== '0' || isEnd}
				onClick={() => props.addNextMove('0')}>0
			</Button>
			<Button
				disabled={(!odd && !firstPlayer) || (!even && !secondPlayer) || allowedNumber !== '+1' || isEnd}
				onClick={() => props.addNextMove('+1')}>+1
			</Button>
		</section>
	);
};

export default GameButtons;
