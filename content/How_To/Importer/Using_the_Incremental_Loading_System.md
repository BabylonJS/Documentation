---
title: Incremental Loading System
image: 
description: Learn about the incremental loading system in Babylon.js.
keywords: diving deeper, import, importing assets, asset, importing, incremental load
further-reading:
video-overview:
video-content:
---

## How To Use the Incremental Loading System

In order to support incremental loading (introduced by v1.5.0), you just have to go to [this page](https://github.com/BabylonJS/Exporters/tree/master/Tools/MakeIncremental) in order to get a tool to convert your .babylon file to a .incremental.babylon file alongside associated resources (_.babylonmeshdata_ and _.babylongeometrydata_ files).

These files can be used just like a standard _.babylon_ scene except that they will allow **Babylon.js** to load meshes and textures on the fly. This means that the meshes and the textures will not be loaded at startup but only when they become active (when the active camera can see them).

You have to put the _.babylonmeshdata_ and _.babylongeometrydata_ files in the same folder as the _.incremental.babylon_ file.

You can find a demo of an incremental scene here: <Playground id="#JA1ND3#84" title="Incremental Loading Example" description="Simple Example of incremental loading assets." image="/img/playgroundsAndNMEs/divingDeeperIncrementalLoading1.jpg"/>

## Node.js based incremental file converter
This script can be used to generate incremental files from babylon scenes. It can be ran directly from node or it can be integrated into build scripts. More information about how to install and configure the script can be found [here](https://www.npmjs.com/package/babylonjs-make-incremental).
