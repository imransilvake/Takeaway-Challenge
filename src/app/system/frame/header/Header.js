// react
import React, { Component } from 'react';

// app
import Logo from '../../../../assets/images/logo.png';
import i18n from '../../../../assets/i18n/i18n';
import { localStoragePut } from '../../utilities/helpers/Storage';

class Header extends Component {
	render() {
		return (
			<section className="tc-header">
				<div className="cd-row">
					<div className="cd-col cd-col-pd-d-8 cd-col-pd-w-8 tc-logo">
						<img src={Logo} alt="logo"/>
					</div>
					<div className="cd-col cd-col-pd-d-4 cd-col-pd-w-4 cd-right-align tc-language">
						<button type="button" onClick={this.handleLanguageChange('en')}>EN</button>
						<span> / </span>
						<button type="button" onClick={this.handleLanguageChange('de')}>DE</button>
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
    		.then(() => localStoragePut('TC_LANGUAGE', language, 'PERSISTENT'));
    }
}

export default Header;
