---
title: Quick Tree Generator
image: 
description: Learn about the quick tree generator extension.
keywords: extensions, babylon.js, tree, tree generator, quick tree
further-reading:
video-overview:
video-content:
---

![Generated Tree ](/img/extensions/trees/quick1.png)

The function QuickTreeGenerator uses a sphere with randomized vertices to generate a tree. 

A demo can be found at: <Playground id="#LG3GS#107" title="Quick Tree Generator Example" description="Simple example of the quick tree generator."/>

## How to use it.

Clone or copy the file https://github.com/BabylonJS/Extensions/tree/master/TreeGenerators/QuickTreeGenerator

Before using check your version of BABYLONJS versions 2.2 and earlier require line 8 to be active, comment line 9 instead
BABYLON 2.3 or later leave as is.

call the function

```
var tree = QuickTreeGenerator(sizeBranch, sizeTrunk, radius, trunkMaterial, leafMaterial, scene);
```

## Parameters

sizeBranch - sphere radius used for branches and leaves 15 to 20.

sizeTrunk - height of trunk 10 to 15.

radius - radius of trunk 1 to 5.

trunkMaterial - material used for trunk.

leafMaterial - material for canopies.
 
scene - BABYLON scene. 
