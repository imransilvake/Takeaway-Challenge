// react
import React, { Component } from 'react';

// app
import i18n from '../../../../assets/i18n/i18n';

class Component404 extends Component {
	render() {
		return (
			<section className="tc-404 tc-view-height cd-center-align">
				<div className="cd-vh-center">
					<p>{i18n.t('404')}</p>
				</div>
			</section>
		);
	}
}

export default Component404;
