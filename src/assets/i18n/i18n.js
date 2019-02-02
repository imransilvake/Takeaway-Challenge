// react
import i18n from 'i18next';

// i18n
import detector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

// app
import translationEN from './locales/en';
import translationDE from './locales/de';
import { localStorageGet } from '../../app/system/utilities/helpers/Storage';

// add translations
const resources = {
	en: { translation: translationEN },
	de: { translation: translationDE }
};

// get current language from local storage
const currentLanguage = localStorageGet('TC_LANGUAGE', 'PERSISTENT');

// init i18n
i18n
	.use(detector)
	.use(reactI18nextModule) // passes i18n down to react-i18next
	.init({
		resources,
		lng: currentLanguage || 'en',
		interpolation: { escapeValue: false } // react already safes from xss
	})
	.then();

export default i18n;
