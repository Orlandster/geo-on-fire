var firebase = require('firebase');
var FirebaseServer = require('firebase-server');
var detect = require('detect-port');
var initialData = require('../data/firebase.data.umd.js');

module.exports = async function (request, response, next) {
  let server;
  const port = await detect(5000);
  if (port === 5000) {
    server = new FirebaseServer(5000, '127.0.0.1', {
      test: JSON.parse(initialData),
    });
  }

  next();
};