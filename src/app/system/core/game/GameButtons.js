// react
import React from 'react';

// app
import Button from '@material-ui/core/Button';

const GameButtons = (props) => {
	const { history, firstPlayer, secondPlayer } = props;
	const isEnd = history && history.length > 0 && history[history.length -1].number === 1;
	const allowedNumber = history && history.length > 0 && history[history.length -1].allowedNumber;
	const even = history && history.length % 2 === 0;
	const odd = !(history && history.length % 2 === 0);

	console.log((!odd && !firstPlayer) );

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
