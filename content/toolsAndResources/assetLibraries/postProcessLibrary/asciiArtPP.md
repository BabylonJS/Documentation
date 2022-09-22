---
title: Ascii Art
image: 
description: Check out the free Ascii Art Post Process available for you to use in your Babylon.js scenes.
keywords: babylon.js, tools, resources, assets, library, post process, ascii
further-reading:
video-overview:
video-content:
---

## Using the Ascii Art post-process

How cool (... or nerd - ish) could it be to render all your BJS scene in Ascii ART?

If you would like it, this tutorial is made for you.

## How to use ?

Ascii Art Post Process Scripts can be found here: 
- Normal: https://cdn.babylonjs.com/postProcessesLibrary/babylon.asciiArtPostProcess.js
- Minified: https://cdn.babylonjs.com/postProcessesLibrary/babylon.asciiArtPostProcess.min.js

Please, first reference this script in your page:

```
	<script src="babylon.asciiArtPostProcess.js"></script>
```

Then, you only need to instantiate the post process attach to your main camera to bring it to life.

```
// Creates the post process
var postProcess = new BABYLON.AsciiArtPostProcess("AsciiArt", camera);
```

<Playground id="#2I28SC#24" title="Ascii Post Process Demo" description="Ascii Post Process Demo"/>

## Going further

The first you can do is changing the font used in the post process.

```
// Creates the post process
var postProcess = new BABYLON.AsciiArtPostProcess("AsciiArt", camera, "10px Monospace");
```

<Playground id="#2I28SC#25" title="Modified Ascii Post Process Demo 1" description="Modified Ascii Post Process Demo"/>

But you could also play with more parameters:

```
// Creates the post process
var postProcess = new BABYLON.AsciiArtPostProcess("AsciiArt", camera, 
    {
        font: "20px Monospace",
        characterSet: " -+@",
        mixToNormal: 0.5,
        mixToTile: 0.5        
    });
```

<Playground id="#2I28SC#26" title="Modified Ascii Post Process Demo 2" description="Modified Ascii Post Process Demo 2"/>

The availables parameters are:

- font: the font to use defined the W3C css way like "30px Monospace". Note: a monospace font would provide better result.
- caracterSet: the set of caracter to use in order of llight intensity.
- mixToNormal: defines the amount you want to mix the "tile" or caracter space colored in the ascii art (between 0 and 1).
- mixToTile: defines the amount you want to mix the normal rendering pass in the ascii art (between 0 and 1).

Two of them mixToNormal and mixToTile are also available at run time to allow smoothly fading from matrix to your normal scene.

```
// Creates the post process
var postProcess = new BABYLON.AsciiArtPostProcess("AsciiArt", camera);
// Displays the scene.
var alpha = 0;
scene.registerBeforeRender(function() {
    alpha += 0.01;
    postProcess.mixToNormal = Math.cos(alpha) * 0.5 + 0.5; // between 0 and 1.
});
```

<Playground id="#2I28SC#27" title="Modified Ascii Post Process Demo 3" description="Modified Ascii Post Process Demo 3"/>
