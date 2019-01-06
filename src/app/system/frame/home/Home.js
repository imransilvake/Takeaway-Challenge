// react
import React, { Component } from 'react';

// app
import i18n from '../../../../assets/i18n/i18n';

class Home extends Component {
	render() {
		return (
			<section className="sc-app cd-vh-center cd-center-align">
				<h2>React</h2>
				<p>{i18n.t('WELCOME')}</p>
			</section>
		);
	}
}

export default Home;
