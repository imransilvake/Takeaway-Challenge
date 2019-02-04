// react
import React from 'react';

// app
import i18n from '../../../../assets/i18n/i18n';

const GameAlert = (props) => {
	let opponentName = 'CPU';
	const { gameState, firstPlayerTurn, timer } = props;

	// set opponent name
	if (gameState.type !== 'cpu') {
		opponentName = 'Player';
	}

	return (
		<section className="tc-game-alert cd-center-align">
			<p>{i18n.t('GAME.ALERT', { type: firstPlayerTurn ? 'Your' : opponentName, time: 300 - timer })}</p>
		</section>
	)
};

export default GameAlert;
