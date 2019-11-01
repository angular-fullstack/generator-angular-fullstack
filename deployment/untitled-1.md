# Google Cloud Deployment

The following are the instructions to deploy the angular-fullstack app to Google Cloud App Engine Standard Environment

## Prequsites

### 1. Google Cloud SDK

Download and install [Google Cloud SDK](https://cloud.google.com/sdk/)

### 2. Create GCP Project

```bash
  gcloud projects create [PROJECT_ID]
```

`[PROJECT_ID]` ID for the project you want to create.

### 3. Enable Billing

You need to enable billing for your project before you begin using App Engine

```bash
  gcloud alpha billing projects link my-project \ 
      --billing-account 0X0X0X-0X0X0X-0X0X0X
```

[gcloud alpha billing projects link](https://cloud.google.com/sdk/gcloud/reference/alpha/billing/projects/link)

### 4. Create a MongoDB database

Create a MongoDB instance and obtain the uri and credentials. There are multiple options for creating a new MongoDB database.

* Create a Google Compute Engine virtual machine with [MongoDB pre-installed](https://cloud.google.com/launcher/?q=mongodb).
* Create a MongoDB instance with [MongoDB Atlas on GCP](https://www.mongodb.com/cloud/atlas/mongodb-google-cloud).
* Use [mLab](https://mlab.com/google) to create a free MongoDB deployment on Google Cloud Platform.

## Deployment Setup

### 1. Set Node / NPM versions

```text
GCloud App Engine supports only the newest version of Node.js 8
```

```javascript
    "engines": {
    "node": ">=8.0",
    "npm": "^5.1.1"
  },
```

### 2. Create Application configuration file \(app.yaml\)

```text
A Node.js app in App Engine is configured through a file named app.yaml, that contains runtime, handlers, 
scaling, and other general settings including environment variables.

2.1 create a 'app.yaml' file with the following contents
```

```yaml
    env: standard 

    runtime: nodejs8

    env_variables:
      MONGODB_URI:  "mongodb://<dbuser  :<dbpassword  @<environment_URI/deployment_name"
```

```text
2.2 Add app.yaml to .gitignore
```

## Deployment Steps

### 1. Build the app

```bash
    gulp build
```

### 2. Copy app.yaml to dist

```bash
    cp app.yaml dist
```

### 3. Change to build directory

```bash
    cd dist
```

### 4. Deploy

```bash
    gcloud app deploy
```

