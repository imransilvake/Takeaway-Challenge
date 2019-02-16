// react
import React from 'react';

// app
import PlayerImage from '../../../../../assets/images/player.png';
import Player2Image from '../../../../../assets/images/player2.png';
import CPUImage from '../../../../../assets/images/cpu.png';

const Moves = (props) => {
	const { history, gameState, scrollRef } = props;

	// set opponent image
	let opponentImage = CPUImage;
	if (gameState.type !== 'cpu') {
		opponentImage = Player2Image;
	}

	return (
		<section className="tc-game-moves">
			{
				history && history.length && history.map((item, i) => (
					<div key={i} className={!((i + 1) % 2 === 0) ? 'tc-user' : 'tc-user tc-opponent'}>
						<img className="tc-avatar" src={!((i + 1) % 2 === 0) ? PlayerImage : opponentImage} alt={gameState.type}/>
						<div className="tc-desc">
							{i !== 0 && (<h5>{history[i - 1] && history[i - 1].allowedNumber}</h5>)}
							{
								i !== 0 && (
									<p>[({history[i - 1] && history[i - 1].allowedNumber} + {history[i - 1] && history[i - 1].value}) / 3] = {item.value}</p>
								)
							}
							<p ref={history.length - 1 === i ? scrollRef : null}>{item.value}</p>
						</div>
					</div>
				))
			}
		</section>
	)
};

export default Moves;
