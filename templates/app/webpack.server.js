const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.make')({ DEV: true });
const appConfig = require('./server/config/environment');
const devServerEntry = [`webpack-dev-server/client?http://localhost:${appConfig.clientPort}/`, 'webpack/hot/dev-server'];

config.entry.app = devServerEntry.concat(config.entry.app);

console.log(config.entry);
console.log(config.entry.app);

const compiler = webpack(config);

export const server = new WebpackDevServer(compiler, {
    contentBase: './client/',

    hot: true,

    historyApiFallback: true,

    stats: {
        modules: false,
        cached: false,
        colors: true,
        chunk: false
    },
    quiet: false,
    noInfo: false,

    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:9000',
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:9000',
        secure: false,
      },
    },
});

/**
 * Starts the dev server
 * @returns {Promise}
 */
export function start() {
    return new Promise(resolve => {
        server.listen(appConfig.clientPort, resolve);
    });
}
