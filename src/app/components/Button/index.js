// react
import React from 'react';

// app
import MaterialButton from '@material-ui/core/Button';

const Button = ({ children, ...rest }) => (
	<span className="tc-custom-button">
		<MaterialButton {...rest}>
			{children}
		</MaterialButton>
	</span>
);

export default Button;
