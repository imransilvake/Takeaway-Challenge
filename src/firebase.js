// firebase
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

// initialize firebase
const config = {
	apiKey: 'AIzaSyCT5RaMkVU9ebEcBbBGA1yW3K5TpSP5DmE',
	authDomain: 'takeaway-challenge.firebaseapp.com',
	databaseURL: 'https://takeaway-challenge.firebaseio.com',
	projectId: 'takeaway-challenge',
	storageBucket: 'takeaway-challenge.appspot.com',
	messagingSenderId: '1010334517367'
};
firebase.initializeApp(config);

export default firebase;
