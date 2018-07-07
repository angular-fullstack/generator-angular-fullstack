
The following are the instructions to deploy the angular-fullstack app to Google Cloud App Engine Standard Environment

# Prequsites
  ## 1. Google Cloud SDK
    Download and install [Google Cloud SDK](https://cloud.google.com/sdk/)
  ## 2. Create GCP Project
  ```bash
  gcloud projects create PROJECT_ID
  ```  
  ## 3. Enable Billing
  ```bash
  gcloud alpha billing projects link my-project \ 
      --billing-account 0X0X0X-0X0X0X-0X0X0X
  ```
  ## 4. Create a MongoDB database
    Create a MongoDB instance and obtain the uri and credentials

# Deployment Setup
  ## 1. Set Node / NPM versions
    GCloud App Engine supports only the newest version of Node.js 8
 ```javascript
    "engines": {
    "node": "  =8.0",
    "npm": "^5.1.1"
  },
  ```

  ## 2. Create Application configuration file (app.yaml)
    A Node.js app in App Engine is configured through a file named app.yaml, that contains runtime, handlers, 
    scaling, and other general settings including environment variables.

    ### 2.1 create a 'app.yaml' file with the following contents

 ```javascript
 
    env: standard 

    runtime: nodejs8

    env_variables:
      MONGODB_URI:  "mongodb://<dbuser  :<dbpassword  @<environment_URI/deployment_name"
    
 ```

    ### 2.2 Add app.yaml to .gitignore

# Deployment Steps
  ## 1. Build the app
  ```bash
    gulp build
  ```
  ## 2. Copy app.yaml to dist
  ```bash
    copy app.yaml dist
  ```
  ## 3. Change to build directory
  ```bash
    cd dist
  ```
  ## 4. Deploy
  ```bash
    gcloud app deploy
  ```
