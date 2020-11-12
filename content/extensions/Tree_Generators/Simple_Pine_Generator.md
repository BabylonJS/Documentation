---
title: Simple Pine Tree Generator
image: 
description: Learn about the simple pine tree generator extension.
keywords: extensions, babylon.js, tree, tree generator, pine
further-reading:
video-overview:
video-content:
---

## Simple Pine Tree Generator

![Generated Tree ](/img/extensions/trees/pine1.png)

The function simplePineGenerator uses a tube to generate a tree. 

It is based on playgrounds from  this forum topic https://www.html5gamedevs.com/topic/21484-simple-pine-trees/

A demo can be found at: <Playground id="#LG3GS#106" title="Simple Pine Tree Generator Example" description="Simple example of the simple pine tree generator." image=""/>

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