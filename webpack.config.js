var webpack = require('webpack');
var path = require('path');
var assign = require('object-assign');
var nodeExternals = require('webpack-node-externals');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = function getConfig(options) {

  var options = options || {};

  var isProd = (options.BUILD_ENV || process.env.BUILD_ENV) === 'PROD';
  var isWeb = (options.TARGET_ENV || process.env.TARGET_ENV) === 'WEB';
  var isNode = (options.TARGET_ENV || process.env.TARGET_ENV) === 'NODE';
  var isTest = (options.TARGET_ENV || process.env.TARGET_ENV) === 'TEST';

  // get library details from JSON config
  var libraryDesc = require('./package.json').library;
  var libraryName = libraryDesc.name;

  // determine output file name
  var outputName = buildLibraryOutputName(libraryDesc, isWeb, isProd);
  var outputFolder = isWeb ? 'dist' : 'lib';

  // get base config
  var config;

  // for the web
  if(isWeb){
    var libraryEntryPoint = path.join('src', libraryDesc["entry-web"]);
    config = assign(getBaseConfig(isProd, libraryEntryPoint), {
      output: {
        path: path.join(__dirname, outputFolder),
        filename: outputName,
        library: 'geoOnFire',
        libraryTarget: 'umd',
        umdNamedDefine: true
      }
    });
  } else if (isNode) {
    var libraryEntryPoint = path.join('src', libraryDesc["entry-node"]);
    config = assign(getBaseConfig(isProd, libraryEntryPoint), {
      output: {
        path: path.join(__dirname, outputFolder),
        filename: outputName,
        library: libraryName,
        libraryTarget: 'commonjs2'
      },
      target: 'node',
      node: {
        __dirname: true,
        __filename: true
      },
      externals: [nodeExternals()]
    });
  } else if (isTest) {
    // test build - needed to run test bundle in a headless browser
    config = {
      entry: ['babel-polyfill', path.join(__dirname, './test/main.spec.js')],
      module: {
        loaders: [
          {test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: "babel-loader"},
        ]
      },
      resolve: {
        root: [path.resolve('./src'), 'node_modules/'],
        extensions: ['', '.js'],
      },
      output: {
        path: path.join(__dirname, 'test_dist'),
        filename: 'test.bundle.js',
        libraryTarget: 'umd',
      },
    };
  }

  //config.plugins.push(new CleanWebpackPlugin([outputFolder]));

  return config;
}

/**
 * Build base config
 * @param  {Boolean} isProd [description]
 * @return {[type]}         [description]
 */
function getBaseConfig(isProd, libraryEntryPoint) {

  // get library details from JSON config
  var libraryDesc = require('./package.json').library;

  // generate webpack base config
  return {
    entry: path.join(__dirname, libraryEntryPoint),
    output: {
      // ommitted - will be filled according to target env
    },
    module: {
      preLoaders: [
        {test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: "eslint-loader"}
      ],
      loaders: [
        {test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: "babel-loader"},
      ]
    },
    eslint: {
        configFile: './.eslintrc'
    },
    resolve: {
      root: path.resolve('./src'),
      extensions: ['', '.js']
    },
    devtool: isProd ? null : '#eval-source-map',
    debug: !isProd,
    plugins: isProd ? [
      new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"production"'}}),
      new UglifyJsPlugin({ minimize: true })
      // Prod plugins here
    ] : [
      new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"development"'}})
      // Dev plugins here
    ]
  };
}

function buildLibraryOutputName(libraryDesc, isWeb, isProd){
  if(isWeb){
    return libraryDesc["dist-web"] || [libraryDesc.name, 'web', (isProd ? 'min.js' : 'js')].join('.');
  } else {
    return libraryDesc["dist-node"] || [libraryDesc.name, (isProd ? 'min.js' : 'js')].join('.');
  }
}