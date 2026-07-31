---
title: Running/playing a workspace
image: 
description: Understanding how to play a workspace
keywords: editor, workspace, running, play
further-reading:
video-overview:
video-content:
---

## Running the application/game

Once all dependencies have been installed and the game has been built, it can be run using 2 methods:
* In an integrated browser: this simply opens a new window with the application/game rendered in it
* In the user's default browser: this starts a local web server and opens the user's default browser (Firefox, for example).

For developers, running the game in the user's default browser makes it easy to open the devtools (using F12) and debug the game.

By default, the Editor opens the integrated browser. To have these options available in the Editor, simply `right-click` the `Play` button in the toolbar and select `Play in my browser`:

![PlayApplicationOrGame](/img/extensions/Editor/RunningWorkspace/run.webp)

# Using a Custom Web Server
In the case of a custom web server (for example, using the Webpack dev server or a fully custom web server with custom APIs, etc.), you will have to manually open the browser and point it to the desired URL.

When you click the `Play` button, the editor launches a basic web server (that serves only files) to run the project. Once the basic web server is started, the preview loads the URL `http://localhost:port/index.html`. That means that, in the case of a fully customized web server/environment, the preview feature should no longer be used because the project is set to run in that customized environment.
