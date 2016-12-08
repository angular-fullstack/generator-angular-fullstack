After you have generated the app, go to heroku.com and create and application manually (ex. foo-bar-42424). Then, starting frome the root folder, run the following commands:

* `grunt build`
* `cd dist
* `heroku login` (if you are not already authenticated)
* `heroku git:remote -a foo-bar-42424`
* `cd ..`
* `grunt build` (not sure if this one is necessary)
* `grunt buildcontrol:heroku`

-- [@flaurian](https://github.com/flaurian) via [#1966](https://github.com/angular-fullstack/generator-angular-fullstack/issues/1966#issuecomment-231297368)
