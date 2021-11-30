---
title: Making Meshes Glow
image: 
description: Learn all about the glow layer in Babylon.js.
keywords: diving deeper, meshes, glow layer, glow
further-reading:
    - title: How To Highlight a Mesh
      url: /divingDeeper/mesh/highlightLayer
    - title: GlowLayer API
      url: /typedoc/classes/babylon.glowlayer
video-overview:
video-content:
---

## How To Make a Mesh Glow

Emissive meshes are equivalent to self lit meshes. Both the emissive color and texture of the material determine how the mesh will self lit. This can for instance helps create a phosphorescent watch dial. Babylon JS supports natively emissive poperties in both the standard and PBR materials.

But how could we easily make the glow around those self lit areas ?

![illustration](/img/how_to/glow-layer/introduction.jpg)

## How to use ?

Only one line is needed to make all the emissive parts of a scene glow:

```javascript
var gl = new BABYLON.GlowLayer("glow", scene);
```

<Playground id="#LRFB2D#1" title="Glow Layer Example" description="Simple example of using the glow layer."/>

## Intensity Controls

By default, the glow layer is filled using the material emissive parameters (emissive result = emssive color * emissive texture color * emissive texture level). It will also use a blur kernel of 32 which might not be adapted to your visual requirements.

## Color Intensity

To control the intensity of the color in the glow layer, you can use the dedicated property:

```javascript
var gl = new BABYLON.GlowLayer("glow", scene);
gl.intensity = 0.5;
```

<Playground id="#LRFB2D#2" title="Glow Layer Color Intensity" description="Simple example of using the glow layer with color intensity."/>

### Blur Intensity

In order to control change the shape of the blur, you can rely on the creation option:

* **mainTextureRatio**: Multiplication factor apply to the canvas size to compute the render target size used to generated the glowing objects (the smaller the faster).
* **mainTextureFixedSize**: Enforces a fixed size texture to ensure resize independant blur to prevent the shape of the blur to change according to the target device size.
* **blurKernelSize**: How big is the kernel of the blur texture.

```javascript
var gl = new BABYLON.GlowLayer("glow", scene, { 
    mainTextureFixedSize: 1024,
    blurKernelSize: 64
});
```

<Playground id="#LRFB2D#3" title="Glow Layer Blur Intensity" description="Simple example of using the glow layer with blur intensity."/>

### Controlling glow color per mesh
By default the glow layer will use emissive texture and emissive color to generate the glow color of every active mesh.
But you can override this behavior with the following callbacks:

* customEmissiveColorSelector: (mesh: Mesh, subMesh: SubMesh, material: Material, result: Color4) => void: Callback used to let the user override the color selection on a per mesh basis
* customEmissiveTextureSelector(mesh: Mesh, subMesh: SubMesh, material: Material) => Texture: Callback used to let the user override the texture selection on a per mesh basis

```javascript
var gl = new BABYLON.GlowLayer("glow", scene);
gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
    if (mesh.name === "lightsaber") {
        result.set(1, 0, 1, 1);
    } else {
        result.set(0, 0, 0, 0);
    }
}
```

## Anti Aliasing

Depending on your setup, some aliasing artifacts might appear in the glow. To prevent this behavior, you can specify the number of samples to use for MSAA on the main render target. Please note that it will only work on WebGL2 capable browsers.

```javascript
var gl = new BABYLON.GlowLayer("glow", scene, { 
    mainTextureSamples: 4 
});
```

<Playground id="#LRFB2D#4" title="Glow Layer Anti Aliasing" description="Simple example of using the glow layer with anti aliasing."/>

## Mesh Management

Some helper functions have been introduced to exclude or only include some meshes from the scene. 

### Excluded Mesh

In order to exclude meshes from the glow layer you can use the dedicated function:

```javascript
var gl = new BABYLON.GlowLayer("glow", scene);
gl.addExcludedMesh(mesh)
```

<Playground id="#LRFB2D#29" title="Excluding Meshes From The Glow Layer" description="Simple example of excluding meshes from the glow layer."/>

### Include Only some Meshes

In order to include only a subset of meshes in the glow layer you can use the dedicated function:

```javascript
var gl = new BABYLON.GlowLayer("glow", scene);
gl.addIncludedOnlyMesh(mesh)
```

Using the function will automatically switch mode and only render the included meshes.

<Playground id="#LRFB2D#30" title="Including Specific Meshes In The Glow Layer" description="Simple example of including specific meshes in the glow layer."/>

### Using Glow with Node Materials

The Glow layer can also be combined with a [Node Material](/divingDeeper/materials/node_material/nodeMaterial) for endless possibilities. You can achieve this by utilizing masking in the node material, separating the emission texture from the base color texture, and then recompositing them together using the mesh's glow layer. Check out the following playground and video for a deeper explanation.

<Playground id="#7QCYPB" title="Using Glow Layer with Node Materials" description="Simple example of using a mesh's glow layer with a node material."/>

<Youtube id="5ZuM-WLqEPQ"/>