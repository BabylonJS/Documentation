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
    url: /toolsAndResources/thePlayground/externalPGAssets
  - title: How to Use The Inspector in Projects
    url: /toolsAndResources/inspector
  - title: Make your own Snippet Server
    url: /toolsAndResources/thePlayground/yourOwnSnippetServer
video-overview:
video-content:
---

## The Playground

The place to try out coding with Babylon.js. [Playground](https://playground.babylonjs.com/)

Experimenting and changing any code in the playground and clicking on the **Run** button will not affect any original code in the playground you are currently using.
Original code can be restored by refreshing the browser.

You can write the code in JavaScript or Typescript. The playground software compiles the code to JavaScript, in the background, before rendering.

### Scene creation functions

Usually you'll want to place your scene creation code in the already defined `createScene` function. But sometimes, you might want to substitute it for the `delayCreateScene` function, which allows you to return a scene without a camera (because for instance you plan to create the camera after an asynchronous mesh load, like: <Playground id="TVHK90#113" title="delayCreateScene example" description="An example of a Playground scene defined using the delayCreateScene function" image="/img/playgroundsAndNMEs/delayCreateSceneExample.png"/>).

You can also override the engine creation by defining the `createEngine` function. This can be useful if you want to test a scene without antialiasing, for example: <Playground id="#NCWBUU#1" title="createEngine example" description="How to use createEngine on the playground to customize engine creation" image="/img/playgroundsAndNMEs/createEnginePG.png"/>

## Overview

![Playground Overview](/img/how_to/Introduction/playground.jpg)

The Playground consists of four areas:

- A menu bar at the top.
- A links bar at the bottom.
- A coding editor on the left
- A rendering area of the right.

The space for the coding editor and rendering area can be adjusted by dragging the vertical bar between them.

## The Menu

![Playground Menu](/img/how_to/Introduction/pgmenu.jpg)

In Typescript mode the menu has an orange color theme:

![Playground Typescript Menu](/img/how_to/Introduction/pgmenu_ts.jpg)

### Large Screen

- **Title and Version**: As stated.
- **Language**: Typescript/JavaScript switch.
- **Run**: Commands the playground to try to render your scene.
- **Save**: Causes your scene to be permanently stored in the playground's database and it will issue a unique URL for each save. On save you will be asked to complete the metadata so that it can be searched for. Once saved it is a good idea to bookmark the page so you can return to it later. You could then share the URL with others, for example, if it is not working as you expect you can ask a question in the forum along with the link to your playground.
- **Download**: Allows you to download a zip file named _sample.zip_. Once downloaded and unzipped, you will see a file named `index.html`
  which contains everything necessary to run the code in your browser, including links to external _Babylon.js_ and other files.
- **New**: Places a basic `createScene()` function into the editor along with code to initialize the scene variable and provide a camera.
- **Clear**: Empties all the code out of the playground editor. You could then paste in any createScene function you are working on locally.
- **Settings**: The Settings button has a sub menu with extra options
  - _Theme_: Choose the theme for the playground
  - _Font size_: Set the font size in the editor.
  - _Safe Mode_: When the checkbox is ticked the playground issues a "leaving the page?" confirmation warning when you try to unload/reload a freshly-edited, un-saved scene.
  - _Editor_: The checkbox hides or un-hides the editor portion of the playground.
  - _Full Screen_: Makes the render area full screen.
  - _Editor Full Screen_: Makes the editor area full screen.
  - _Format Code_: Pretty prints the code.
  - _Minimap_: Display the minimap of the code editor.
  - _Metadata_: This is where you describe your playground allowing yourself and other to search the playground database for examples of use.
- **Version**: Allows and shows your choice of the Babylon.js framework, either the current stable one or the latest preview version.
- **Examples**: A drop down menu giving examples of playgrounds with a search filter.

### Small Screens

![Playground Typescript Menu](/img/how_to/Introduction/smallScreensPG.png)

- **Menu**: Contains Run, New, Clear, Save and Zip as submenus.
- **Code/Scene**: Bottom Left Corner - switch between Code and Scene views.

## Playground URL formats and templates

After editing any saves of the playground are numbered incrementally from one, for example:

- https://playground.babylonjs.com/#6F0LKI#1
- https://playground.babylonjs.com/#6F0LKI#2
- etc...

Some useful HTML templates are also available:

| Template                                                           | Description                                                                                          |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| [full.html](https://playground.babylonjs.com/full.html#6F0LKI#2)   | Shows the render area in full screen                                                                 |
| [frame.html](https://playground.babylonjs.com/frame.html#6F0LKI#2) | Shows the render area in full screen, but with a bottom toolbar showing FPS, reload and edit buttons |
| [debug.html](https://playground.babylonjs.com/debug.html#6F0LKI#2) | Uses a debug version of Babylon.js                                                                   |

## Forum sharing

Of course the playground is extremely useful to get help from the community. In the forum, simply paste the link of your playground.

You can have fun showing directly your playground embedded into your message, using iframe. But take note that you have to be sparing with this functionality: this will slow down the loading of your topic.

```html
<iframe src="https://playground.babylonjs.com/frame.html#6F0LKI#2" width="400px" height="250px"></iframe>
```

![playground forum sharing ways](/img/features/pgsupport/pg-forum-sharing-ways.jpg)

## Compilation Errors

![compilation error popup](/img/features/pgsupport/pg-compilation-error.jpg)

Any errors in your playground are flagged with a red pop-up box containing limited information. After making an adjustment to your code, you need not close the compilation error pop-up. It should close automatically at the next Run, if all errors have been corrected.

## Focus

Whenever a scene in the playground needs the use of keys to move an object, such as a mesh or camera, around then the rendering area needs to have the focus. After running the playground ensure that the render area has the focus by clicking inside it before using the keys.
