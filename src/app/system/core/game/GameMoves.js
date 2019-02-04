// react
import React from 'react';

// app
import PlayerImage from '../../../../assets/images/player.png';
import Player2Image from '../../../../assets/images/player2.png';
import CPUImage from '../../../../assets/images/cpu.png';

const GameMoves = (props) => {
	let opponentImage = CPUImage;
	const { history, gameType } = props;

	// choose player Image
	if (gameType !== 'cpu') {
		opponentImage = Player2Image;
	}

	return (
		<section className="tc-game-moves">
			{
				history && history.length && history.map((item, i) => (
					<div key={i} className={!item.firstPlayerTurn ? 'tc-user' : 'tc-user tc-opponent'}>
						<img className="tc-avatar" src={!item.firstPlayerTurn ? PlayerImage : opponentImage} alt={gameType}/>
						<div className="tc-desc">
							{item.action && (<h5>{item.action}</h5>)}
							{
								item.action && (
									<p>[({item.action} + {history[i - 1] && history[i - 1].number}) / 3] = {item.number}</p>
								)
							}
							<p ref={history.length - 1 === i ? props.myRef : null}>{item.number}</p>
						</div>
					</div>
				))
			}
		</section>
	)
};

export default GameMoves;
