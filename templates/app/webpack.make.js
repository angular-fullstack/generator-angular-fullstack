'use strict';
/*eslint-env node*/
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var fs = require('fs');
var path = require('path');
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    var BUILD = !!options.BUILD;
    var TEST = !!options.TEST;
    var E2E = !!options.E2E;
    var DEV = !!options.DEV;

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if(TEST) {
        config.entry = {};
    } else {
        config.entry = {
            app: './client/app/app.<%= scriptExt %>',
            polyfills: './client/polyfills.<%= scriptExt %>',
            vendor: [
                'angular',
                'angular-animate',
                'angular-aria',
                'angular-cookies',
                'angular-resource',
                <%_ if(filters.ngroute) { _%>
                'angular-route',<% } %>
                'angular-sanitize',
                <%_ if(filters.socketio) { _%>
                'angular-socket-io',<% } %>
                <%_ if(filters.uibootstrap) { -%>
                'angular-ui-bootstrap',<% } %>
                <%_ if(filters.uirouter) { _%>
                'angular-ui-router',<% } %>
                'lodash'
            ]
        };
    }

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    if(TEST) {
        config.output = {};
    } else {
        config.output = {
            // Absolute output directory
            path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),

            // Output path from the view of the page
            // Uses webpack-dev-server in development
            publicPath: BUILD || DEV || E2E ? '/' : `http://localhost:${8080}/`,
            //publicPath: BUILD ? '/' : 'http://localhost:' + env.port + '/',

            // Filename for entry points
            // Only adds hash in build mode
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

            // Filename for non-entry points
            // Only adds hash in build mode
            chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
        };
    }

    <%_ if(filters.ts) { _%>
    config.resolve = {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.ts']
    };<% } %>

    if(TEST) {
        config.resolve = {
            modulesDirectories: [
                'node_modules'
            ],
            extensions: ['', '.js', '.ts']
        };
    }

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if(TEST) {
        config.devtool = 'inline-source-map';
    } else if(BUILD || DEV) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    <%_ if(filters.sass) { _%>

    config.sassLoader = {
        outputStyle: 'compressed',
        precision: 10,
        sourceComments: false
    };<% } %>

    <%_ if(filters.babel) { -%>
    config.babel = {
        shouldPrintComment(commentContents) {
            <%_ if(filters.flow) { -%>
            let regex = DEV
                // keep `// @flow`, `/*@ngInject*/`, & flow type comments in dev
                ? /(@flow|@ngInject|^:)/
                // keep `/*@ngInject*/`
                : /@ngInject/;
            return regex.test(commentContents);
            <%_ } -%>
            <%_ if(!filters.flow) { -%>
            // keep `/*@ngInject*/`
            return /@ngInject/.test(commentContents);
            <%_ } -%>
        }
    }<% } %>

    // Initialize module
    config.module = {
        preLoaders: [],
        loaders: [{
            // JS LOADER
            // Reference: https://github.com/babel/babel-loader
            // Transpile .js files using babel-loader
            // Compiles ES6 and ES7 into ES5 code
            test: /\.js$/,
            loader: 'babel',
            include: [
                path.resolve(__dirname, 'client/'),
                path.resolve(__dirname, 'node_modules/lodash-es/')
            ]
        }, {
            // TS LOADER
            // Reference: https://github.com/s-panferov/awesome-typescript-loader
            // Transpile .ts files using awesome-typescript-loader
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            query: {
                tsconfig: path.resolve(__dirname, 'tsconfig.client.json')
            },
            include: [
                path.resolve(__dirname, 'client/')
            ]
        }, {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
            loader: 'file'
        }, {
            <%_ if(filters.pug) { _%>
            // Pug HTML LOADER
            // Reference: https://github.com/willyelm/pug-html-loader
            // Allow loading Pug throw js
            test: /\.(jade|pug)$/,
            loaders: ['pug-html']
        }, {<% } %>
            <%_ if(filters.html) { _%>
            // HTML LOADER
            // Reference: https://github.com/webpack/raw-loader
            // Allow loading html through js
            test: /\.html$/,
            loader: 'raw'
        }, {<% } %>
            // CSS LOADER
            // Reference: https://github.com/webpack/css-loader
            // Allow loading css through js
            //
            // Reference: https://github.com/postcss/postcss-loader
            // Postprocess your css with PostCSS plugins
            test: /\.css$/,
            loader: !TEST
                // Reference: https://github.com/webpack/extract-text-webpack-plugin
                // Extract css files in production builds
                //
                // Reference: https://github.com/webpack/style-loader
                // Use style-loader in development for hot-loading
                ? ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
                // Reference: https://github.com/webpack/null-loader
                // Skip loading css in test mode
                : 'null'
        }<% if(!filters.css) { %>, {
            <%_ if(filters.sass) { _%>
            // SASS LOADER
            // Reference: https://github.com/jtangelder/sass-loader
            test: /\.(scss|sass)$/,
            loaders: ['style', 'css', 'sass'],
            include: [
                path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/*.scss'),
                path.resolve(__dirname, 'client/app/app.scss')
            ]<% } %>
            <%_ if(filters.less) { _%>
            // LESS LOADER
            // Reference: https://github.com/
            test: /\.less$/,
            loaders: ['style', 'css', 'less'],
            include: [
                path.resolve(__dirname, 'node_modules/bootstrap/less/*.less'),
                path.resolve(__dirname, 'client/app/app.less')
            ]<% } %>
            <%_ if(filters.stylus) { _%>
            // Stylus LOADER
            // Reference: https://github.com/
            test: /\.styl$/,
            loaders: ['style', 'css', 'stylus?paths=node_modules/bootstrap-styl'],
            include: [
                path.resolve(__dirname, 'node_modules/bootstrap-styl/bootstrap/*.styl'),
                path.resolve(__dirname, 'client/app/app.styl')
            ]<% } %>
        }<% } %>]
    };

    config.module.postLoaders = [{
        test: /\.<%= scriptExt %>$/,
        loader: 'ng-annotate?single_quotes'
    }];

    <%_ if(filters.babel) { _%>
    // ISPARTA INSTRUMENTER LOADER
    // Reference: https://github.com/ColCh/isparta-instrumenter-loader
    // Instrument JS files with Isparta for subsequent code coverage reporting
    // Skips node_modules and spec files
    if(TEST) {
        config.module.preLoaders.push({
            //delays coverage til after tests are run, fixing transpiled source coverage error
            test: /\.js$/,
            exclude: /(node_modules|spec\.js|mock\.js)/,
            loader: 'isparta-instrumenter',
            query: {
                babel: {
                    // optional: ['runtime', 'es7.classProperties', 'es7.decorators']
                }
            }
        });
    }<% } %>
    <%_ if(filters.ts) { _%>
    //TODO: TS Instrumenter<% } %>

    /**
     * PostCSS
     * Reference: https://github.com/postcss/autoprefixer-core
     * Add vendor prefixes to your css
     */
    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        /*
         * Plugin: ForkCheckerPlugin
         * Description: Do type checking in a separate process, so webpack don't need to wait.
         *
         * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
         */
        new ForkCheckerPlugin(),

        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files
        // Disabled when in test mode or not in build mode
        new ExtractTextPlugin('[name].[hash].css', {
            disable: !BUILD || TEST
        })
    ];

    if(!TEST) {
        config.plugins.push(new CommonsChunkPlugin({
            name: 'vendor',

            // filename: "vendor.js"
            // (Give the chunk a different name)

            minChunks: Infinity
            // (with more entries, this ensures that no other module
            //  goes into the vendor chunk)
        }));
    }

    // Skip rendering index.html in test mode
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    let htmlConfig = {
        template: 'client/_index.html',
        filename: '../client/index.html',
        alwaysWriteToDisk: true
    }
    config.plugins.push(
      new HtmlWebpackPlugin(htmlConfig),
      new HtmlWebpackHarddiskPlugin()
    );

    // Add build specific plugins
    if(BUILD) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            }),

            // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
            // Define free global variables
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            })
        );
    }

    if(DEV) {
        config.plugins.push(
            // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
            // Define free global variables
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"development"'
                }
            })
        );
    }

    config.cache = DEV;

    if(TEST) {
        config.stats = {
            colors: true,
            reasons: true
        };
        config.debug = false;
    }

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './client/',
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        }
    };

    config.node = {
        global: 'window',
        process: true,
        crypto: 'empty',
        clearImmediate: false,
        setImmediate: false
    };

    return config;
};
