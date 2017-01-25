# Contributing

From adding an issue for a documentation suggestion to creating a pull request: every contribution is appreciated and welcome. If you're planning to implement a new section or page please create an issue first.

## Setup

* Install [Node.js](https://nodejs.org/) if you have not already.
  *Note: Node 6.9.* is required for "best results".*. Node 7 may have issues!
* Fork the **webpack.js.org** repo at [https://github.com/webpack/webpack.js.org](https://github.com/webpack/webpack.js.org).
* `git clone <your-clone-url> && cd webpack.js.org`
* `npm install`
* `npm run build`
* `npm start`
* Visit [http://localhost:3000](http://localhost:3000) to preview your changes before making a pull request.

## Contributor License Agreement

When submitting your contribution, a CLA (Contributor License Agreement) bot will come by to verify that you signed the CLA. If it is your first time, it will link you to the right place to sign it. However, if you have committed your contributions using an email that is not the same as your email used on GitHub, the CLA bot can't accept your contribution.

Run `git config user.email` to see your Git email, and verify it with [your GitHub email](https://github.com/settings/emails).

## Editor Config

The [.editorconfig](https://github.com/webpack/webpack.js.org/blob/master/.editorconfig) in the root should ensure consistent formatting. Please make sure you've [installed the plugin](http://editorconfig.org/#download) if your text editor needs one.

## Branching Your Changes

Making a branch in your fork for your contribution is helpful in the following ways:

* It allows you to have multiple contributions in as PRs at once.
* It allows us to identify what your contribution is about from the branch name.

## Submitting Changes

After getting some feedback, push to your fork branch and submit a pull request. We may suggest some changes or improvements or alternatives, but for small changes your pull request should be accepted quickly.

Issue the PR to the [master](https://github.com/webpack/webpack.js.org/tree/master) branch.

> See [GitHub documentation](https://help.github.com/articles/proposing-changes-to-your-work-with-pull-requests/) for more help.

## Contribution Recognition

Any document that you edit, you can choose to add your GitHub username at the top of the document for recognition:

**example.md**

```markdown
===
title: Some Example Page
contributors:
  - TheLarkInn
  - Sokra
  - bebraw
  - Jhnns
  - SpaceK33z
===

## Some Documentation

```

This will add your name and GitHub profile photo to the document in production. This is a great way to own the awesome work that you do and encourage that you remember to do this in your PR's.


## Thank you

webpack is insanely feature rich and documentation is a huge time sink. We greatly appreciate any time spent fixing typos or clarifying sections in the documentation.
