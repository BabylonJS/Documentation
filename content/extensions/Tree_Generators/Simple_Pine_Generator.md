---
title: Simple Pine Tree Generator
image: 
description: The simplePineGenerator uses a tube to generate a tree.
keywords: welcome, babylon.js, tree, tree generator
further-reading:
video-overview:
video-content:
---

![Generated Tree ](/img/extensions/trees/pine1.png)

The function simplePineGenerator uses a tube to generate a tree. 

It is based on playgrounds from  this forum topic https://www.html5gamedevs.com/topic/21484-simple-pine-trees/

A demo can be found at:  PG: <Playground id="#LG3GS#106" title="Simple Pine Tree Generator" description="Example of Simple Pine Tree Generator" image=""/>

## How to use it.

Clone or copy the file https://github.com/BabylonJS/Extensions/tree/master/TreeGenerators/SimplePineGenerator

call the function


```
var tree = simplePineGenerator(canopies, height, trunkMaterial, leafMaterial, scene);
```

## Parameters

canopies - number of leaf sections.

height - height of tree.

trunkMaterial - material used for trunk.

leafMaterial - material for canopies.
 
scene - BABYLON scene.  