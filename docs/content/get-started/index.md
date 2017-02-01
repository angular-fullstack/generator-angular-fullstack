---
title: Getting Started
sort: 0
---

## Prerequisites

### npm modules

Make sure you have all the required Node dependencies available:

```bash
npm install -g yo gulp-cli generator-angular-fullstack
```

### MongoDB

If you're using MongoDB (which you probably are), you'll have to install it from [here](https://www.mongodb.com/download-center#community).
You should then run the `mongod` process, which is in `<install_path>/MongoDB/Server/<version>/bin/`. You'll also want a `/data/db` folder
somewhere for Mongo to put your database in. It would be wise to make a script to automate this command, and maybe even run this script on
your computer's startup. Example:

```bash
#!/bin/bash

/var/lib/mongo/server/3.2/bin/mongod --dbpath /data/db
```

### node-gyp

`node-gyp` is a cross-platform command-line tool written in Node.js for compiling native addon modules for Node.js. You'll need it for things like brotli compression.

Read through the [Installation section of the `node-gyp` readme](https://github.com/nodejs/node-gyp#installation). Basically you'll need [Python 2.7](https://www.python.org/downloads/), `make`, and a C/C++ compiler (like GCC on unix, Xcode on OS X, or Visual Studio tools on Windows). To tell npm to use Python 2.7 (if you also have a different version installed), run `npm config set python /path/to/executable/python2.7`. Here's a snapshot of the instructions from their readme:

  * On Unix:
    * `python` (`v2.7` recommended, `v3.x.x` is __*not*__ supported)
    * `make`
    * A proper C/C++ compiler toolchain, like [GCC](https://gcc.gnu.org)
  * On Mac OS X:
    * `python` (`v2.7` recommended, `v3.x.x` is __*not*__ supported) (already installed on Mac OS X)
    * [Xcode](https://developer.apple.com/xcode/download/)
      * You also need to install the `Command Line Tools` via Xcode. You can find this under the menu `Xcode -> Preferences -> Downloads`
      * This step will install `gcc` and the related toolchain containing `make`
  * On Windows:
    * Option 1: Install all the required tools and configurations using Microsoft's [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) using `npm install --global --production windows-build-tools` from an elevated PowerShell or CMD.exe (run as Administrator).
    * Option 2: Install tools and configuration manually:
      * Visual C++ Build Environment:
        * Option 1: Install [Visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools) using the **Default Install** option.

        * Option 2: Install [Visual Studio 2015](https://www.visualstudio.com/products/visual-studio-community-vs) (or modify an existing installation) and select *Common Tools for Visual C++* during setup. This also works with the free Community and Express for Desktop editions.

        > :bulb: [Windows Vista / 7 only] requires [.NET Framework 4.5.1](http://www.microsoft.com/en-us/download/details.aspx?id=40773)

      * Install [Python 2.7](https://www.python.org/downloads/) (`v3.x.x` is not supported), and run `npm config set python python2.7` (or see below for further instructions on specifying the proper Python version and path.)
      * Launch cmd, `npm config set msvs_version 2015`

    If the above steps didn't work for you, please visit [Microsoft's Node.js Guidelines for Windows](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules) for additional tips.

### Create a new folder for your project

Make a new directory, and `cd` into it:
```bash
mkdir myapp && cd $_
```
