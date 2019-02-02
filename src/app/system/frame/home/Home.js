// react
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// app
import Button from '@material-ui/core/Button';
import i18n from '../../../../assets/i18n/i18n';
import ENV from '../../../../environment/index';

class Home extends Component {
	render() {
		return (
			<section className="tc-home tc-view-height">
				<div className="cd-vh-center cd-center-align tc-center">
					<h4>{i18n.t('HOME.TITLE')}</h4>
					<p>{i18n.t('HOME.SUBTITLE')}</p>
					<div className="tc-buttons">
						<Link to={ENV.ROUTING.GAME}>
							<Button>{i18n.t('HOME.BUTTONS.CPU')}</Button>
							<Button>{i18n.t('HOME.BUTTONS.REAL')}</Button>
						</Link>
					</div>
				</div>
			</section>
		);
	}
}

export default Home;
