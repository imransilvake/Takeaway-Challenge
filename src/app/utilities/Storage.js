/**
 * set item to local or session storage
 *
 * @param key
 * @param value
 * @param storageType
 */
export const localStoragePut = (key, value, storageType) => {
	switch (storageType) {
		case 'PERSISTENT':
			localStorage.setItem(key, JSON.stringify(value));
			break;

		case 'SESSION':
			sessionStorage.setItem(key, JSON.stringify(value));
			break;

		default:
			localStorage.setItem(key, JSON.stringify(value));
	}
};

/**
 * check if item exist in local or session storage
 *
 * @param {string} key
 * @param storageType
 * @returns {boolean}
 */
export const localStorageExists = (key, storageType) => {
	switch (storageType) {
		case 'PERSISTENT':
			return localStorage.getItem(key) !== null;

		case 'SESSION':
			return sessionStorage.getItem(key) !== null;

		default:
			return localStorage.getItem(key) !== null;
	}
};

/**
 * get item from local or session storage
 *
 * @param {string} key
 * @param storageType
 * @returns {any}
 */
export const localStorageGet = (key, storageType) => {
	switch (storageType) {
		case 'PERSISTENT':
			return JSON.parse(localStorage.getItem(key));

		case 'SESSION':
			return JSON.parse(sessionStorage.getItem(key));

		default:
			return JSON.parse(localStorage.getItem(key));
	}
};

/**
 * delete item from local or session storage
 *
 * @param {string} key
 * @param storageType
 */
export const localStorageRemove = (key, storageType) => {
	switch (storageType) {
		case 'PERSISTENT':
			if (localStorageExists(key, storageType)) {
				localStorage.removeItem(key);
			}
			break;

		case 'SESSION':
			if (localStorageExists(key, storageType)) {
				sessionStorage.removeItem(key);
			}
			break;

		default:
			localStorage.removeItem(key);
	}
};
