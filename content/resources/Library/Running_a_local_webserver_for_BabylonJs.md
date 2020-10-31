# Running a local webserver for Babylon.js - 101

This tutorial:
 - Is for you, if you have no or limited experience with web development or servers in general.
 - Will show you how to setup and start a simple, local, NodeJs web server for your BabylonJs application.
 - Is primarily focused on Windows.


# Nodejs & NPM

If you already have NodeJs and NPM installed, skip to **Sample** section.

Download the latest (LTS) Nodejs installer from https://nodejs.org/en/download/

Run the installer and follow the NodeJs setup Wizard. The default settings are fine for our use.

NPM is included in this installation.


# Sample
Having installed NodeJs and NPM, we're now ready for our server code.

 - Create a folder for your project 

In this tutorial, we'll use **C:\babylon**

- Download the sample server [master.zip](https://github.com/aWeirdo/babylonJs_sample_server/archive/master.zip)
- Extract the .zip file content to C:\babylon

Your **C:\babylon** folder should now look something like this:
```
C:\babylon\public\
C:\babylon\public\index.html
C:\babylon\public\babylonScene.js

C:\babylon\package.json
C:\babylon\readme.md
C:\babylon\server.js
C:\babylon\Windows_NPM_INSTALL.BAT
C:\babylon\Windows_START.BAT

```


**On windows**
 - Navigate your file explorer to C:\babylon
 - Double-click **Windows_NPM_INSTALL.BAT**
 - Wait for BAT window to finish running and close itself. This executes ```npm install --save```

A new folder "node_modules" should be created.
 
 - Double-click **Windows_START.BAT**. This executes ```node server.js```
 - A new BAT window should open:
```
C:\babylon>node server.js
Server is listening on port 80
```
 - Your server should now be running. Note: Closing this window will shutdown the nodeJs server again.
 - In your browser, navigate to http://localhost/
 - If the BAT immidiately closes again, please re-check previous steps were done correctly.
 - To view errors, in a CMD or PowerShell window run ```C:\babylon> node server.js```  

**Other OS**
 - See NpmJs.org and NodeJs.org documentations for instructions. 
 - Execute "npm install --save" on C:\babylon
 - Execute "node server.js" on C:\babylon
 
 _If anyone wish to expand this section, feel free to PR_

# Public Folder
In the Public folder you'll find a sample scene consisting of a index.html and a babylonScene.js file.

The browser's access is restricted to this folder and it's files & sub-folders.

You're now ready to start your project.
