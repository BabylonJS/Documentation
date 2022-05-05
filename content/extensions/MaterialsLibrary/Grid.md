---
title: Grid Material
image:
description: The Babylon.js materials library displays a grid across the mesh.
keywords: library, materials, materials library, grid material
further-reading:
video-overview:
video-content:
---

## Grid material

![Grid Material](/img/features/extensions/materials/grid.png)

## Playground example

A full playground example can be found here: PG: <Playground id="#1UFGZH#12" title="Grid Material" description="Example of grid material"/>

## Using the Grid material

As the grid material is a babylonJS extension, it is not included in the main _babylon.js_ file. In order to use the material, please download and reference the extension from the cdn using [babylon.gridMaterial.js](https://cdn.babylonjs.com/materialsLibrary/babylon.gridMaterial.js) or its minified version [babylon.gridMaterial.min.js](https://cdn.babylonjs.com/materialsLibrary/babylon.gridMaterial.min.js).

The default grid behaviour does not require any setup and displays a black and white grid on your meshes:

![gridDefault](/img/features/extensions/materials/gridDefault.png)

You can access the live example in this PG: <Playground id="#2KKVBH" title="Grid Material" description="Example of grid material"/>

The grid is using the local position to outline any of the axis fitting with one unit in black. Only one on ten lines will be fully black, the other lines will be in lighter grey. You can imagine it as a ruler with bigger marks for centimeters and smaller for millimeters.

```javascript
var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMap.png", 100, 100, 100, 0, 10, scene, false);
ground.material = new BABYLON.GridMaterial("groundMaterial", scene);
```

## Customize the grid material

In order to help you making the grid fit in your scenes, a few controls are available:

- `mainColor`: the main color pilots the color of the empty area
- `lineColor`: the line color drives the line color... What an amazing surprise !!!
- `opacity`: the opacity helps changing the lines opacity. In transparent mode (opacity < 1.0), the empty area will always be at an opacity level of `0.08`
- `gridRatio`: subdivide the object size in order to fit with it
- `majorUnitFrequency`: frequency of strong lines
- `minorUnitVisibility`: level of minor lines compared to the major ones
- `gridOffset`: the offset vector3 will shift the cells of the grid by a set amount

### Few clarifications

#### gridRatio

The grid will be projected on objects according to their size. If an object has a size of 1, you'll only see one line on it.
For instance a 1 size cube will by default only have one line:

![Grid Ratio 1](/img/features/extensions/materials/gridRatio1.png)

PG: <Playground id="#5S6MD" title="Grid Material" description="Grid ratio of 1"/>

Using a gridRatio of 0.1, will then make appear ten lines on it:

![Grid Ratio 2](/img/features/extensions/materials/gridRatio2.png)

PG: <Playground id="#5S6MD#1" title="Grid Material" description="Grid ratio of 2"/>

#### majorUnitFrequency

You have now noticed on the gridRatio examples above that only one on ten lines is stronger. This is control by the parameter named `majorUnitFrequency` which gets its default value to 10.

Setting it to 2, will make appear one strong line each 2 lines. This is only a scary parameter name for something simple:

![Grid MUF](/img/features/extensions/materials/gridMUF.png)

PG: <Playground id="#5S6MD#2" title="Grid Material" description="Example of using multi unit frequency"/>

#### minorUnitVisibility

After sorting out the frequency of stronger lines, you could wonder how to control the strength of the minor ones. The parameter `minorUnitVisibility` will help you to control this. This value should be smaller than 1 which is the value applied to the main lines. The default value is 0.33 which corresponds to 33% of the `lineColor`.

Setting it to 0.1 will then reinforce the effect of the main lines (by dropping the value of the minor ones):

![Grid MUV](/img/features/extensions/materials/gridMUV.png)

PG: <Playground id="#5S6MD#3" title="Grid Material" description="Example of using minor unit visiblity"/>

#### gridOffset

Note that the shift for each axys allows a loop: using a `gridOffset` of `(0, 0, 0)` will give you the same visual result than `(1, 0, 0)`.

PG: <Playground id="#URSDPL#1" title="Grid Material" description="Example of using grid offset"/>

#### useMaxLine

Sometimes the points where grid lines intersect may appear brighter than the rest of the grid. Set useMaxLine to true to remove this effect.

PG: <Playground id="#1UFGZH#222" title="Grid Material" description="Example of using useMaxLine"/>
