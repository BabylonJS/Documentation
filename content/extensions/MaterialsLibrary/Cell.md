---
title: Cell material
image:
description: The Babylon.js materials library cell material.
keywords: library, materials, materials library, cell, cell material
further-reading:
video-overview:
video-content:
---

![Toon material](/img/features/extensions/materials/toon.png)

# Using the cell material

Cell material can be found here: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/materialsLibrary/babylon.cellMaterial.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/materialsLibrary/babylon.cellMaterial.js)

A demo can be found here: PG: <Playground id="#36VUUE" title="Cell Material" description="Example of cell material"/>

# Creating and customizing the cell material

You can customize special properties of the material:

```javascript
// Create a new cell material
var cell = new BABYLON.CellMaterial("cell", scene);

// Set up the diffuse texture
cell.diffuseTexture = new BABYLON.Texture("textures/amiga.jpg", scene);

// Set up diffuse color
cell.diffuseColor = new BABYLON.Color3(1, 0.5, 0);

// Set the material to be high level (default value is true)
// The high level can compute until 5 different lighting levels
// If false, only two levels are available
cell.computeHighLevel = true;
```
