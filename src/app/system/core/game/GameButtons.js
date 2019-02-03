// react
import React from 'react';

// app
import Button from '@material-ui/core/Button';

const GameButtons = (props) => {
	const { userTurn, allowedNumber, finalOutcome } = props;

	return (
		<section className="tc-game-buttons">
			<Button
				disabled={!userTurn || allowedNumber !== '-1' || finalOutcome}
				onClick={() => props.addNextMove('-1')}>-1
			</Button>
			<Button
				disabled={!userTurn || allowedNumber !== '0' || finalOutcome}
				onClick={() => props.addNextMove('0')}>0
			</Button>
			<Button
				disabled={!userTurn || allowedNumber !== '+1' || finalOutcome}
				onClick={() => props.addNextMove('+1')}>+1
			</Button>
		</section>
	);
};

export default GameButtons;
