## Installation

Run `yo angular-fullstack` (optionally passing an app name):
```bash
yo angular-fullstack
```

You'll then be asked a series of questions regarding options for the generated app. Such things include using JavaScript or TypeScript,
HTML or Pug, Bootstrap, SQL, and so on. If you don't know what to answer for a question, or just want to use our preferred options,
hitting `ENTER` will use the default options for that question, and move on to the next one.

Once you've answered all the questions, a project will be scaffolded for you according to the options you entered. Then, npm dependencies
will automatically be installed. Once that's all complete, you're ready to get started with your app!

## Git

Run the following:
```bash
git init && git add . && git commit -m 'Initial Commit'
```

Go to https://github.com/new and enter a repository name. Click 'Create repository'. Then push to your remote repository with these commands:

```bash
git remote add origin git@github.com:<YOUR_USERNAME>/<YOUR_APPNAME>.git
git push -u origin master
```

> Note: replace `<YOUR_USERNAME>` & `<YOUR_APPNAME>` with your GitHub username and repository name.

Commit early and commit often. Branches are cheap; use them often.
