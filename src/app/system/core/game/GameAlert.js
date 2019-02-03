// react
import React from 'react';

// app
import i18n from '../../../../assets/i18n/i18n';

const GameAlert = (props) => {
	return (
		<section className="tc-game-alert">
			<p>{i18n.t('GAME.ALERT', { type: props.userTurn ? 'Your' : 'CPU', time: 30 - props.timer })}</p>
		</section>
	)
};

export default GameAlert;
