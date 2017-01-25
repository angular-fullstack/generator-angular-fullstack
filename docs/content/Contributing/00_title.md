## Contributing

## Releasing a new version

* Bump `package.json` version
* [
  * `grunt conventionalChangelog`
  * `cd angular-fullstack-deps`
    * `git checkout master`
    * `git pull`
    * `cd ..`
    * `gulp updateFixtures:deps`
    * `cd angular-fullstack-deps`
    * `git add .`
    * `git commit -m $VERSION`
    * `git push`
    * `# npm publish`
]
* `git add ./{CHANGELOG.md,angular-fullstack-deps,package.json}`
* `git commit -m $VERSION`
* `git push`
* `# npm publish`
