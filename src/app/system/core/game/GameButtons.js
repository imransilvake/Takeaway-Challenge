// react
import React from 'react';

// app
import Button from '@material-ui/core/Button';

const GameButtons = (props) => {
	const { firstPlayerTurn, allowedNumber, history } = props;
	const isEnd = history && history.length > 0 && history[history.length -1].number === 1;

	return (
		<section className="tc-game-buttons">
			<Button
				disabled={!firstPlayerTurn || allowedNumber !== '-1' || isEnd}
				onClick={() => props.addNextMove('-1')}>-1
			</Button>
			<Button
				disabled={!firstPlayerTurn || allowedNumber !== '0' || isEnd}
				onClick={() => props.addNextMove('0')}>0
			</Button>
			<Button
				disabled={!firstPlayerTurn || allowedNumber !== '+1' || isEnd}
				onClick={() => props.addNextMove('+1')}>+1
			</Button>
		</section>
	);
};

export default GameButtons;
