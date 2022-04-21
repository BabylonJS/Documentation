---
title: Playground
image: 
description: Learn about the incredibly powerful playground, the online Babylon.js IDE.
keywords: babylon.js, tools, resources, playground
further-reading:
    - title: Textures Directly Available to the Playground
      url: /toolsAndResources/assetLibraries/availableTextures
    - title: Meshes Available to Import into the Playground
      url: /toolsAndResources/assetLibraries/availableMeshes
    - title: Using External Assets in the Playground
      url: /toolsAndResources/tools/playground/externalPGAssets
    - title: How to Use The Inspector in Projects
      url: /toolsAndResources/tools/inspector
    - title: How to Use The Inspector in Projects
      url: /toolsAndResources/tools/inspector
video-overview:
video-content:
---


## The Playground

The place to try out coding with Babylon.js. [Playground](https://playground.babylonjs.com/)

Experimenting and changing any code in the playground and clicking on the **Run** button will not affect any original code in the playground you currently using. 
Original code can be restored by refreshing the browser.

You can write the code in JavaScript or Typescript. The playground software compiles the code to JavaScript, in the background, before rendering.

## Overview

![Playground Overview](/public/img/how_to/Introduction/playground.jpg)

The Playground consists of four areas:

- a menu bar at the top
- a links bar at the bottom
- a coding editor on the left
- a rendering area of the right.

The space for the coding editor and rendering area can be adjusted by dragging the vertical bar between them.

## The Menu

![Playground Menu](/public/img/how_to/Introduction/pgmenu.jpg)

In Typescript mode the menu has an orange color theme

![Playground Typescript Menu](/public/img/how_to/Introduction/pgmenu_ts.jpg)

### Large Screen

- **Title and Version**: As stated.
- **Language**: Typescript/JavaScript switch.
- **Run** ![run](/public/img/features/pgsupport/run.jpg): Commands the playground to try to render your scene.
- **Save** ![save](/public/img/features/pgsupport/save.jpg): Causes your scene to be permanently stored in the playground's database and it will issue a unique URL for each save. On save you will be asked to complete the metadata so that it can be searched for. Once saved it is a good idea to bookmark the page so you can return to it later. You could then share the URL with others, for example, if it is not working as you expect you can ask a question in the forum along with the link to your playground.
- **Download** ![zip](/public/img/features/pgsupport/zip.jpg): Allows you to download a zip file named *sample.zip*. Once downloaded and unzipped, you will see a file named `index.html` 
which contains everything necessary to run the code in your browser, including links to external *babylon.js* and other files.
- **New** ![new](/public/img/features/pgsupport/new.jpg): Places a basic `createScene()` function into the editor along with code to initialise the scene variable and provide a camera.
- **Clear** ![clear](/public/img/features/pgsupport/clear.jpg): Empties all the code out of the playground editor.  You could then paste in any createScene function you are working on locally.
- **Settings** ![set](/img/features/PGsupport/set.jpg): The Settings button has a sub menu with extra options
  - *Theme*: Choose the theme for the playground
  - *Font size*: Set the font size in the editor.
  - *Safe Mode*: When the checkbox is ticked the playground issues a "leaving the page?" confirmation warning when you try to unload/reload a freshly-edited, un-saved scene.
  - *Editor*: The checkbox hides or un-hides the editor portion of the playground.
  - *Full Screen*: Makes the render area full screen.
  - *Editor Full Screen*: Makes the editor area full screen.
  - *Format Code*: Pretty prints the code.
  - *Minimap*: Display the minimap of the code editor.
  - *Inspector*: The checkbox toggles the playground scene inspector which shows a multitude of variable values.
  - *Metadata*: This is where you describe your playground allowing yourself and other to search the playground database for examples of use.
- **Version**: Allows and shows your choice of the BABYLON.js framework, either the current stable one or the latest preview version.
- **Examples** ![examples](/public/img/features/pgsupport/ex.jpg): A drop down menu giving examples of playgrounds with a search filter.

### Small Screens

- **Menu** ![menu](/img/features/PGsupport/menu.jpg): Contains Run, New, Clear, Save and Zip as submenus.
- **Code** ![code](/img/features/PGsupport/code.jpg): Bottom Left Corner - switch to Code View and Editor.
- **Scene** ![scene](/img/features/PGsupport/scene.jpg): Bottom Right Corner - switch to Scene View.

## Playground URL formats

New playgrounds have this URL format

| JavaScript | Typescript |
|---|---|
| https://www.babylonjs-playground.com/# | [https://www.babylonjs-playground.com/#](https://www.babylonjs-playground.com/#) |

Saved playgrounds have a hash code reference key added to the URL

| JavaScript | Typescript |
|---|---|
| https://www.babylonjs-playground.com/#6F0LKI | [https://www.babylonjs-playground.com/#M1HI7X](https://www.babylonjs-playground.com/ts.html#M1HI7X) |


After editing any saves of the playground are numbered incrementally from one, for example 

| JavaScript | Typescript |
|---|---|
| https://www.babylonjs-playground.com/#6F0LKI#1 | [https://www.babylonjs-playground.com/#M1HI7X#1](https://www.babylonjs-playground.com/ts.html#M1HI7X#1) |
| https://www.babylonjs-playground.com/#6F0LKI#2 | [https://www.babylonjs-playground.com/#M1HI7X#2](https://www.babylonjs-playground.com/ts.html#M1HI7X#1) |
  
etc.

You might be interested to know that [some html templates](https://github.com/BabylonJS/Babylon.js/tree/master/Playground) are also available:

Template | Description
--- | ---
[full.html](https://www.babylonjs-playground.com/full.html#6F0LKI#2) | show the render area in full screen
[frame.html](https://www.babylonjs-playground.com/frame.html#6F0LKI#2) | show the render area in full screen, but with a bottom toolbar showing FPS, reload and edit buttons
[indexStable.html](https://www.babylonjs-playground.com/indexStable.html#6F0LKI#2) | use the BJS stable version, not the preview one
[debug.html](https://www.babylonjs-playground.com/debug.html#6F0LKI#2) | used to run a version of the playground which uses debug version of babylon.js
[index-local.html](https://www.babylonjs-playground.com/index-local.html#6F0LKI#2) | used for local development using VSCode

## Forum sharing

Of course the playground is extremely useful to get help from the community. In the forum, simply paste the link of your playground.

You can have fun showing directly your playground imbedded into your message, using iframe. But take note that you have to be sparing with this functionality: this will slow down the loading of your topic.

```html
<iframe src="https://www.babylonjs-playground.com/frame.html#6F0LKI#2" width="400px" height="250px" ></iframe>
```

![playground forum sharing ways](/img/features/pgsupport/pg-forum-sharing-ways.jpg)
> *so many ways to share an issue*

## Compilation Errors

![compilation error popup](/img/features/pgsupport/pg-compilation-error.jpg)

Any errors in your playground are flagged with a red pop-up box containing limited information. After making an adjustment to your code, you need not close the compilation error pop-up.  It should close automatically at the next Run, if all errors have been corrected.

Please note that you can name your main function `delayCreateScene` instead of `createScene` if you want to return a scene without a camera (because for instance you plan to load a scene using `SceneLoader`).

## Focus

Whenever a scene in the playground needs the use of keys to move an object, such as a mesh or camera, around then the rendering area needs to have the focus. After running the playground ensure that the render area has the focus by clicking inside it before using the keys. 
