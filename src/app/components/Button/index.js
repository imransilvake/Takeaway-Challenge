// react
import React from 'react';

// app
import Button from '@material-ui/core/Button';

const ButtonCustom = ({ children, ...rest }) => (
	<span className="tc-custom-button">
		<Button {...rest}>
			{children}
		</Button>
	</span>
);

export default ButtonCustom;
