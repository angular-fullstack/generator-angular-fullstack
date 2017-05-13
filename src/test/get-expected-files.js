const mapping = {
  stylesheet: {
    sass: 'scss',
    stylus: 'styl',
    less: 'less',
    css: 'css'
  },
  markup: {
    pug: 'pug',
    html: 'html'
  },
  script: {
    js: 'js',
    ts: 'ts'
  }
};

/**
 * Generate an array of OAuth files based on type
 *
 * @param  {String} type - type of oauth
 * @return {Array}       - array of files
 *
 */
var oauthFiles = type => ([
  `server/auth/${type}/index.js`,
  `server/auth/${type}/passport.js`,
]);

/**
 * Generate an array of files to expect from a set of options
 *
 * @param  {Object} options - generator options
 * @return {Array}      - array of files
 *
 */
export function app(options) {
  let script = mapping.script[options.transpiler === 'ts' ? 'ts' : 'js'];
  let markup = mapping.markup[options.markup];
  let stylesheet = mapping.stylesheet[options.stylesheet];
  let models = options.models ? options.models : options.odms[0];

  /* Core Files */
  let files = [
    'client/favicon.ico',
    'client/robots.txt',
    'client/_index.html',
    'client/app/app.' + script,
    'client/app/app.component.' + script,
    'client/app/app.config.' + script,
    'client/app/app.constants.' + script,
    'client/app/app.module.' + script,
    'client/app/app.' + stylesheet,
    `client/app/polyfills.${script}`,
    'client/app/main/main.component.' + script,
    'client/app/main/main.component.spec.' + script,
    'client/app/main/main.module.' + script,
    'client/app/main/main.' + markup,
    'client/app/main/main.' + stylesheet,
    'client/assets/images/yeoman.png',
    'client/components/directives.module.' + script,
    'client/components/util.' + script,
    'client/components/util.spec.' + script,
    'client/components/footer/footer.' + stylesheet,
    'client/components/footer/footer.' + markup,
    'client/components/footer/footer.component.' + script,
    'client/components/navbar/navbar.' + markup,
    'client/components/navbar/navbar.component.' + script,
    'server/.eslintrc',
    'server/app.js',
    'server/index.js',
    'server/routes.js',
    'server/api/thing/index.js',
    'server/api/thing/index.spec.js',
    'server/api/thing/thing.controller.js',
    'server/api/thing/thing.integration.js',
    'server/components/errors/index.js',
    'server/config/local.env.js',
    'server/config/local.env.sample.js',
    'server/config/express.js',
    'server/config/environment/index.js',
    'server/config/environment/development.js',
    'server/config/environment/production.js',
    'server/config/environment/test.js',
    'server/config/environment/shared.js',
    'server/views/404.' + markup,
    'e2e/main/main.po.js',
    'e2e/main/main.spec.js',
    'e2e/components/navbar/navbar.po.js',
    '.babelrc',
    '.buildignore',
    '.editorconfig',
    '.eslintrc',
    '.gitattributes',
    '.gitignore',
    '.travis.yml',
    '.yo-rc.json',
    'gulpfile.babel.js',
    'package.json',
    'karma.conf.js',
    'mocha.conf.js',
    'mocha.global.js',
    'protractor.conf.js',
    'README.md',
    'spec.js',
    'webpack.build.js',
    'webpack.dev.js',
    'webpack.make.js',
    'webpack.test.js',
    'webpack.server.js'
  ];

  /* TypeScript */
  if (options.transpiler === 'ts') {
    files = files.concat([
      'tsconfig.client.test.json',
      'tsconfig.json',
      'client/tslint.json'
    ]);
  } else {
    files = files.concat([
      'client/.eslintrc'
    ]);
  }

  /* Flow */
  if(options.flow) {
    files.push('.flowconfig');
  }

  /* Ui-Router */
  if (options.router === 'uirouter') {
    files = files.concat([
      'client/components/ui-router/ui-router.mock.' + script
    ]);
  }

  /* Models - Mongoose or Sequelize */
  if (models) {
    files = files.concat([
      'server/api/thing/thing.model.js',
      'server/api/thing/thing.events.js',
      'server/config/seed.js'
    ]);
  }

  /* Sequelize */
  if (options.odms.indexOf('sequelize') !== -1) {
    files = files.concat([
      'server/sqldb/index.js'
    ]);
  }

  /* Authentication */
  if (options.auth) {
    files = files.concat([
      'client/app/account/account.module.' + script,
      'client/app/account/account.routes.' + script,
      'client/app/account/login/login.' + markup,
      'client/app/account/login/login.component.' + script,
      'client/app/account/settings/settings.' + markup,
      'client/app/account/settings/settings.component.' + script,
      'client/app/account/signup/signup.' + markup,
      'client/app/account/signup/signup.component.' + script,
      'client/app/admin/admin.' + markup,
      'client/app/admin/admin.' + stylesheet,
      'client/app/admin/admin.component.' + script,
      'client/app/admin/admin.module.' + script,
      'client/app/admin/admin.routes.' + script,
      'client/components/auth/auth.module.' + script,
      'client/components/auth/auth.service.' + script,
      'client/components/auth/interceptor.service.' + script,
      'client/components/auth/router.decorator.' + script,
      'client/components/auth/user.service.' + script,
      'client/components/mongoose-error/mongoose-error.directive.' + script,
      'server/api/user/index.js',
      'server/api/user/index.spec.js',
      'server/api/user/user.controller.js',
      'server/api/user/user.integration.js',
      'server/api/user/user.model.js',
      'server/api/user/user.model.spec.js',
      'server/api/user/user.events.js',
      'server/auth/index.js',
      'server/auth/auth.service.js',
      'server/auth/local/index.js',
      'server/auth/local/passport.js',
      'e2e/account/login/login.po.js',
      'e2e/account/login/login.spec.js',
      'e2e/account/logout/logout.spec.js',
      'e2e/account/signup/signup.po.js',
      'e2e/account/signup/signup.spec.js'
    ]);
  }

  if (options.oauth && options.oauth.length) {
    /* OAuth (see oauthFiles function above) */
    options.oauth.forEach(type => {
      files = files.concat(oauthFiles(type.replace('Auth', '')));
    });


    files = files.concat([
      'client/components/oauth-buttons/oauth-buttons.' + stylesheet,
      'client/components/oauth-buttons/oauth-buttons.' + markup,
      'client/components/oauth-buttons/oauth-buttons.component.' + script,
      'client/components/oauth-buttons/oauth-buttons.component.spec.' + script,
      'e2e/components/oauth-buttons/oauth-buttons.po.js'
    ]);
  }

  /* WebSockets */
  if (options.ws) {
    files = files.concat([
      'client/components/socket/socket.service.' + script,
      'client/components/socket/socket.mock.' + script,
      'server/api/thing/thing.socket.js',
      'server/config/websockets.js'
    ]);
  }

  return files;
}

export function endpoint(name, path) {
  if(!path) path = name;
  return [
    `server/api/${path}/index.js`,
    `server/api/${path}/index.spec.js`,
    `server/api/${path}/${name}.controller.js`,
    `server/api/${path}/${name}.events.js`,
    `server/api/${path}/${name}.integration.js`,
    `server/api/${path}/${name}.model.js`,
    `server/api/${path}/${name}.socket.js`
  ];
}
