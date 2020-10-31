# How To Highlight a Mesh

How often did you search to highlight some of your meshes in a scene? Sounds easy at first but quickly becomes an issue dealing with edges, blur and antialiasing.

If you ever needed it, this tutorial is made for you.

![illustration](/img/how_to/highlight-mesh/introduction.png)

# How to use?

Before anything else, you must ensure that your engine was created with stencil on: 

```javascript
var engine = new BABYLON.Engine(canvas, true, { stencil: true });
```

The HighlightLayer relies on stencil to determine which part of the image it needs to paint.

## Default Use Case

In the most basic shape, you only need to instantiate one highlight layer in your scene and add the meshes you want to highlight in it.

```javascript
// Add the highlight layer.
var hl = new BABYLON.HighlightLayer("hl1", scene);
hl.addMesh(sphere, BABYLON.Color3.Green());
```

The highlight color is driven by the second parameter of the `addMesh` method:

[**Playground Demo Scene**](https://www.babylonjs-playground.com/#1KUJ0A#305)

## Stop highlighting a Mesh

In case one highlighted mesh do not require highlights anymore, you can simply remove it from the layer:

```javascript
// Add the highlight layer.
var hl = new BABYLON.HighlightLayer("hl1", scene);
hl.addMesh(sphere, BABYLON.Color3.Green());
hl.removeMesh(sphere);
```

[**Playground Demo Scene**](https://www.babylonjs-playground.com/#1KUJ0A#102)

## Emissive Input

If you wish, you could also use the emissive texture as a source for the highlight color. Simply pass true as the third parameter of the add mesh method.

```javascript
hl1.addMesh(sphere, BABYLON.Color3.Black(), true);
```

[**Playground Demo Scene**]( https://www.babylonjs-playground.com/#1KUJ0A#57)

You can notice here that one side of the sphere is glowing in yellow whereas the other one is grey. The color is not uniform.

# Going further

## Overlapping Highlights

The first thing you will probably notice is the fact that overlapping highlighted meshes are not showing highlights in common areas.

```javascript
// Add the highlight layer.
var hl = new BABYLON.HighlightLayer("hl1", scene);
hl.addMesh(sphere, BABYLON.Color3.Green());
hl.addMesh(ground, BABYLON.Color3.Red());
```

[**Overlapping Demo Scene**]( https://www.babylonjs-playground.com/#1KUJ0A#1)

This is the default behavior optimized for performances. If you are running your scenes on fast enough machine, you can create several highlight layers to workaround the issue:

```javascript
// Add the highlight layer.
var hl1 = new BABYLON.HighlightLayer("hl1", scene);
hl1.addMesh(sphere, BABYLON.Color3.White());
var hl2 = new BABYLON.HighlightLayer("hl2", scene);
hl2.addMesh(ground, BABYLON.Color3.Red());
```

[**Overlapping Demo Scene**]( https://www.babylonjs-playground.com/#1KUJ0A#2)

## Blur Size

The second ask you will probably have is the ability to animate the blur size of the highlight. You can dynamically change it at run time through the blur size property of the layer:

```javascript
// Add the highlight layer.
var hl2 = new BABYLON.HighlightLayer("hl2", scene);
hl2.addMesh(ground, BABYLON.Color3.Red());

var alpha = 0;
scene.registerBeforeRender(() => {
    alpha += 0.06;
    
    hl2.blurHorizontalSize = 0.3 + Math.cos(alpha) * 0.6 + 0.6;		
    hl2.blurVerticalSize = 0.3 + Math.sin(alpha / 3) * 0.6 + 0.6;
});
```

[**Blur Size Demo Scene**]( https://www.babylonjs-playground.com/#1KUJ0A#4)

## Inner vs Outer Glow 

Finally, you can easily enable/disable inner and outer glow on the highlight layer.

```javascript
// Add the highlight layer.
var hl1 = new BABYLON.HighlightLayer("hl1", scene);
hl1.addMesh(sphere, BABYLON.Color3.White());
hl1.outerGlow = false;

var hl2 = new BABYLON.HighlightLayer("hl2", scene);
hl2.addMesh(ground, BABYLON.Color3.Red());
hl2.innerGlow = false;
```

[**Glow Demo Scene**]( https://www.babylonjs-playground.com/#1KUJ0A#3)

You can notice on the previous scene the white glowing only inside of the sphere and the red only outside of the plane.

## Exclude mesh

Depending on your scene, transparent meshes may not render correctly with other highlighted meshes:

[**Broken transparency Scene**]( https://www.babylonjs-playground.com/#2FFOYQ#6)

In that case, try to exclude them from the highlight generation process in order to fix this:

```javascript
hl.addExcludedMesh(skybox1);
```

[**Fixed transparency Scene**]( https://www.babylonjs-playground.com/#2FFOYQ#7)

## Multi Camera

By default, the highlight layer will apply on all active cameras but it creates extra processing on the camera it is not needed.

A chance you can easily specify what camera your highlights are related too in the options:

```javascript
var hl1 = new BABYLON.HighlightLayer("hl1", scene, {camera: camera});
hl1.addMesh(sphere, BABYLON.Color3.Green());
```

[**Multi Camera Scene**]( https://www.babylonjs-playground.com/#CDHKK#7)

## Rendering Groups

If you rely on rendering groups in your application, be mindful that the highlights requires stencil and depth info of your scene to work accurately.

So you could disable the clear between rendering groups with the command: ```scene.setRenderingAutoClearDepthStencil(1, false, false)``` where the first parameter is the rendering group id, the second to prevent automatically clearing depth between groups and the last to preven automatically clearing stencil information between groups.

# Options

The available members of the option object are:

- mainTextureRatio?: number - Multiplication factor apply to the canvas size to compute the render target size used to generated the glowing objects (the smaller the faster).
- mainTextureFixedSize?: number - Enforces a fixed size texture to ensure resize independent blur.
- blurTextureSizeRatio?: number - Multiplication factor apply to the main texture size in the first step of the blur to reduce the size of the picture to blur (the smaller the faster).
- blurVerticalSize?: number - How big in texel of the blur texture is the vertical blur.
- blurHorizontalSize?: number - How big in texel of the blur texture is the horizontal blur.
- alphaBlendingMode?: number - Alpha blending mode used to apply the blur. Default is combine.
- camera?: Camera - The camera attached to the layer (only this camera can see the highlights).

You can pass them during the construction of the highlight layer:

```javascript
var hl1 = new BABYLON.HighlightLayer("hl1", scene, { camera: myCamera });
```

# Further Reading

# How To

- [How To Make a Mesh Glow](/how_to/glow_layer)

# API

- [HighlightLayer](/api/classes/babylon.highlightlayer)