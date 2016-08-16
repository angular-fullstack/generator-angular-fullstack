## Prerequisites

Make sure you have all the required dependencies available:

```bash
npm install -g yo gulp-cli generator-angular-fullstack
```

If you're using MongoDB (which you probably are), you'll have to install it from [here](https://www.mongodb.com/download-center#community).
You should then run the `mongod` process, which is in `<install_path>/MongoDB/Server/<version>/bin/`. You'll also want a `/data/db` folder
somewhere for Mongo to put your database in. It would be wise to make a script to automate this command, and maybe even run this script on
your computer's startup. Example:

```bash
#!/bin/bash

/var/lib/mongo/server/3.2/bin/mongod --dbpath /data/db
```

Make a new directory, and `cd` into it:
```bash
mkdir myapp && cd $_
```

Run `yo angular-fullstack`, optionally passing an app name:
```bash
yo angular-fullstack
```

You'll then be asked a series of questions regarding options for the generated app. Such things include using JavaScript or TypeScript,
HTML or Pug, Bootstrap, SQL, and so on. If you don't know what to answer for a question, just hitting `ENTER` will use the default options
for that question, and move on to the next one.
