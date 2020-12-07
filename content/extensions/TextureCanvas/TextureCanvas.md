---
title: Texture Canvas
image: 
description: Learn about the texture canvas extension that functions as a texture that other textures can be drawn upon.
keywords: extensions, babylon.js, texture canvas
further-reading:
video-overview:
video-content:
---

## TextureCanvas

![Fur material high](/img/extensions/texturecanvas.jpg)

## About

TextureCanvas is a texture on which other textures can be drawn.

## Usage

## Creating a canvas

To construct a TextureCanvas, you need to provide the size and the scene the texture will be used in:

```javascript
// A square texture
let canvas = new TextureCanvas(128, scene);
```

```javascript
// A rectangular texture
let canvas = new TextureCanvas({ width: 256, height: 128 }, scene);
```

Aditionally, you may pass three more parameters, which are:

-   _initTexture_, an initial texture to draw.
-   _onReady_, a function to be called when the canvas is ready.
-   _options_, an object with the properties _generateMipMaps_ (boolean) and _samplingMode_ (number)

PG: <Playground id="#9S5YZY#6" title="Texture Canvas" description="Example of a TextureCanavas" image=""/>

## Draw using contexts

Contexts can be used to specify how a texture should be drawn. Multiple contexts can be created and used interchangably.

To draw a texture using the default context, you can call `canvas.drawTexture(myTexture)`.

You can create a context like this:

```javascript
let ctx = canvas.createContext();
```

A context has the following propteries:

| Name                    | Type                                                                                                                | Description                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| diffuseTexture          | [Texture](/api/classes/babylon.texture)                                                    | The texture to draw.                                                                                      |
| diffuseSamplingRect     | [Rectangle](https://github.com/Poolminer/BabylonTextureCanvas/blob/master/DOCUMENTATION.md#rectangle-class)         | The area of the diffuse texture to draw.                                                                  |
| drawRect                | [Rectangle](https://github.com/Poolminer/BabylonTextureCanvas/blob/master/DOCUMENTATION.md#rectangle-class)         | The area to draw to.                                                                                      |
| rotation                | [Vector3Matrix](https://github.com/Poolminer/BabylonTextureCanvas/blob/master/DOCUMENTATION.md#vector3matrix-class) | The rotation axes in radians to rotate the diffuse textures by (_z_ is 2D rotation).                      |
| pivotPoint              | [PivotPoint](https://github.com/Poolminer/BabylonTextureCanvas/blob/master/DOCUMENTATION.md#pivotpoint-class)       | The rotation pivot point.                                                                                 |
| skewing                 | [UVector](https://github.com/Poolminer/BabylonTextureCanvas/blob/master/DOCUMENTATION.md#uvector-class)             | The amount of skewing/shearing.                                                                           |
| opacityTexture          | [Texture](/api/classes/babylon.texture)                                                    | The texture to get the alpha values from.                                                                 |
| opacityTextureIntensity | number                                                                                                              | How much the opacity texture should be contributing to the difuse's alpha values, ranging from 0.0 to 1.0 |
| opacitySamplingRect     | [Rectangle](https://github.com/Poolminer/BabylonTextureCanvas/blob/master/DOCUMENTATION.md#rectangle-class)         | The area of the opacity texture to use.                                                                   |
| clearColor              | [Color4](/api/classes/babylon.color4)                                                      | The color to clear the canvas with.                                                                       |

And the following methods:

| Name                   | Parameters                                                                                         | Description                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| reset                  |                                                                                                    | Resets the draw options to their default values.                                            |
| setDiffuseSamplingRect | u, v, width, height                                                                                | Sets which area of the diffuse texture to draw.                                             |
| setOpacitySamplingRect | u, v, width, height                                                                                | Sets which area of the opacity texture to draw.                                             |
| setDrawRect            | u, v, width, height                                                                                | Sets which area of the canvas to draw to — this area may be tranformed by rotating/skewing. |
| setRotation            | x?: number, y?: number, z?: number                                                                 | Sets the rotation axes in radians rotate the diffuse texture by (_z_ is 2D rotation).       |
| setPivotPoint          | pu?: number, pv?: number, isLocalSpace?: boolean                                                   | Sets the point around which to rotate the texture.                                          |
| setSkewing             | u, v                                                                                               | Sets how the texture should be skewed (shear transform).                                    |
| draw                   |                                                                                                    | Draws the diffuse texture, if set.                                                          |
| drawTexture            | diffuseTexture: Texture                                                                            | Draws a texture.                                                                            |
| clear                  |                                                                                                    | Clears the canvas using the set clearColor.                                                 |
| clone                  | cloneDrawOptions?:&nbsp;boolean, cloneTextures?:&nbsp;boolean, ref?:&nbsp;TextureCanvasDrawContext | Returns a clone of the context.                                                             |

Once the context is set up, simply call `ctx.draw()` or `ctx.drawTexture(myTexture)`

PG: <Playground id="#436DIW#2" title="Texture Canvas" description="Example of drawing on a TextureCanavas" image=""/>

## Notes

Please note that uv-coordinates are used rather than pixel values.

## Rotation

Rotating a texture happens in three dimensions in the default coordinate system of Babylon.js, with _z_ being the forward axis.

You can set a pivot point to be in local space (that of the diffuse texture), or world space (that of the canvas), with `pivotPoint.isLocalSpace`.
