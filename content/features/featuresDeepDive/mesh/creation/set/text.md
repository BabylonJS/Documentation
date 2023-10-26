---
title: Creating A 3D Text object
image:
description: Learn how to create a 3d text in Babylon.js.
keywords: diving deeper, meshes, set shapes, standard shapes, text, font
further-reading:
video-overview:
video-content:
---

## Text

The created mesh will be 3D object created as an extrusion of a given text. It will have its origin at the center of the text.

## Prerequesite

The `MeshBuilder.CreateText` is leveraging our ExtrudePolygon feature which requires you to have **Earcut library available**. Whilst an Earcut script is pre-loaded in the Playground you will have to add a reference to such a script in your own projects. One is available at [CDN](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or via a [npm package](https://github.com/mapbox/earcut#install).

## MeshBuilder

Usage :

```javascript
const fontData = await (await fetch("./fonts/Droid Sans_Regular.json")).json(); // Providing you have a font data file at that location
const text = BABYLON.MeshBuilder.CreateText(
  "myText",
  "Hello World !! @ #$ % é",
  fontData,
  {
    size: 16,
    resolution: 64,
    depth: 10,
  },
  scene,
);
```

| options property | value                                                | default value |
| ---------------- | ---------------------------------------------------- | ------------- |
| size             | _(number)_ size of each letter                       | 50            |
| resolution       | _(number)_ number of points used when tracing curves | 8             |
| depth            | _(number)_ extrusion depth (on Y axis)               | 1.0           |
| sideOrientation  | _(number)_ side orientation                          | DOUBLESIDE    |

### Generating font data

To be able to trace and extrude the mesh, you have to provide font data information.
Babylon.js is supporting the fantastic work done by Gero3 on http://gero3.github.io/facetype.js/

Simply go to this site and generate the json description file for the font you want to use.

We are also offering already exported fonts on assets.babylonjs.com:

- https://assets.babylonjs.com/fonts/Droid Sans_Bold.json (http://www.droidfonts.com/)
- https://assets.babylonjs.com/fonts/Droid Sans_Regular.json (http://www.droidfonts.com/)
- https://assets.babylonjs.com/fonts/Kenney Future Regular.json (https://www.kenney.nl/assets/kenney-fonts)

### Examples

Hello world: <Playground id="#6I2RMN#2" title="Create a 3d text" description="Simple example of creating a 3d text." image="/img/playgroundsAndNMEs/createText.jpg"/>

### Controlling letters texture mapping and colors

You can use a specific parameter to set the way the UVs and colors are attached on the new mesh:

```javascript
var myText = BABYLON.MeshBuilder.CreateText("myText", "HELLO WORLD", fontData, {
        size: 16,
        resolution: 64,
        depth: 10,
        faceUV: [
            new BABYLON.Vector4(0, 0, 1, 1),
            new BABYLON.Vector4(0, 0, 1, 1),
            new BABYLON.Vector4(0, 0, 1, 1),
        ];
    });
```

The faceUV array defines an array of Vector4 elements used to set different texture coordinates to the front, top and back faces respectively.
You can do the same for colors with faceColors.

But you may want to go further and control the texture coordinates or colors per letter. To do so you can use the following code:

```javascript
const letterCount = 10;
    const step = 1 / letterCount;
    var myText = BABYLON.MeshBuilder.CreateText("myText", "HELLO WORLD", fontData, {
        size: 16,
        resolution: 64,
        depth: 10,
        perLetterFaceUV: (index) => {
            const startX = index * step;
            return [
                new BABYLON.Vector4(startX, 0, startX + step, 1),
                new BABYLON.Vector4(startX, 0, startX + step, 1),
                new BABYLON.Vector4(startX, 0, startX + step, 1),
            ];
        }
    });
```

The perLetterFaceUV (and its sister perLetterFaceColors) is a callback used to provide the data per letter instead of per mesh.

<Playground id="#8S9WRP" title="Create a 3d text" description="Example of creating a 3d text with per letter UV coordinates"/>
