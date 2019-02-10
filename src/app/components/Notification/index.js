// react
import React from 'react';

const Notification = ({ children, ...rest }) => (
	<span className="tc-game-notification">
		<section {...rest}>
			{children}
		</section>
	</span>
);

export default Notification;
