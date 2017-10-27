var fbServerMiddleware = require('./test/middleware/firebase-server.middleware.js');

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: ['./test_dist/test.bundle.js'],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    autoWatch: false,
    concurrency: Infinity,
    beforeMiddleware: ['custom'],
    plugins: [
      'karma-*',
      {
        'middleware:custom': ['factory', function (config) {
          return fbServerMiddleware;
        }],
      },
    ],
  })
}