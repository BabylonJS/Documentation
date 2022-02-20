---
title: Cascaded Shadow Maps
image: 
description: Learn how to utilize Cascaded Shadow Maps in Babylon.js
keywords: diving deeper, lights, lighting, shadows, cascaded shadows, csm
further-reading:
video-overview:
video-content:
---

## Introduction

Cascaded Shadow Maps (CSM) can greatly enhance the shadows in your scene, but it is only available for **directional lights**. It is generally used for large outdoor scenes, to simulate the sun.

This page will explain everything you need to know in order to setup this shadow rendering technique and get the best out of your shadows!

This is a shadow map technique, so a lot of what is said in [Shadows](/features/start/chap7/shadows) does apply, so don't hesitate to read this page first.

Note that CSM requires WebGL 2+.

Here's a Playground demonstrating the CSM technique and the existing `ShadowGenerator`: <Playground id="#IIZ9UU#40" title="Cascaded Shadow Map Example" description="Simple Example of using the CSM system in your scene." image="/img/playgroundsAndNMEs/features/divingDeeperCSM1.jpg"/>

## Technical overview

A quick survey of the technique will help to understand the different properties of the `CascadedShadowGenerator` class. You can also have a look at the [references](/features/divingDeeper/lights/shadows_csm#references) provided at the end of this page for further details.

## Subdividing the frustum

CSM works by subdividing the view frustum (frustum of the camera, meaning what the camera can see) into several subfrusta, each of them being called a cascade (hence the name of the technique):

**Figure 1. View frustum partitionning (picture from \[[1](#references)\])**
![View frustum partitionning](/img/babylon101/csm/view-frustums-partitioned-arbitrarily.png)

The subdivision of the camera frustum is done either linearly (each subfrustum has the same length) or logarithmically (the length of the first subfrustum is a lot smaller than the length of the last one). It can also be a combination of the linear and logarithmic splitting, a `lambda` parameter being used to combine both (a `0` value means the splitting is fully linear, `1` means it is fully logarithmic, and a value in-between implies a mix of both).

## Computing the shadow level

For each subfrustum, a shadow map is generated, in much the same way the standard shadow generator does.

When rendering a mesh, the right shadow map is determined for a given pixel and is sampled to get the shadow level.

**Figure 2. Cascade rendering (picture from \[[1](#references)\])**
![Cascade rendering](/img/babylon101/csm/interval-based-cascade-selection.jpg)

In figure 2, pixels pertaining to different cascades are drawn with different colors, so that they are clearly visible.

## Blend between cascades

Sometimes, there can be visible seams between cascades:

**Figure 3. Cascade seams (picture from \[[1](#references)\])**
![Cascade seams](/img/babylon101/csm/cascade-seams.jpg)

A blend parameter can be used to smooth the transition (see picture on the right in figure 3).

## Filtering

As for the standard shadow generator, filtering methods can be used to improve / make soft shadows. For CSM, only the PCF (Percentage Closer Filtering) and PCSS (Contact hardening shadows) methods are currently supported (as well as no filtering at all!).

## The `CascadedShadowGenerator` class

## Creation

You create a `CascadedShadowGenerator` instance in exactly the same way as a standard `ShadowGenerator`:

```javascript
var csmShadowGenerator = new BABYLON.CascadedShadowGenerator(1024, light);
```

The first parameter is the shadow map size and the second one the (directional) light to use the generator for.

To add shadow casters, do as for `ShadowGenerator`:
```javascript 
csmShadowGenerator.getShadowMap().renderList.push(torus);
```
or:
* `csmShadowGenerator.addShadowCaster(mesh, includeDescendants)`: Helper function to add a mesh and its descendants to the list of shadow casters
* `csmShadowGenerator.removeShadowCaster(mesh, includeDescendants)`: Helper function to remove a mesh and its descendants from the list of shadow casters

And for the mesh(es) that should receive (display) shadows:
```javascript
mesh.receiveShadows = true;
```

In fact, the class has been designed to be interface-compatible with `ShadowGenerator`, except of course for the parameters specific to CSM and for the fact that only PCF and PCSS are supported as filtering methods. So, you should be able to simply replace:
```javascript
new BABYLON.ShadowGenerator(...)
```
with:
```javascript
new BABYLON.CascadedShadowGenerator(...)
```
in your code and have CSM just working out of the box!

**Important**: contrary to the standard `ShadowGenerator`, `light.shadowMinZ` and `light.shadowMaxZ` are NOT used, so don't bother to update them!

## Properties

### numCascades (default: 4)

By default, the generator uses 4 cascades, but you can change this at any time through the `numCascades` property (allowed values between 2 and 4):
```javascript
csmShadowGenerator.numCascades = 3;
```

**Figure 4. num cascades is 2 on the left, 4 on the right**
![numCascades](/img/babylon101/csm/numcascades-parameter.jpg)

### lambda (default: 0.5)

The `lambda` parameter (described in the technical overview) can be set with:
```javascript
csmShadowGenerator.lambda = 0.5;
```

**Figure 5. lambda=0.5 on the left, lambda=0.7 on the right**
![lambda](/img/babylon101/csm/lambda-parameter.jpg)

The right value (between 0 and 1) depends on your scene and how the camera is to be used: near the ground or high in the sky. You should experiment with different values and see what works best for you.

### cascadeBlendPercentage (default: 0.1)

The cascade blend factor can be set with:
```javascript
csmShadowGenerator.cascadeBlendPercentage = 0.05;
```

**Figure 6. Cascade blend (picture from \[[1](#references)\])**
![cascadeBlendPercentage](/img/babylon101/csm/cascade-seams.jpg)

It's a percentage value between 0 and 1. Try to use small values, else you may get rendering artifacts.

### stabilizeCascades (default: false)

When rotating the camera, you may see the edges of the shadows "swimm" / "shimmer". You may fix the problem with the `stabilizeCascades` property:
```javascript
csmShadowGenerator.stabilizeCascades = true;
```

Note however that you will loose some precision in the shadow rendering, so use it only if you need it.

**Figure 7. Precision lost when stabilization enabled (left: enabled, right: disabled)**
![stabilizeCascades](/img/babylon101/csm/stabilize-parameter.jpg)

### shadowMaxZ

It's the limit beyond which shadows are not displayed. It defaults to `camera.maxZ` when constructing the generator.

**Figure 8. shadowMaxZ equal to camera.maxZ on the left, is smaller on the right**
![shadowMaxZ](/img/babylon101/csm/shadowmaxz-parameter.jpg)

### depthClamp (default: true)

When enabled, it improves the shadow quality because the near z plane of the different cascade light frusta don't need to be adjusted to account for the shadow casters far away.

Note that this property is incompatible with PCSS filtering, so it won't be used in that case.

### debug (default: false)

When enabled, the cascades are materialized by different colors on the screen:

**Figure 9. Cascade rendering (picture from \[[1](#references)\])**
![Cascade rendering](/img/babylon101/csm/interval-based-cascade-selection.jpg)


### freezeShadowCastersBoundingInfo (default: false) and shadowCastersBoundingInfo

Enables or disables the shadow casters and receivers bounding info computation. If your shadow casters and receivers don't move, you can disable this feature. If it is enabled, the bounding box computation is done every frame and the `shadowCastersBoundingInfo` property is updated with the data. The bouding info is used to set the min and max z values of the cascade light frusta.

You can provide your own bounding info by setting the `shadowCastersBoundingInfo` property (don't forget to disable the automatic computation first with `csmShadowGenerator.freezeShadowCastersBoundingInfo = true` !)

### autoCalcDepthBounds (default: false)

_Note: it corresponds to the implementation of the first pass of the Sample Distribution Shadow Maps technique, see [3](#references) for details._

You can greatly improve the shadow rendering (depending on your scene) by setting `autoCalcDepthBounds` to `true`, at the expense of more GPU work.

```javascript
csmShadowGenerator.autoCalcDepthBounds = true;
```

**Figure 10. Same settings for both sides, except for `autoCalcDepthBounds = true` on the right**
![autoCalcDepthBounds](/img/babylon101/csm/sdsm-first-pass.jpg)

When enabled, a depth rendering pass is first performed (with an internally created depth renderer or with the one you provide by calling `setDepthRenderer`). Then, a min/max reducing is applied on the depth map to compute the minimal and maximal depth values of the map and those values are used as inputs for the `setMinMaxDistance()` function.

You can instruct the generator to compute those values less often than each frame with the `autoCalcDepthBoundsRefreshRate` property:
```javascript
csmShadowGenerator.autoCalcDepthBoundsRefreshRate = 2;
```
will perform the computation every two frames. It can produce some visual artifacts, however, as the values used for the frustum splitting are now lagging one frame behind the real values, so make testing to see what works best for you.

Note that if you provided your own depth renderer through a call to `setDepthRenderer`, you are responsible for setting the refresh rate on the renderer yourself!

When using `autoCalcDepthBounds = true`, you should increase the value of the `lambda` parameter, and even set it to 1 for best results (experimenting is still the best option, though).

There's no point to use `stabilizeCascades = true` when `autoCalcDepthBounds = true` because the cascade splits are recomputed every frame. So, set this property to `false` for additional resolution in the shadow maps.

You should call `setDepthRenderer` if you already have a depth renderer enabled in your scene, to avoid doing multiple depth rendering each frame. If you provide your own depth renderer, make sure it stores **linear depth**!

Note that you can also call `setMinMaxDistance()` yourself (values between 0 and 1 for min and max), if you know the minimal and maximal z values by some custom means.

### Filtering

The filtering capabilities are the same than for the standard `ShadowGenerator` (except that only PCF and PCSS are supported), so we won't delve into the details here, just refer to [this page](/features/start/chap7/shadows).

### penumbraDarkness (default: 1)

When using the PCSS filtering method, you can change the 'darkness' of the soft shadows by updating this property:
```javascript
csmShadowGenerator.penumbraDarkness = 0.7;
```

**Figure 11. Value of 0.7 on the left, 0.17 on the right**
![penumbraDarkness](/img/babylon101/csm/penumbra-darkness.jpg)

## Culling

There's currently no culling applied on the shadow caster list before rendering the meshes into each of the cascade shadow maps.

However, you can implement your own culling strategy by using this code as a basis:
```typescript
let rtt = csmShadowGenerator.getShadowMap();

rtt.getCustomRenderList = (layer, renderList, renderListLength) => {
    let meshList = [];
    // here do the culling for the cascade with index 'layer' by using the
    // getCascadeViewMatrix(layer), getCSMTransformMatrix(layer), getCascadeMinExtents(layer), etc
    // from csmShadowGenerator
    // note: the renderList entry parameter is the list of all shadow casters defined for the CSM generator,
    // that is csmShadowGenerator.getShadowMap().renderList. If you need to traverse renderList, use
    // renderListLength for the length, not renderList.length, as the array may hold dummy elements!
    return meshList;
};
```

`getCustomRenderList` is called by `RenderTargetTexture` each time it must render a mesh list into a cascade. If you return a regular array of meshes, this array will be used for the rendering into the cascade `layer`. If you return `null`, the `RenderTargetTexture` will proceed with the regular mesh list (that is, the `RenderTargetTexture.renderList` property, in CSM case it is the list of shadow casters).

## Using the `CascadedShadowGenerator` class

## Camera far plane

Perhaps the most important parameter to set is the camera `maxZ` property! Indeed, the CSM technique works by splitting the camera range (`camera.maxZ - camera.minZ`) into cascades, so if the value is not set properly you will get bad shadows.

In the Playground samples, the camera `maxZ` value is generally not explicitly set and so ends up with a value of `10000`, which is too large for most of the cases. See:

**Figure 12. Standard shadows and CSM shadows on PG example**
![CSM and bad camera range](/img/babylon101/csm/bad-camera-maxz.jpg)

It's the very first sample linked in the [Shadow](/features/start/chap7/shadows) page (left part of the picture) where `ShadowGenerator` has simply been changed to `CascadedShadowGenerator` (right part of the picture). As you can see, the shadows on the right are very bad because the `camera.maxZ` value is not set and so is equal to `10000`.

Now, if we set `camera.maxZ` to `200`:

**Figure 13. Same sample with CSM and good camera.maxZ**
![CSM and good camera range](/img/babylon101/csm/good-camera-maxz.jpg)

Much better!

Here's the updated PG: <Playground id="#IIZ9UU#36" title="Cascaded Shadow Map Example 2" description="Simple Example of using the CSM system in your scene." image="/img/playgroundsAndNMEs/features/divingDeeperCSM2.jpg"/>

## Changing the camera near / far planes

The generator must recalculate the frustum splits when a number of parameters change: `lambda`, `shadowMaxZ`,  `min`/`max` distance properties. It is done automatically by the generator.

However, the splits must also be recomputed if the camera near and/or far planes are changed manually! If you do change the `camera.minZ` and/or `camera.maxZ` values after the generator is created, you must call `CascadedShadowGenerator.splitFrustum()` to trigger a recalculation.

Here's what happens if you change `camera.maxZ` after the generator is created without calling `splitFrustum()`:

**Figure 14. Failing calling `splitFrustum`**
![Fail calling splitFrustum](/img/babylon101/csm/splitfrustum_nok.jpg)

PG: <Playground id="#IIZ9UU#41" title="Failing to Call SplitFrustum" description="Failing to call splitFrustum." image="/img/playgroundsAndNMEs/features/divingDeeperCSM3.jpg"/>


**Figure 15. `splitFrustum` called**
![splitFrustum called](/img/babylon101/csm/splitfrustum_ok.jpg)

PG: <Playground id="#IIZ9UU#37" title="Calling SplitFrustum" description="Successfully calling splitFrustum." image="/img/playgroundsAndNMEs/features/divingDeeperCSM4.jpg"/>

## Optimizing for speed

If you don't use `shadowMaxZ` (general case, as you normally want your shadows to cover all the camera view area), set it equal to `camera.maxZ`: in that case, some code is removed from the fragment shader, speeding things up a little.

Use smaller values for `cascadeBlendPercentage`. If you can afford it, use a `0` value for this property (best performances as some code is entirely removed from the fragment shader). Else, use the smallest possible value, as the larger value the more additional computation / texture lookups is performed in the shader, as the system must compute the shadow value for the next cascade before blending it with the value for the current cascade.

If using `autoCalcDepthBounds = true`, you can lower the frequency with which the min/max computation is performed by raising the value of `autoCalcDepthBoundsRefreshRate`, but be aware of the rendering artifacts that may show up because of this.

If your shadow casters and receivers don't move, set `freezeShadowCastersBoundingInfo = true`. Even if some of them do move, as long as the whole bounding box does not change, it is safe to set `freezeShadowCastersBoundingInfo` to `true`.

Set `depthClamp = false`. There is a (very) small GPU penality to enable this property because of a few additional instructions in the depth rendering shaders.

## Optimizing for quality

Best shadow quality is generally achieved by:
* tightening as much as possible the `camera.maxZ - camera.minZ` range
* setting the `camera.minZ` value as high as possible
* using the maximum number of cascades (4)
* using the highest possible map size
* setting `autoCalcDepthBounds = true` with `lambda = 1`
* setting `depthClamp = true`
* setting `stabilizeCascades = false` will improve shadow resolution but you may experience some "swimming" at the shadow edges when rotation the camera. It's up to you to decide which is better for you, stabilized or improved shadows. As explained above, however, always use `stabilizeCascades = false` if `autoCalcDepthBounds = true` because stabilization is not possible in that case, anyway.
* setting `filteringQuality` to high

**Figure 16. Comparing quality**
![High quality](/img/babylon101/csm/high-quality.jpg)

On the left:
* cascades stabilized
* `autoCalcDepthBounds = false`
* lambda = 0.7
* shadow map sizes 1024x1024
* `depthClamp = false`
* filtering is PCF medium

On the right:
* cascades not stabilized
* `autoCalcDepthBounds = true`
* lambda = 1
* shadow map sizes 2048x2048
* `depthClamp = true`
* filtering is PCF high

For comparison sake, here is the same part rendered with the standard `ShadowGenerator` (far right, map size is 2048x2048):

**Figure 17. Comparing with standard `ShadowGenerator`**
![Comparison](/img/babylon101/csm/comparison-with-standard.jpg)

## References

Microsoft [Cascaded Shadow Maps](https://docs.microsoft.com/en-us/windows/win32/dxtecharts/cascaded-shadow-maps) DirectX Sample

[A sampling of Shadow Techniques](https://mynameismjp.wordpress.com/2013/09/10/shadow-maps/) by MJP

[Sample Distribution Shadow Maps](https://software.intel.com/en-us/articles/sample-distribution-shadow-maps) by Andrew Lauritzen (Intel), Kohei, Komono, Aaron Lefohn (Intel)