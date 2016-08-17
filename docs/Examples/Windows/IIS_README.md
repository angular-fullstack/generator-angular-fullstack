<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
<center>
<div style="width:100%">
<img src="http://joshlavely.com/images/yo_windows_mean.gif"/>
</div>
<h1> Angular-Generator-Fullstack on Windows</h1>
<p>This is a walk through to get generator-angular-fullstack up and running on a windows machine.</p>
<p>This walk through has been tested on:</p>
  - Windows Vista
  - Windows 7
  - Windows 8
  - Windows Server 2008 (*all builds/ updates*)
  - Windows Server 2012 (*all builds/ updates*)
</center>
<h2>Prerequisites</h2>

**Install Python**
  - Download 2.7 from 
    - Install to C:\Python27 (*The Default Path*) ** 
  - After Python is installed add the %Path% (*C:\Python27\python.exe*) to your Windows Path Env variable.
  - Start > Type ```Environment Variables``` > click "Edit the System Environment Variables" > Envrionment Variables > 
          Click "Path" > "Edit"
  - Add C:\Python27\python.exe to the very end. (*Click into box and press 'End'*)
  
**Install NodeJS on Windows**
  - Download the latest stable release of NodeJS from https://nodejs.org and install using all the default options.
 
**Install IISNode**
  - Install Latest Stable release of [IISNode](https://github.com/tjanczuk/iisnode)

**Install IIS URL-Rewrite Module**
  - Install the [URL-Rewrite Module](http://www.iis.net/downloads/microsoft/url-rewrite) extension

**Install MongoDB on Windows**
  - Download the current stable release of MongoDB from https://www.mongodb.org/downloads and install using the "Complete" setup type and all the default options.
  - Create the MongoDB data directory
  - Create an empty folder at "C:\data\db".
  - MongoDB requires a directory for storing all of it's data, the default directory is "C:\data\db", you can use a different directory if you prefer by specifying the "--dbpath" parameter when starting the MongoDB server (below).
  - Start MongoDB Server on Windows
  - Start the MongoDB server by running "mongod.exe" from the command line, "mongod.exe" is located in "C:\Program Files\MongoDB\Server\[MONGODB VERSION]\bin", for example for version 3.2 the following command will start MongoDB
``"C:\Program Files\MongoDB\Server\3.2\bin\mongod"``
  
<h2>Getting your project started</h2>

**Install the generator**
  - Create an empty folder for your project
  - Open CMD as administrator and change directories to your app's directory ```cd c:\example```
  - Run ```npm install -g yo gulp-cli generator-angular-fullstack```

<h2>Move App into production</h2>
<p>The below steps assume you have purchased a domain and have pointed your DNS to your public IP</p>
  **Build and prep**
  - Run the build process ```gulp serve:dist```
  - Move your *dist* folder to your desired directory (*This is where IIS will be pointed at*)
  - Copy the contents of the 'server' folder **into** your 'client' folder
  - Copy down the [web.config]() and place this inside your 'client' folder
  **Setup IIS**
  - Open IIS Manager (*Start > Type 'IIS Manager'*)
  - Create your new site (*Expand Server > Right click sites > 'Add Websites'*)
  - Enter your site's name
  - Enter the directory path to your 'client' folder (*C:\example\dist\client\*)
  - Enter your hostname (*Your a-record*)
  - Leave all other defaults and click 'Ok'

**Start your server**
  - Run ```gulp serve:dist```
<h1> Congratulations, you did it! Now go code something awesome!</h1>
  
  
