# Visual Studio Code

VSCode is one of several integrated development environments that can be used in the development of projects using Babylon.js. It has the advantage of Git integration built in and a plugin to display .babylon files.

You can install VSCode from their site: [https://code.visualstudio.com/](https://code.visualstudio.com/)

Once installed, a few plugins will help you having the best experience. You can search for them in the extension tab (Ctrl+Shift+d):

1. Debugger for Chrome as well as the chrome browser.
2. Shader language support for VS Code (syntax highlighting and autocompletion in glsl shader)
3. [This extension](https://marketplace.visualstudio.com/items?itemName=julianchen.babylon-js-viewer) can be used to display the content of a babylon file directly in vscode. It can be useful if you want to quickly check if your artist did a good job with object and their names :)

Finally, I would recommend adding a few shortcuts to your environment. Follow the [guide](https://code.visualstudio.com/docs/customization/keybindings#_customizing-shortcuts):
 1. To configure keyboard shortcuts the way you want, go to the menu under File > Preferences > Keyboard Shortcuts. (Code > Preferences > Keyboard Shortcuts on Mac)
 2. In the left side, add:
 ```
// Place your key bindings in this file to overwrite the defaults
[
{ "key": "ctrl+shift+alt+s",         "command": "workbench.action.files.saveFiles" },
{ "key": "ctrl+shift+alt+k",         "command": "workbench.action.tasks.terminate" },
{ "key": "ctrl+shift+alt+t",         "command": "workbench.action.tasks.test" },
{ "key": "ctrl+shift+alt+l",         "command": "workbench.action.tasks.showLog" },
{ "key": "ctrl+shift+alt+r",         "command": "workbench.action.tasks.runTask" }
]
```

This will make the main commands quicker to access. Do not hesitate to adapt the bindings to your preferences.

![keybindings](/img/how_to/howToStart/keybindings.png)

Also in VSCode there is a ```Debug``` tab on the menu. To use it with Babylon.js you need to install an extension, find out more from  [Debugger for Chrome](https://code.visualstudio.com/blogs/2016/02/23/introducing-chrome-debugger-for-vs-code).

With the test task running from the VSCode debug tab, chose the section you want to debug and launch the debugger.

This will debug all the Typescript and Javascript in chrome and stop on your breakpoints setup in those files in VSCode. This debugs all the code from src, materialsLibrary, procceduralTexturesLibrary, postprocessLibrary...

*Hint*: If another chrome session is already running on remote debug on port 9222 the debugger will fail to attach as the port is already open. You will have to close the other remote debug first.