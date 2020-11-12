---
title: Creating Projects
image: 
description: How to set up a project with the Unity Toolkit.
keywords: babylon.js, exporter, unity 
further-reading:
video-overview:
video-content:
---

Download the [Babylon Editor Toolkit](https://github.com/BabylonJS/UnityExporter/tree/master/Redist) and use **Import Package** to install into current project. Once installed, unity will detect the plugin, compile it and add the toolkit [Export Inspector](Exporter) window to your project.


## Create New Project

![New Unity Project](/img/exporters/unity/newproject.jpg)

Create a new unity game project then add the **Babylon Editor Toolkit** to your project. You can download and import the toolkit unity package [distribution](https://github.com/BabylonJS/UnityExporter/tree/master/Redist) file.

## Set Compiler Options

![Node Runtime Compilers](/img/exporters/unity/compilers.jpg)

Configure optional **Runtime Script Compiler** locations. You can download and install or update the current [Node Runtime](https://nodejs.org/en/) to the default location. Then use node package manager to install or update the latest [TypeScript Compiler](https://www.typescriptlang.org/) to the default location.

**Install TypeScript Command**

    Mac OSX: sudo npm install -g typescript

    Windows: npm install -g typescript

**Default TypeScript Location**

    Mac OSX: /usr/local/bin/tsc

    Windows: C:\Users\<YourName>\AppData\Roaming\npm\node_modules\typescript\bin\tsc

**Default Node Runtime Location**

    Mac OSX: /usr/local/bin/node

    Windows: C:\Program Files\nodejs\node.exe

## Save Export Settings

On the Scene Exporter panel, press the **Save Export Settings** button to save the project export settings to disk. Export settings will also detect changes and save on each build.


## Scene Configuration

* **File > New Scene** - To create a new empty scene. Unity will create a main camera and a directional light by default.

* **File > Save Scene As** - To name and save your current scene to a folder in your project assets. The toolkit will use this scene name for exporting content. 

## Set Project Settings

* **Edit > Project Settings > Player** - To set the default color space setting to **Linear**. Unity will set color space to **Gamma** by default.

* **Lighting > Global Illumination** - To disable **Realtime Global Illumination** and set the **Baked Global Illumination** to the desired lighting mode.

## Add Scene Content

* **Global Startup Scripts** - If defined, the global startup script is the main entry point for every scene. You can use the global startup script to attach the SceneManager.ExecuteWhenReady handler that will get called first for each and every scene.

* **Default Scene Controllers** - Any scene options for your project can be set using any script components you see fit. You can optionally add an empty game object and attach a default scene controller script component to easily setup built in options for your scene.

* **Cameras, Lights And Meshes** - Add any supported camera, light and mesh content to your scene. You can attach script components, assign materials, create particle systems, setup animations, optimize geometry and utilize any unity editor tools to manage scene content.

## Build And Preview

To build and preview the current scene, press the **Play** button or the **Build And Preview** button on the Scene Exporter panel. Select the **Export Scene File** to simply export the current scene content without a full build and preview. This is very useful for creating **Import Mesh** only scenes. All project output will be saved to the **Export** folder of your unity game project folder.


## How To Get Started

Check out the [Getting Started Video](http://www.babylontoolkit.com/videos/GettingStarted.mp4) to get started with **Babylon Toolkit** style game development.

.