---
title: Using Visual Studio Code (VSCode)
image:
description: Learn how to use the popular oss IDE VSCode for Babylon.js development.
keywords: diving deeper, contribution, contribute, open-source, oss, vscode, ide, develop
further-reading:
video-overview:
video-content:
---

# Visual Studio Code

VSCode is one of several integrated development environments that can be used to develop projects using Babylon.js. It has the advantage of Git integration built-in and a plugin to display .babylon files.

You can install VSCode from their site: [https://code.visualstudio.com/](https://code.visualstudio.com/)

## Useful plugins

Once installed, a few plugins will help you have the best experience. You can search for them in the extension tab (Ctrl+Shift+d):

1. [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) as well as the chrome browser
2. [Shader languages support for VSCode](https://marketplace.visualstudio.com/items?itemName=slevesque.shader) for syntax highlighting and autocompletion in glsl shader
3. [Babylon.js file viewer](https://marketplace.visualstudio.com/items?itemName=julianchen.babylon-js-viewer) can be used to display the content of a .babylon file directly in VSCode. It can be useful if you want to quickly check if your artist did a good job with an object and their names :)

## Keybindings setup

Finally, I would recommend adding a few shortcuts to your environment. Follow the [guide](https://code.visualstudio.com/docs/getstarted/keybindings#_custom-keybindings-for-refactorings):

1.  To configure keyboard shortcuts the way you want, go to the menu under File > Preferences > Keyboard Shortcuts. (Code > Preferences > Keyboard Shortcuts on Mac)
2.  On the left side, add:

```
// Place your key bindings in this file to overwrite the defaults
[
    { "key": "ctrl+shift+alt+s", "command": "workbench.action.files.saveFiles" },
    { "key": "ctrl+shift+alt+k", "command": "workbench.action.tasks.terminate" },
    { "key": "ctrl+shift+alt+t", "command": "workbench.action.tasks.test" },
    { "key": "ctrl+shift+alt+l", "command": "workbench.action.tasks.showLog" },
    { "key": "ctrl+shift+alt+r", "command": "workbench.action.tasks.runTask" }
]
```

This will make the main commands quicker to access. Do not hesitate to adapt the bindings to your preferences.

![keybindings](/public/img/how_to/howToStart/keybindings.png)

## Debugging code

Also, in VSCode there is a `Debug` tab on the menu. To use it with Babylon.js you need to install an extension, find out more from [Debugger for Chrome](https://code.visualstudio.com/blogs/2016/02/23/introducing-chrome-debugger-for-vs-code).

With the test task running from the VSCode debug tab, chose the section you want to debug and launch the debugger.
![debug](/public/img/how_to/howToStart/debug.png)

Debug session will debug all the Typescript and JavaScript in Chrome and stop on your breakpoints set up in files in VSCode. It debugs all the code from src, materialsLibrary, procceduralTexturesLibrary, postprocessLibrary, etc.

_Hint_: If another chrome session is already running on remote debug on port 9222 the debugger will fail to attach as the port is already open. You will have to close the other remote debug first.
