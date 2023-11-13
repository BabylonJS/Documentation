---
title: Digital Rain
image: 
description: Check out the free Digital Rain Post Process available for you to use in your Babylon.js scenes.
keywords: babylon.js, tools, resources, assets, library, post process, digital rain
further-reading:
video-overview:
video-content:
---


## Using the Digital Rain post-process

How cool (... or nerd - ish) could it be to render all your BJS scene in a Digital Rain Fall?

If you would like it, this tutorial is made for you.

## How to use ?

Digital Rain Post Process Scripts can be found here: 
- Normal: https://cdn.babylonjs.com/postProcessesLibrary/babylon.digitalRainPostProcess.js
- Minified: https://cdn.babylonjs.com/postProcessesLibrary/babylon.digitalRainPostProcess.min.js

<Alert severity="warning" title="Warning" description="The CDN should not be used in production environments. The purpose of our CDN is to serve Babylon packages to users learning how to use the platform or running small experiments. Once you've built an application and are ready to share it with the world at large, you should serve all packages from your own CDN."/>

Please, first reference this script in your page:

```
	<script src="babylon.digitalRainPostProcess.js"></script>
```

Then, you only need to instantiate the post process attach to your main camera to bring it to life.

```
// Creates the post process
var postProcess = new BABYLON.DigitalRainPostProcess("DigitalRain", camera);
```

<Playground id="#2I28SC#6" title="Digital Rain Post Process Demo" description="Digital Rain Post Process Demo"/>

## Going further

The first you can do is changing the font used in the post process.

```
// Creates the post process
var postProcess = new BABYLON.DigitalRainPostProcess("DigitalRain", camera, "3px Monospace");
```

<Playground id="#2I28SC#7" title="Digital Rain Post Process Modified Demo 1" description="Digital Rain Post Process Modified Demo 1"/>

But you could also play with more parameters:

```
// Creates the post process
var postProcess = new BABYLON.DigitalRainPostProcess("DigitalRain", camera, 
    {
        font: "30px Monospace",
        mixToNormal: 0.5,
        mixToTile: 0.5        
    });
```

<Playground id="#2I28SC#8" title="Digital Rain Post Process Modified Demo 2" description="Digital Rain Post Process Modified Demo 2"/>

The availables parameters are:

- font: the font to use defined the W3C css way like "30px Monospace". Note: a monospace font would provide better result.
- mixToNormal: defines the amount you want to mix the "tile" or caracter space colored in the digital rain (between 0 and 1).
- mixToTile: defines the amount you want to mix the normal rendering pass in the digital rain (between 0 and 1).

Two of them mixToNormal and mixToTile are also available at run time to allow smoothly fading from matrix to your normal scene.

```
// Creates the post process
var postProcess = new BABYLON.DigitalRainPostProcess("DigitalRain", camera);
// Displays the scene.
var alpha = 0;
scene.registerBeforeRender(function() {
    alpha += 0.01;
    postProcess.mixToNormal = Math.cos(alpha) * 0.5 + 0.5; // between 0 and 1.
});
```

<Playground id="#2I28SC#9" title="Digital Rain Post Process Modified Demo 3" description="Digital Rain Post Process Modified Demo 3"/>
