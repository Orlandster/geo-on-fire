var firebase = require('firebase');
var FirebaseServer = require('firebase-server');
var detect = require('detect-port');
var initialData = require('../data/firebase.data.umd.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = async(function (request, response, next) {
  var server;
  var port = await(detect(5000));
  if (port === 5000) {
    server = new FirebaseServer(5000, '127.0.0.1', {
      test: JSON.parse(initialData),
    });
  }

  next();
});