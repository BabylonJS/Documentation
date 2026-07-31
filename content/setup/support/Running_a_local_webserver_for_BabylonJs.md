---
title: A Local Webserver for Babylon.js
image:
description: A simple local webserver for running Babylon.js.
keywords: babylon.js, extension, external libraries, external, npm, node.js, webserver
further-reading:
video-overview:
video-content:
---

This tutorial:

- Is for you if you have no or limited experience with web development or servers in general.
- Will show you how to set up and start a simple, local Node.js web server for your Babylon.js application.
- Is primarily focused on Windows.

## Nodejs & NPM

If you already have Node.js and NPM installed, skip to the **Sample** section.

Download the latest LTS Node.js installer from https://nodejs.org/en/download/

Run the installer and follow the Node.js setup wizard. The default settings are fine for our use.

NPM is included in this installation.

## Sample

Now that Node.js and NPM are installed, we're ready for the server code.

- Create a folder for your project.

In this tutorial, we'll use **C:\babylon**

- Download the sample server [master.zip](https://github.com/aWeirdo/babylonJs_sample_server/archive/master.zip)
- Extract the .zip file contents to C:\babylon.

Your **C:\babylon** folder should now look something like this:

```shell
C:\babylon\public\
C:\babylon\public\index.html
C:\babylon\public\babylonScene.js

C:\babylon\package.json
C:\babylon\readme.md
C:\babylon\server.js
C:\babylon\Windows_NPM_INSTALL.BAT
C:\babylon\Windows_START.BAT

```

**On Windows**

- In File Explorer, navigate to C:\babylon.
- Double-click **Windows_NPM_INSTALL.BAT**
- Wait for the BAT window to finish running and close itself. This executes `npm install --save`.

A new `node_modules` folder should be created.

- Double-click **Windows_START.BAT**. This executes `node server.js`
- A new BAT window should open:

```shell
C:\babylon>node server.js
Server is listening on port 80
```

- Your server should now be running. Note: Closing this window will shut down the Node.js server again.
- In your browser, navigate to http://localhost/
- If the BAT file closes immediately, please check that the previous steps were completed correctly.
- To view errors, in a CMD or PowerShell window run `C:\babylon> node server.js`

**Other OSes**

- See the npmjs.org and nodejs.org documentation for instructions.
- Execute "npm install --save" on C:\babylon
- Execute "node server.js" on C:\babylon

_If anyone wishes to expand this section, feel free to open a PR._

## Public Folder

In the Public folder, you'll find a sample scene consisting of an _index.html_ file and a _babylonScene.js_ file.

The browser's access is restricted to this folder and its files and subfolders.

You're now ready to start your project.
