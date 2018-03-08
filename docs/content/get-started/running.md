---
title: Running
sort: 2
---

## Running Your New App

You can start your new app by running `npm run start:server` and `npm run start:client`. This will start up the Node.js
back-end server, as well as a Webpack dev server to serve the front-end files (with things like Hot Module Replacement).
Your files will be watched for changes. Any front-end changes will be seen by the Webpack server, and any back-end
changes will restart the back-end server, cleaning the development database and re-seeding it as well.

The `npm run start:client` task will show you at which local port you can access your front-end app (usually http://localhost:8080/).
