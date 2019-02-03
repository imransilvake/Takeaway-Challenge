// react
import React from 'react';

// app
import PlayerImage from '../../../../assets/images/player-dp.png';
import CPUImage from '../../../../assets/images/cpu-dp.png';

const GameMoves = (props) => {
	const { history } = props.history;

	return (
		<section className="tc-game-moves">
			{
				history && history.length && history.map((item, i) => (
					<div key={i} className={!item.userTurn ? 'tc-user' : 'tc-user tc-opponent'}>
						<img className="tc-avatar" src={!item.userTurn ? PlayerImage : CPUImage} alt="cpu"/>
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
