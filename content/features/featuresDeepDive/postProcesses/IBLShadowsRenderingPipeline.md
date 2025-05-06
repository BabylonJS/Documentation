---
title: Image-based Lighting Shadows Rendering Pipeline
image:
description: Learn about the IBL shadows rendering pipeline in Babylon.js.
keywords: diving deeper, ibl shadows, shadows, shadowing, IBL
video-overview:
video-content:
---

## Introduction

In real-time rendering, shadows are commonly rendered using [shadow maps](https://doc.babylonjs.com/features/featuresDeepDive/lights/shadows) but these are most practical for punctual lights (i.e. directional, point and spot lights). When it comes to image-based lighting (IBL), generating accurate shadows becomes much more difficult because light is coming from all directions.
The IBL Shadows pipeline does what the name implies; it renders shadows cast by image-based lighting (i.e. [HDR environment lights](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/HDREnvironment)) and allows you to then apply the shadows to PBR and standard materials. It does this by generating a voxel grid for all objects that will cast shadows and then traces rays through the voxel grid to determine which pixels will be shadowed.

Here is a comparison of the rendering with and without the activation of the IBL Shadows pipeline:

| With Shadows | Without Shadows |
| --- | --- |
| ![With Shadows](/img/how_to/iblShadowsRenderingPipeline/intro_with_shadows.jpg) | ![Without Shadows](/img/how_to/iblShadowsRenderingPipeline/intro_without_shadows.jpg) |

Here is the playground that generated the above images:

- <Playground id="#8R5SSE#481" title="IBL Shadows Pipeline Example" description="Boombox scene with IBL shadows" isMain={true} category="Post-processing"/>

## Important Usage Notes

In its current implementation, this technique is only practical for static shadow-casting scenes. i.e. scenes where shadow-casting objects are not animated. This is because moving shadow-casters requires updating the voxel grid and this is too slow for real-time animation (improvements are planned for WebGPU). Moving shadow-receivers, moving the camera and changing the IBL direction, intensity, etc. will work fine.

## Prerequisites

The IBL Shadows Pipeline requires either WebGL 2.0 or WebGPU and, currently, can only be applied to [PBR materials](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/masterPBR) and [Standard materials](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction).

The IBL shadow pipeline relies on the [Geometry Buffer Renderer](https://doc.babylonjs.com/typedoc/classes/babylon.geometrybufferrenderer) so this should be kept in mind if combined with other pipelines. For example, if using the [SSR pipeline](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/SSRRenderingPipeline), make sure you force it to also use the geometry buffer instead of the prepass renderer to save memory.

## Using the IBL shadows rendering pipeline

### Create the Pipeline

Start by creating an instance of `BABYLON.IblShadowsRenderPipeline`:

```javascript
const shadowPipeline = new BABYLON.IblShadowsRenderPipeline(
  "ibl shadows", // The name of the pipeline
  scene, // The scene to which the pipeline belongs
  options, // The options for the pipeline
  [scene.activeCamera], // The list of cameras to attach the pipeline to
);
```

`options` is of type `BABYLON.IblShadowsSettings` which contains many [properties](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/IBLShadowsRenderingPipeline#properties) to control the look of the shadows.

### Configure the Shadows

1. Add shadow-casters. You must explicitly add any mesh that you want to cast shadows to the pipeline with `shadowPipeline.addShadowCastingMesh(mesh | meshes[])`. This will cause them to render to the voxel grid when it is re-rendered. Having control over which meshes cast shadows can be important for several reasons:
   1. It allows you to filter out objects like skyboxes or ground planes that you may not want casting shadows on your scene.
   1. Since the voxel grid's resolution is limited, it allows you to constrain the size of the shadow-casting part of the world to only the most important objects.
   1. Rendering to the voxel grid can be expensive so it might be good to limit the shadow-casting objects. For example, if you have many blades of grass, you may choose to have them receive shadows but not cast them.
1. Add shadow-receivers. You must also explicitly add any material that you want receiving shadows with `shadowPipeline.addShadowReceivingMaterial(material | materials[])`. If you call this function without an argument, it will add all materials in the scene.
1. Update scene bounds. Once you've added all the shadow-casters to the pipeline, call `shadowPipeline.updateSceneBounds()` to recalculate the size of the portion of the scene that the voxel grid will cover.
1. Update the voxel grid. Call `shadowPipeline.updateVoxelization()` to cause the shadow-casters to be rendered into the voxel grid. Once this is done, the shadows should automatically appear in the scene.
1. The IBL used for shadows will be whatever is assigned to `scene.environmentTexture`. This can be either a cubemap or equirectangular environment texture. HDR textures work best.

You can easily enable/disable the shadows by calling the `toggleShadow(enabled: boolean)` method of the pipeline.

## How the IBL Shadows pipeline works

A basic understanding of the algorithm will help you understand how to configure the shadow pipeline for best results.

### When the IBL map changes

When a new IBL texture is assigned to `scene.environmentTexture`, various CDF (cumulative distribution function) maps are generated internally that will be used to importance-sample the IBL during shadow computation. In short, this allows the brightest (i.e. most relevant) areas of the IBL to be sampled more, resulting in more accurate shadows with fewer samples.

### When the scene changes

The voxel grid will need to be regenerated whenever the shadow-casting scene changes so that new or moved shadow-casters will be included in the shadows. The voxel grid is a low-resolution (256^3 or less), 3D texture, that contains all the shadow-casting geometry of the scene.

1. The scene is rendered to the voxel grid, layer by layer, as it's not possible to render to the entire 3D texture at once in WebGL. The voxelization uses the maximum number of draw buffers to render several layers in each render pass. The higher-resolution the voxel grid is, the more passes that will be necessary and the slower the voxelization will be.
1. If `triPlanarVoxelization` is enabled (the default), the voxelization will be done three times, once along each axis. The purpose of this is to avoid missing triangles that are parallel to the camera's line-of-sight. Disabling `triPlanarVoxelization` will speed up voxelization time but can often result in missing geometry.
1. After the voxel grid is generated, the hierarchical mips need to be generated for it. These are successively smaller and smaller textures that are used by the voxel tracing algorithm to efficiently traverse the voxel grid and find ray-geometry intersections, something like an octree.

### Each Frame

Once the CDF maps and voxel grid are created, there are several fullscreen passes that happen every frame to render the shadows. These all happen before your scene is rendered with full materials and lighting.

1. The [Geometry Buffer Renderer](https://doc.babylonjs.com/typedoc/classes/babylon.geometrybufferrenderer) renders the entire scene into several render target textures needed by the shadow pipeline. These include world-space normals, screen-space depth, world-space positions and motion vectors. These targets may also be shared by other pipelines that need them.
1. A "Voxel-tracing" pass will use the CDF maps and voxel grid to produce a shadow value for every pixel.
   1. Several samples of the IBL can be taken (controlled using the `sampleDirections` property). For each sample:
      1. A light direction is generated using the CDF maps. The direction is randomly selected based on the intensity of the light in that direction. i.e. the probability that a particular direction will be chosen is relative to the brightness of the IBL in that direction.
      1. The voxel grid is traversed in this direction to see if it will intersect any geometry. The mips of the voxel grid are key to traversing the grid efficiently.
      1. A screen-space shadow sample (see [below](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/IBLShadowsRenderingPipeline#screen-space-shadows)) is also taken using this light direction and is combined with the voxel sample.
      1. Two shadow values are then generated. The first is the simple accumulation of the shadow amount from each sample. The second is scaled by a view-dependent factor to approximate shadowing of specular lighting from the sampled direction.  
   1. The total shadow contribution of both diffuse shadowing and specular shadowing is divided by the number of samples to get the amount of raw shadowing for this frame. Taking more samples per frame will decrease the noise in the image but is more expensive to compute.
1. A blur pass then blurs the shadows to help remove some of the noise.
1. An accumulation pass will then combine the new shadow frame with shadows generated in previous frames. This has the effect of building up a smooth image of the shadows over several frames. The speed at which this happen can be adjusted using the `shadowRemanence` property.
1. The accumulated shadows are then applied in a mesh's material using Babylon's [material plugin system](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materialPlugins). The diffuse shadows are applied directly to the diffuse component of the material, leaving emissive light unaffected. Specular shadows are applied to specular lighting but this is a bit more complex because the view-dependence of specular lighting depends on the roughness of the surface. We blend between diffuse and specular shadow factors based on the roughness of the surface. Highly smooth surfaces get the specular shadows and rough surfaces (which are essentially non-directional) get the diffuse shadows.

## Screen-space Shadows

Screen-space shadows complement voxel shadows very nicely as they are great for rendering tiny shadow detail, where shadow-casters and shadow-receivers are very close together. As the name suggests, this technique works in screen-space, using the render targets output by the geometry buffer renderer. For each pixel, we trace a ray back to the light, taking samples as we step along the ray. At each step, if the depth of the pixel is less than the depth of the ray, the original pixel is assumed to be shadowed.

| No SS Shadows | With SS Shadows |
| --- | --- |
| ![No SS Shadows](/img/how_to/iblShadowsRenderingPipeline/NoSSS.jpg) | ![SS Shadows](/img/how_to/iblShadowsRenderingPipeline/SSS.jpg) |

## Limitations

1. This technique is currently only practical for static shadow-casters. Voxelization is very slow and needs to be done whenever a shadow-casting object moves or is animated.
2. The resulting shadows are greyscale. That is, they don't account for the colour of light in the IBL.
3. The resolution of the voxel grid can currently only go up to 256x256x256 so the sharpness of shadows in large scenes is limited. This is why we combine screen-space shadows with the voxel-tracing as it handles small geometry details well.
4. Rather than actually blocking light, this technique approximates the percentage of light that will hit the surface and then modulates the light that's already applied, darkening the surface. This can result in over-darkening parts of a surface, particularly surfaces facing away from bright, compact lights (e.g. the Sun) when only 1 or 2 sample directions are used.

| 1 Sample | 4 Samples |
| --- | --- |
|![1-Sample](/img/how_to/iblShadowsRenderingPipeline/1-sample.jpg) | ![4-Samples](/img/how_to/iblShadowsRenderingPipeline/4-samples.jpg) |

Note that the over-bright side of the sphere, facing away from the sun is an artifact of Babylon's use of spherical harmonics for diffuse IBL lighting.

## Properties

The following properties can be set on the pipeline (or passed in the constructor on initialization)

### General Properties

| Property | Description |
| --- | --- |
| shadowOpacity | How dark the shadows are. 1.0 is full opacity, 0.0 is no shadows. |
| sampleDirections | The number of different directions to sample during the voxel-tracing pass. Higher values will result in better quality and more stable shadows but will also be more expensive to compute each frame. Since shadows are accumulated from frame to frame, increasing this value doesn't help much when the camera isn't moving. |
| shadowRemanence | A factor that controls how long the shadows remain in the scene. 0.0 is no persistence, 1.0 is full persistence. This value applies only while the camera is moving. Once stationary, the pipeline increases remanence automatically to help the shadows converge. |
| shadowRenderSizeFactor | A size multiplier for the internal shadow render targets (default 1.0). A value of 1.0 represents full-resolution. Scaling this below 1.0 will result in blurry shadows and potentially more artifacts but it could help increase performance on less powerful GPU's. |

### Voxel Properties

| Property | Description |
| --- | --- |
| resolutionExp | The exponent of the resolution of the voxel shadow grid. Higher resolutions will result in sharper shadows but are more expensive to compute and require more memory. The resolution is calculated as 2 to the power of this number. e.g. a value of 6 results in a voxel grid that is 64x64x64 |
| triPlanarVoxelization | Render the voxel grid from 3 different axis. This will result in better quality shadows with fewer bits of missing geometry. |

### Screen-space Shadow Properties

| Property | Description |
| --- | --- |
| ssShadowsEnabled | Include screen-space shadows in the IBL shadow pipeline. This complements the voxel shadows by adding shadows for small geometry detail close to a shadow-casting object. |
| ssShadowSampleCount | The number of samples used in the screen space shadow pass. |
| ssShadowStride | This controls the distance between samples in pixels. |
| ssShadowDistanceScale | A scale for the maximum distance a screen-space shadow can be cast in world-space. The maximum distance that screen-space shadows cast is derived from the voxel size and this value so shouldn't need to change if you scale your scene. |
| ssShadowThicknessScale | This value controls the assumed thickness of on-screen surfaces in world-space. It scales with the size of the shadow-casting region so shouldn't need to change if you scale your scene. |

## Functions

| Function | Description |
| --- | --- |
| toggleShadow | Turn the shadows on or off |
| updateSceneBounds | Trigger the scene bounds of shadow-casters to be calculated. This is the world size that the voxel grid will cover and will always be a cube. |
| updateVoxelization | Trigger the scene to be re-voxelized. This should be run when any shadow-casters have been added, removed or moved. |
| resetAccumulation | Reset the shadow accumulation. This has a similar affect to lowering the remanence for a single frame. This is useful when making a sudden change to the IBL. |
| addShadowCastingMesh | Add a mesh to be used for shadow-casting in the IBL shadow pipeline. These meshes will be written to the voxel grid. |
| removeShadowCastingMesh | Remove a mesh from the shadow-casting list. The mesh will no longer be written to the voxel grid and will not cast shadows. |
| addShadowReceivingMaterial | Apply the shadows to a material or array of materials. If no material is provided, all materials in the scene will be added. |
| removeShadowReceivingMaterial | Remove a material from the list of materials that receive shadows. If no material is provided, all materials in the scene will be removed. |

## Debugging Shadows

The IBL Shadows Pipeline has a few debug modes to help in diagnosing issues. To enable these, you must first set `allowDebugPasses` to `true`. Once that is enabled, you can toggle the other debug modes on/off. If multiple are enabled at the same time, they will all attempt to display in different parts of the screen.

```javascript
shadowPipeline.allowDebugPasses = true;
```

| Property | Description | Image |
| --- | --- | --- |
| gbufferDebugEnabled | This will display only the targets of the g-buffer that are used by the shadow pipeline. | ![G-Buffer](/img/how_to/iblShadowsRenderingPipeline/gbuffer_debug.jpg) |
| cdfDebugEnabled | This displays the IBL and the CDF maps used for importance sampling. | ![G-Buffer](/img/how_to/iblShadowsRenderingPipeline/ibl_debug.jpg) |
| voxelDebugEnabled | This displays the voxel grid in slices spread across the screen. It also displays what slices of geometry are stored in each layer of the voxel grid. Each stripe represents one layer of the grid and each full gradient (from bright red to black) represents the layers rendered in a single draw call. | ![G-Buffer](/img/how_to/iblShadowsRenderingPipeline/voxel_debug.jpg) |
| voxelDebugAxis | When using tri-planar voxelization (the default), this value can be used to display only the voxelization result for that axis. `0` -> z-axis, `1` -> y-axis, `2` -> x-axis, `undefined` -> all axes combined | ![Y-axis Voxelization](/img/how_to/iblShadowsRenderingPipeline/voxel_y-axis_debug.jpg) |
| voxelDebugDisplayMip | Displays a given mip of the voxel grid. `voxelDebugAxis` must be `undefined` in this case because we only generate mips for the combined voxel grid. | ![Voxel Grid Mip 3](/img/how_to/iblShadowsRenderingPipeline/voxel_mip3_debug.jpg) |
| voxelTracingDebugEnabled | Displays just the shadow samples taken this frame. | ![Voxel Tracing](/img/how_to/iblShadowsRenderingPipeline/voxel_tracing_debug.jpg) |
| spatialBlurPassDebugEnabled | Display the shadow samples taken this frame, spatially blurred.  | ![G-Buffer](/img/how_to/iblShadowsRenderingPipeline/spatial_blur_debug.jpg) |
| accumulationPassDebugEnabled | Display the debug view for the shadows accumulated over time. | ![G-Buffer](/img/how_to/iblShadowsRenderingPipeline/accumulation_debug.jpg) |

## Performance Notes

### Voxelization Performance

Voxelation performance is dependent on voxel resolution, shadow-caster complexity and whether `triPlanarVoxelization` is enabled. WebGPU will generally be faster than WebGL.

### Per-frame Shadow Rendering

Each frame, the time taken to compute shadows is primarily affected by two things.

- `sampleDirections` - The number of sample directions determines the number of voxel traces and the number of screen-space traces done for shadows. These are the primary computations done each frame so lowering this number will help performance.

- `shadowRenderSizeFactor` - Since the shadow computations are done per fragment, lowering the resolution of the shadow buffers can have a significant impact on performance. Try setting `shadowRenderSizeFactor` below 1.0.
