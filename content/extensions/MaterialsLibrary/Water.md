---
title: Water Material
image: 
description: The Babylon.js materials library water effect.
keywords: welcome, babylon.js, library, materials, materials library
further-reading:
video-overview:
video-content:
---

![Water material](/img/extensions/materials/water.jpg)

# Using the water material

Water material can be found here: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/materialsLibrary/babylon.waterMaterial.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview%20release/materialsLibrary/babylon.waterMaterial.js)

A demo can be found here:   PG: <Playground id="#1SLLOJ#20" title="Water Material" description="Example of water material" image=""/>

# Water material by demo

- PG: <Playground id="#1SLLOJ#15" title="Water Material" description="Calm lake" image=""/>  
- PG: <Playground id="#1SLLOJ#17" title="Water Material" description="Ocean, play with waves" image=""/>  
- PG: <Playground id="#1SLLOJ#18" title="Water Material" description="Deep water, play with water color" image=""/>  
- PG: <Playground id="#1SLLOJ#19" title="Water Material" description="Beach" image=""/>

The water material needs at least only a bump texture to render properly.
Just create a new reference of the material and assign its bump texture:

```
var ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, scene);

var waterMaterial = new BABYLON.WaterMaterial("water_material", scene);
waterMaterial.bumpTexture = new BABYLON.Texture("bump.png", scene); // Set the bump texture

ground.material = waterMaterial;
```

To reflect and refract the world, you just have to add the wanted meshes to the render list:

```
waterMaterial.addToRenderList(skybox);
waterMaterial.addToRenderList(mesh1);
waterMaterial.addToRenderList(mesh2);
// ... etc.
```

That's all.

# Customize the water material

You can customize special properties of the material:

```
waterMaterial.windForce = 45; // Represents the wind force applied on the water surface
waterMaterial.waveHeight = 1.3; // Represents the height of the waves
waterMaterial.bumpHeight = 0.3; // According to the bump map, represents the pertubation of reflection and refraction
waterMaterial.windDirection = new BABYLON.Vector2(1.0, 1.0); // The wind direction on the water surface (on width and height)
waterMaterial.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6); // Represents the water color mixed with the reflected and refracted world
waterMaterial.colorBlendFactor = 2.0; // Factor to determine how the water color is blended with the reflected and refracted world
waterMaterial.waveLength = 0.1; // The lenght of waves. With smaller values, more waves are generated
```


