// react
import React from 'react';

// app
import Button from '../../../../components/Button';

const Actions = (props) => {
	const { gameState, history, firstPlayer, secondPlayer, even, odd, isWrong } = props;
	const historyData = history && history.length > 0 && history[history.length - 1];
	const { allowedNumber } = historyData;
	const isEnd = historyData && historyData.value === 1;

	// set turn based on game mode
	let turn = odd;
	if (gameState.type !== 'cpu') {
		turn = (!odd && !firstPlayer) || (!even && !secondPlayer);
	}

	/**
	 * play next move on right decision
	 * @param number
	 * @returns {boolean}
	 */
	const playMove = (number) => {
		if (allowedNumber === number) {
			props.addNextMove(number);
			return true;
		}
		props.wrongMove();
		return false;
	}

	return (
		<section className="tc-game-buttons tc-position-fixed tc-actions">
			{ isWrong && (<p className="tc-wrong-selection">Wrong Selection</p>) }
			<Button
				className="tc-button-style-one"
				disabled={turn || isEnd || isWrong}
				onClick={() => playMove('-1')}>-1
			</Button>
			<Button
				className="tc-button-style-one"
				disabled={turn || isEnd || isWrong}
				onClick={() => playMove('0')}>0
			</Button>
			<Button
				className="tc-button-style-one"
				disabled={turn || isEnd || isWrong}
				onClick={() => playMove('+1')}>+1
			</Button>
		</section>
	);
};

export default Actions;
