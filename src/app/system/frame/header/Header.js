// react
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Link from 'react-router-dom/es/Link';

// app
import Logo from '../../../../assets/images/logo.png';
import i18n from '../../../../assets/i18n/i18n';
import ENV from '../../../../environment/index';
import classNames from 'classnames/bind';
import { localStorageGet, localStoragePut } from '../../utilities/helpers/Storage';

class Header extends Component {
	state = {
		currentLanguage: 'en'
	};

	componentWillMount() {
		const currentLanguage = localStorageGet('TC_LANGUAGE', 'PERSISTENT');

		// set language state
		if (currentLanguage) {
			this.setState({ currentLanguage });
		}
	}

	render() {
		const { location } = this.props;
		const logoClass = classNames({
			'ts-disabled': location.pathname === ENV.ROUTING.GAME
		});

		return (
			<section className="tc-header">
				<div className="cd-row">
					<div className="cd-col cd-col-pd-d-8 cd-col-pd-w-8 tc-logo">
						<Link to={ENV.ROUTING.HOME} className={logoClass}>
							<img src={Logo} alt="logo"/>
						</Link>
					</div>
					<div className="cd-col cd-col-pd-d-4 cd-col-pd-w-4 cd-right-align tc-language">
						<button
							className={this.state.currentLanguage === 'en' ? 'tc-active' : null}
							type="button"
							onClick={this.handleLanguageChange('en')}>
							EN
						</button>
						<span> / </span>
						<button
							className={this.state.currentLanguage === 'de' ? 'tc-active' : null}
							type="button"
							onClick={this.handleLanguageChange('de')}>
							DE
						</button>
					</div>
				</div>
			</section>
		);
	}

	/**
	 * handle language change event
	 *
	 * @param language
	 * @returns {Function}
	 */
	handleLanguageChange = language => () => {
		i18n
			.changeLanguage(language)
			.then(() => {
				// save language
				localStoragePut('TC_LANGUAGE', language, 'PERSISTENT');

				// set language state
				this.setState({ currentLanguage: language })
			});
	}
}

export default withRouter(Header);
