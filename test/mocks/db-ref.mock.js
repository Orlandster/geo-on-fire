import firebase from 'firebase';

before(done => {
  firebase.initializeApp({ databaseURL: 'ws://127.0.1:5000' });
  window.dbRef = firebase.app().database().ref().child('test');
  done();
});