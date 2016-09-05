###Openshift

> Note: Openshift uses a quite old version of Node by default. We strongly recommend updating your Node version. [Here's a helpful article](https://blog.openshift.com/any-version-of-nodejs-you-want-in-the-cloud-openshift-does-it-paas-style/).

Deploying to OpenShift can be done in just a few steps:

    yo angular-fullstack:openshift

A live application URL will be available in the output.

> **oAuth**
>
> If you're using any oAuth strategies, you must set environment variables for your selected oAuth. For example, if we're using Facebook oAuth we would do this :
>
>     rhc set-env FACEBOOK_ID=id -a my-openshift-app
>     rhc set-env FACEBOOK_SECRET=secret -a my-openshift-app
>
> You will also need to set `DOMAIN` environment variable:
>
>     rhc set-env DOMAIN=<your-openshift-app-name>.rhcloud.com
>
>     # or (if you're using it):
>
>     rhc set-env DOMAIN=<your-custom-domain>
>
> After you've set the required environment variables, restart the server:
>
>     rhc app-restart -a my-openshift-app

To make your deployment process easier consider using [grunt-build-control](https://github.com/robwierzbowski/grunt-build-control).

**Pushing Updates**

    gulp build

Commit and push the resulting build, located in your dist folder:

    gulp buildcontrol:openshift
