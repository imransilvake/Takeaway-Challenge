// react
import React, { Component } from 'react';

// app
import Button from '@material-ui/core/Button';
import i18n from '../../../../assets/i18n/i18n';

class Home extends Component {
	render() {
		return (
			<section className="tc-home tc-view-height">
				<div className="cd-vh-center cd-center-align tc-center">
					<h4>{i18n.t('HOME.TITLE')}</h4>
					<p>{i18n.t('HOME.SUBTITLE')}</p>
					<div className="tc-buttons">
						<Button>{i18n.t('HOME.BUTTONS.CPU')}</Button>
						<Button>{i18n.t('HOME.BUTTONS.REAL')}</Button>
					</div>
				</div>
			</section>
		);
	}
}

export default Home;
