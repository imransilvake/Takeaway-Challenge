// react
import React, { Component } from 'react';

// app
import Icon from '@material-ui/core/Icon';

class Footer extends Component {
	render() {
		return (
			<section className="tc-footer tc-position-fixed tc-foot">
				<h6 className="cd-center-align">
					<Icon>copyright</Icon>&nbsp;Imran Khan
				</h6>
			</section>
		);
	}
}

export default Footer;
