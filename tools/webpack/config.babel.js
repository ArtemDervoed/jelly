/* eslint-disable */

import path from 'path';
import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';

// Globale config settings
// Disable CSSModules here
const CSSModules = true;
// Enable build process terminated while there's an eslint error
const eslint = false;
// Enable build process terminated while there's an stylelint error
const stylelint = false;

// Setup the plugins for development/prodcution
const getPlugins = () => {
  // Common
  const plugins = [
    new ExtractTextPlugin({
      filename: '[name].[chunkhash:8].css',
      allChunks: true,
      disable: isDev, // Disable css extracting on development
      ignoreOrder: CSSModules,
    }),
    new ManifestPlugin({
      fileName: path.resolve(process.cwd(), 'public/webpack-assets.json'),
      filter: file => file.isInitial
    }),
    // Stylelint
    new StyleLintPlugin({ failOnError: stylelint }),
    // Setup enviorment variables for client
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    // Setup global variables for client
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: isDev
    }),
    new FriendlyErrorsWebpackPlugin()
  ];

  if (isDev) {
    // Development
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(
      // Production
      new webpack.HashedModuleIdsPlugin(),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.jsx?$|\.css$|\.(scss|sass)$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      // Plugin to compress images with imagemin
      // Check "https://github.com/Klathmon/imagemin-webpack-plugin" for more configurations
      new ImageminPlugin({
        pngquant: { quality: '95-100' }
      }),
      // Visualize all of the webpack bundles
      // Check "https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin"
      // for more configurations
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.NODE_ENV === 'analyze' ? 'server' : 'disabled'
      })
    );
  }

  return plugins;
};

// Setup the entry for development/production
const getEntry = () => {
  // Development
  let entry = ['webpack-hot-middleware/client?reload=true', './src/client.js'];

  // Prodcution
  if (!isDev) entry = ['./src/client.js'];

  return entry;
};

// Webpack configuration
module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-source-map' : 'hidden-source-map',
  context: path.resolve(process.cwd()),
  entry: getEntry(),
  optimization: {
    splitChunks: {
      // Auto split vendor modules in production only
      chunks: isDev ? 'async' : 'all'
    }
  },
  output: {
    path: path.resolve(process.cwd(), 'public/assets'),
    publicPath: '/assets/',
    // Don't use chunkhash in development it will increase compilation time
    filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    pathinfo: isDev
  },
  module: {
    rules: [
      {
        // Eslint
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint',
        options: { failOnError: eslint }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        options: {
          cacheDirectory: isDev,
          babelrc: false,
          presets: [
            ['@babel/preset-env', { modules: false, useBuiltIns: 'usage' }],
            '@babel/preset-react',
            ['@babel/preset-stage-0', { decoratorsLegacy: true }]
          ],
          plugins: [
            'react-hot-loader/babel',
            'loadable-components/babel',
            'lodash'
          ],
          env: { production: { plugins: ['transform-remove-console'] } }
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
            {
              loader: 'css',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: CSSModules,
                context: path.join(process.cwd(), './src'),
                localIdentName: '[name]__[local]--[hash:base64:5]',
                minimize: !isDev,
              },
            },
            { loader: 'postcss', options: { sourceMap: true } },
          ],
        }),
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
            {
              loader: 'css',
              options: {
                importLoaders: 2,
                sourceMap: true,
                modules: CSSModules,
                context: path.join(process.cwd(), './src'),
                localIdentName: '[name]__[local]--[hash:base64:5]',
                minimize: !isDev,
              },
            },
            { loader: 'postcss', options: { sourceMap: true } },
            {
              loader: 'sass',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
                sourceMapContents: !isDev,
              },
            },
          ],
        }),
      },
      {
        test: /\.(woff2?|ttf|eot|svg)$/,
        loader: 'url',
        options: { limit: 10240, name: '[name].[hash:8].[ext]' }
      },
      {
        test: /\.(gif|png|jpe?g|webp)$/,
        // Any image below or equal to 10K will be converted to inline base64 instead
        loader: 'url',
        options: { limit: 10240, name: '[name].[hash:8].[ext]' }
      }
    ]
  },
  plugins: getPlugins(),
  /* Advanced configuration */
  resolveLoader: {
    // Use loaders without the -loader suffix
    moduleExtensions: ['-loader']
  },
  resolve: {
    modules: ['src', 'node_modules'],
    descriptionFiles: ['package.json'],
    alias: {
      _constants: path.resolve(process.cwd(), 'src/actions/constants'),
      _actions: path.resolve(process.cwd(), 'src/actions'),
      _api: path.resolve(process.cwd(), 'src/api'),
      _sagas: path.resolve(process.cwd(), 'src/sagas'),
      _config: path.resolve(process.cwd(), 'src/config'),
      _reducers: path.resolve(process.cwd(), 'src/reducers'),
      _store: path.resolve(process.cwd(), 'src/store'),
      _pages: path.resolve(process.cwd(), 'src/pages'),
      _containers: path.resolve(process.cwd(), 'src/containers'),
      _components: path.resolve(process.cwd(), 'src/components'),
      _pages: path.resolve(process.cwd(), 'src/pages'),
      _styles: path.resolve(process.cwd(), 'src/styles'),
      _images: path.resolve(process.cwd(), 'src/assets/images'),
      _selectors: path.resolve(process.cwd(), 'src/selectors'),
      _utils: path.resolve(process.cwd(), './src/utils'),
      _data: path.resolve(process.cwd(), './src/data'),
    },
    extensions: ['.js', '.jsx', '.json']
  },
  cache: isDev,
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
