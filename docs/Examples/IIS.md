# Angular Full-Stack Generator deployment on Windows
This is a walk through to get generator-angular-fullstack up and running on a windows machine.
This walk through has been tested on:
  - Windows Vista
  - Windows 7
  - Windows 8
  - Windows Server 2008 (*all builds/ updates*)
  - Windows Server 2012 (*all builds/ updates*)

## Prerequisites

**Install Python**
  - Download Python 2.7 from [python.org/downloads](https://www.python.org/downloads/)
    - Install to `C:\Python27` (*The Default Path*) ** 
  - After Python is installed add the path (*`C:\Python27\`*) to your Windows `PATH` environment variable.
    - Start > Type `Environment Variables` > click "Edit the System Environment Variables" > Envrionment Variables > Click "Path" > "Edit"
  - Add C:\Python27\python.exe to the very end. (*Click into box and press 'End'*)

**Install NodeJS on Windows**
  - Download & Install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).
  - Run `nvm install 6.4.0` for the version of node that you want
  - Run `nvm use 6.4.0` to use that version

**Install IISNode**
  - Install Latest Stable release of [IISNode](https://github.com/tjanczuk/iisnode)

**Install IIS URL-Rewrite Module**
  - Install the [URL-Rewrite Module](http://www.iis.net/downloads/microsoft/url-rewrite) extension

**Install MongoDB on Windows**
  - Download the current stable release of MongoDB from https://www.mongodb.org/downloads and install using the "Complete" setup type and all the default options.
  - Create the MongoDB data directory
  - Create an empty folder at ex. `C:\data\db`.
  - MongoDB requires a directory for storing all of it's data. The default directory is `C:\data\db`. You can use a different directory if you prefer by specifying the "--dbpath" parameter when starting the MongoDB server (below).
  - Start the MongoDB server daemon by running `mongod.exe` from the command line. `mongod.exe` is likely located in `C:\Program Files\MongoDB\Server\[MONGODB VERSION]\bin`; for example for version 3.2 the following command will start MongoDB: `C:\Program Files\MongoDB\Server\3.2\bin\mongod`
  
## Getting your project started

**Install the generator**
  - Create an empty folder for your project
  - Open a terminal and change directories to your app's directory `cd c:\example`
  - Run `npm install -g yo gulp-cli generator-angular-fullstack`
  - Run `yo angular-fullstack`

## Move App into production
The below steps assume you have purchased a domain and have pointed your DNS to your public IP

**Build and prep**
  - Run the build process `gulp serve:dist`
  - Move your `dist/` folder to your desired directory (*This is where IIS will be pointed at*)
  - Copy the contents of the `server/` folder **into** your `client/` folder
  - Copy down the web.config from below and place this inside your 'client' folder (*save it as 'web.config'*)

```
<configuration>
  <system.webServer>

    <!-- indicates that the socketio.js file is a node.js application
    to be handled by the iisnode module -->

    <handlers>
      <add name="iisnode" path="app.js" verb="*" modules="iisnode" />
      <add name="iisnode-socketio" path="config/socketio.js" verb="*" modules="iisnode" />
    </handlers>
    <iisnode node_env="PRODUCTION"
         nodeProcessCountPerApplication="1"
         maxConcurrentRequestsPerProcess="1024"
         maxNamedPipeConnectionRetry="100"
         namedPipeConnectionRetryDelay="250"
         maxNamedPipeConnectionPoolSize="512"
         maxNamedPipePooledConnectionAge="30000"
         asyncCompletionThreadCount="0"
         initialRequestBufferSize="4096"
         maxRequestBufferSize="65536"
         uncFileChangesPollingInterval="5000"
         gracefulShutdownTimeout="60000"
         loggingEnabled="true"
         logDirectory="iisnode"
         debuggingEnabled="true"
         debugHeaderEnabled="false"
         debuggerPortRange="5058-6058"
         debuggerPathSegment="debug"
         maxLogFileSizeInKB="128"
         maxTotalLogFileSizeInKB="1024"
         maxLogFiles="20"
         devErrorsEnabled="true"
         flushResponse="false"
         enableXFF="false"
         promoteServerVars=""
         configOverrides="iisnode.yml"
         watchedFiles="web.config;*.js" />
    <!-- indicate that all strafic the URL paths beginning with 'socket.io' should be 
    redirected to the server socketio.js, node.js, application to avoid IIS attempting to 
    serve that content using other handlers (e.g. static file handlers)
    -->

    <rewrite>
         <rules>
              <rule name="LogFile" patternSyntax="ECMAScript">
                   <match url="socket.io"/>
                   <action type="Rewrite" url="app.js"/>
              </rule>
              <rule name="DynamicContent">
                <conditions>
                    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
                </conditions>
                    <action type="Rewrite" url="app.js"/>
              </rule>
         </rules>
    </rewrite>    

    <!-- disable the IIS websocket module to allow node.js to provide its own 
    WebSocket implementation -->

    <webSocket enabled="false" />
    
  </system.webServer>
</configuration>
```

**Setup IIS**
  - Open IIS Manager (*Start > Type 'IIS Manager'*)
  - Create your new site (*Expand Server > Right click sites > 'Add Websites'*)
  - Enter your site's name
  - Enter the directory path to your `client/` folder (*`C:\example\dist\client\`*)
  - Enter your hostname (*Your a-record*)
  - Leave all other defaults and click 'Ok'

**Start your server**
  - Run `gulp serve:dist`

# Congratulations, you did it! Now go code something awesome!
