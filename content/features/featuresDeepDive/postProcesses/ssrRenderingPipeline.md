---
title: Screen Space Reflections (SSR) Rendering Pipeline
image: 
description: Learn about the screen space reflection rendering pipeline in Babylon.js.
keywords: diving deeper, post processes, post process, screen space reflection, reflection, SSR
further-reading: ["https://doc.babylonjs.com/typedoc/classes/babylon.ssrrenderingpipeline"]
video-overview:
video-content:
---

This rendering pipeline is new in Babylon.js 5.51.0 and supercedes the [Screen Space Reflections Post Process](/features/featuresDeepDive/postProcesses/screenSpaceReflectionsPostProcess). It is a more efficient and robust way to render screen space reflections.

## Introduction
Rendering reflections in real-time can be done using several methods. Each method contains its own pros and cons. For Web technologies, 2 main methods exist:
* **Using a Mirror Texture**:
    * pros: renders perfect reflections on a plane.
    * cons: limited to one reflection direction and complexity grows according to the scene's geometries.
* **Using a SSR post-process**:
    * pros: renders all possible reflections in all directions and complexity only depends on the screen's resolution (as all post-processes).
    * cons: limited to what the camera sees.

Ray tracing is also now used in some games to render reflections. However, it is not yet available in Web technologies.

Here's a comparison of rendering with and without the SSR rendering pipeline enabled:
| With SSR | Without SSR |
| --- | --- |
| ![With SSR](/img/how_to/ssrRenderingPipeline/intro_with_ssr.jpg!500) | ![Without SSR](/img/how_to/ssrRenderingPipeline/intro_without_ssr.jpg!500) |
| ![With SSR](/img/how_to/ssrRenderingPipeline/intro_with_ssr_balls.jpg!500) | ![Without SSR](/img/how_to/ssrRenderingPipeline/intro_without_ssr_balls.jpg!500) |

Here are the playgrounds that generated the above images:
* <Playground id="#PIZ1GK#1017" title="SSR Rendering Pipeline Example (Hill Valley)" description="Hill Valley scene with screen space reflections"/>
* <Playground id="#PIZ1GK#1002" title="SSR Rendering Pipeline Example (Balls)" description="Mirror and Balls scene with screen space reflections"/>

## Prerequisite
To render reflections using the SSR rendering pipeline, the device must support WebGL 2 or WebGPU. If not supported, the rendering pipeline will just work as a pass-through.

For any reflecting geometry in your scene, the SSR pipeline must know what are its "reflectivity" properties. To provide these informations, your reflecting meshes must contain for:
* a **Standard Material**: a specular color (`material.specularColor`), and optionally a specular texture (`material.specularTexture`). Those will be used to know how much the object reflects for each pixel. **Important**: by default, the specular color of a standard material is `(1,1,1)`, so the material is fully reflective! If you don't want your material to be reflective at all, set a specular color of `(0,0,0)`.
* a **PBR Material**: the `metallic` property and optionally a `reflectivityTexture` for the metallic/roughness workflow, and the `reflectivityColor` property and optionally a `reflectivityTexture` for the specular/glossiness workflow. The roughness property (in the metallic/roughness workflow) or the micro-surface property (in the specular/glossiness workflow) will also be used to blur the reflection (see below for more details).

In the PBR case, the reflective color is never black, there's always some reflections going on, which means the SSR effect will be applied for all pixels of the screen! It can be performance intensive for no benefit, because when the reflective color is low you generally won't see any difference when SSR is applied or not (also depending on the roughness property). That's why the SSR pipeline provides a `reflectivityThreshold` property, which will disable the effect for pixels where the reflective color is equal or below a certain threshold. The default value is `0.04`, which is the default reflective color you get when `metallic = 0`.

**Important**: only the standard and PBR materials are supported by the SSR effect!

## Creating the SSR rendering pipeline
Just create an instance of `BABYLON.SSRRenderingPipeline`:
```javascript
const ssr = new BABYLON.SSRRenderingPipeline(
    "ssr", // The name of the pipeline
    scene, // The scene the pipeline belongs to
    [scene.activeCamera], // The list of cameras to attach the pipeline to
    false, // Whether or not to force using the geometry buffer renderer (default: false, use the pre-pass renderer)
    BABYLON.Constants.TEXTURETYPE_UNSIGNED_BYTE // The type of the texture used by the SSR effect (default: TEXTURETYPE_UNSIGNED_BYTE)
); 
```

You can easily enable/disable the SSR effect by setting the `isEnabled` property of the pipeline.

## How SSR is working

A basic understanding of the algorithm will help you understand how to configure the SSR rendering pipeline to get the best results.

The algorithm is based on the following steps:
1. Render the scene in multiple render targets, using either the geometry buffer or the pre-pass renderer. We need to generate the normal, depth and reflectivity buffers.
1. For each pixel of the screen, if it is reflective:
    1. Compute the reflection vector of the camera-to-pixel direction and trace a ray from the pixel's position in this direction. To compute the reflection vector, we need the normal at this pixel, that's why we need to generate this buffer. Also, this computation happens in camera space (3D space), so we need to convert the 2D pixel coordinates to 3D (thanks to the depth buffer).
    1. If the ray hits an object, we get the color of this object from the color texture. 
    1. If the ray doesn't hit anything:
        1. we use the color from `SSRRenderingPipeline.environmentTexture` as the hit color if a texture is provided.
        1. we just use the pixel's color if no environment texture is provided.
    1. If blur is not enabled, we mix the hit color with the pixel color to generate the final color. The mixing is done using the reflectivity of the object at this pixel. The hit computation is done by marching the ray (meaning we advance the ray step by step and compute a new 3D point at each step) in screen space, using the depth buffer to know if the ray has hit an object or not. This way, we can compute the hit position in (3D) camera space but progress in 2D space so we don't spend resources in iterations that would project the current ray point to the same pixel than the previous iteration.
    1. If blur is enabled, we simply store the SSR effect and not the final pixel (mixed) color. We will blur the SSR effect in an additional pass (see next step)
1. If blur is enabled, we blur (two passes blur - horizontal and vertical) the result from the SSR pass and merge it with the original scene in a final pass

With relation to some of the SSR pipeline properties:
* In step 2, the `reflectivityThreshold` property is used to know if a pixel is reflective or not.
* In step 2.1:
    * The starting point of the ray is offseted to avoid self-collision intersections and wrong reflections. The `selfCollisionNumSkip` property controls how many iterations to skip at start before considering an intersection as legitimate. A value of 1 works well in most cases, but sometimes you may need to increase it to 2 or 3 to avoid some rendering artifacts.
    * If blur is not enabled, the starting point of the ray is jittered to take into account the roughness of the surface. The strength of the jittering is controled by the `roughnessFactor` property (default: 0.2).
* In step 2.2:
    * The ray is marched in 3D space only up to `maxDistance` (default: 1000) units from the pixel's (3D) position. Note that when frustum clipping is enabled (`clipToFrustum = true`, which is the default), the ray is clipped to the camera frustum, which may reduce the `maxDistance` value for this ray.
    * The ray is marched in 2D space up to `maxSteps` (default: 1000) iterations. The number of pixels we march at each iteration is given by `step` (default: 1). When the `enableSmoothReflections` property is `true`, an additional calculation is performed to compute a more accurate intersection point. This additional step will kick in only if `enableSmoothReflections = true` and `step > 1`, though.
    * The `thickness` property is used to give some thickness to objects during the intersection computation. See below for more explanations about the `thickness` parameter.
* In step 2.5, `roughnessFactor` is used as a global roughness factor applied on all objects. It can help blurring reflections even when the roughness of some surfaces is 0.
* In step 3, `blurDispersionStrength` (default: 0.03) and `blurQuality` (default: 2) are used to control the strength and quality of the blur dispersion effect.

## Debugging your SSR scenes

An important setting of the SSR pipeline is the `debug` property. It can help you understand what's going on in your scene, and we will use it a lot in the following sections.
Simply set it to `true` to enable a special color rendering of the SSR effect:
```javascript
ssr.debug = true;
```

For eg:
| Without debug | With debug |
| --- | --- |
| ![Without debug](/img/how_to/ssrRenderingPipeline/intro_with_ssr.jpg!500) | ![With debug](/img/how_to/ssrRenderingPipeline/intro_with_ssr_debug.jpg!500) |

The meaning of the color are as follow:
    * blue: the ray hit the max distance (we reached `maxDistance`)
    * red: the ray ran out of steps (we reached `maxSteps`)
    * yellow: the ray went off screen. By default, frustum clipping is enabled, so you should not see this color much.
    * green: the ray hit a surface. The brightness of the green color is proportional to the distance between the ray origin and the intersection point: A brighter green means more computation than a darker green. The brightness is directly proportional to the number of steps the main loop had to run to find an intersection (`debug.green = num_steps / maxSteps`): if we did not find an intersection whithin the `maxSteps` limit, a red color is generated instead of a full green.

When possible, you should try to get as few red pixels as possible, as this means we ran all loop iterations before stopping with no intersection found.
You can trade red pixels for blue pixels by increasing the `step` value, which will favor speed over quality, so it's a balance to find depending on your scene and the final result you expect.

## Geometry buffer or Pre-Pass renderer

The SSR rendering pipeline can use either the [Geometry Buffer Renderer](https://doc.babylonjs.com/typedoc/classes/babylon.geometrybufferrenderer) or the [Pre-Pass Renderer](https://doc.babylonjs.com/typedoc/classes/babylon.prepassrenderer) to render the scene. The default is to use the pre-pass renderer, but you can force using the geometry buffer renderer by setting the `forceGeometryBuffer` parameter of the constructor to `true`.

You don't need to concern yourself with the inner details of these renderers, but choosing one or the other can have an impact on the final rendering.

### Using MSAA

You should normally choose the pre-pass renderer because the reflectivity color is computed more accurately than with the geometry buffer renderer, but if you want to use MSAA as the antialiasing method, the geometry buffer renderer may be a better choice. That's because MSAA can lead to artifacts when used with the pre-pass renderer.

Here's an example of a scene using MSAA with the geometry buffer and pre-pass renderer:
| Geometry Buffer | Pre-Pass |
| --- | --- |
| ![Geometry buffer](/img/how_to/ssrRenderingPipeline/msaa_geometry_buffer.jpg!500) | ![Pre-pass](/img/how_to/ssrRenderingPipeline/msaa_pre_pass.jpg!500) |

Look inside the red rectangle to see the artifacts.

It's even worse if you enable automatic thickness computation:
| Geometry Buffer | Pre-Pass |
| --- | --- |
| ![Geometry buffer](/img/how_to/ssrRenderingPipeline/msaa_geometry_buffer_auto_thickness.jpg!500) | ![Pre-pass](/img/how_to/ssrRenderingPipeline/msaa_pre_pass_auto_thickness.jpg!500) |

Note that the artifacts depend on your scene. Try to spot them in the picture in the right:
| Pre-Pass without MSAA | Pre-Pass with MSAA |
| --- | --- |
| ![Pre-Pass without MSAA](/img/how_to/ssrRenderingPipeline/pre_pass_hillvalley.jpg!500) | ![Pre-Pass with MSAA](/img/how_to/ssrRenderingPipeline/msaa_pre_pass_hillvalley.jpg!500) |

Artifacts are hardly visible, so, in this scene, using MSAA could be a valid option.

Instead of MSAA, you can use FXAA if you want antialiasing in the pre-pass renderer case:
| Geometry Buffer with MSAA | Pre-Pass with FXAA |
| --- | --- |
| ![Geometry Buffer with MSAA](/img/how_to/ssrRenderingPipeline/msaa_geometry_buffer_auto_thickness.jpg!500) | ![Pre-Pass with FXAA](/img/how_to/ssrRenderingPipeline/fxaa_pre_pass_auto_thickness.jpg!500) |

Here's the PG used in these examples: <Playground id="#PIZ1GK#1016" title="Comparison of the MRT renderers" description="Comparison when using the geometry buffer or the pre-pass renderer with screen space reflections"/>

### Depth texture type

Also, one thing to note regarding the pre-pass renderer is that by default it's using half-float for the depth texture. It can lead to some rendering artifacts if you compare with the geometry buffer renderer, which is using full float for the depth texture:

| Geometry Buffer | Pre-Pass with half-float depth |
| --- | --- |
| ![Geometry buffer](/img/how_to/ssrRenderingPipeline/geometry_buffer_sphere_debug.jpg!500) | ![Pre-Pass with half-float depth](/img/how_to/ssrRenderingPipeline/pre_pass_sphere_debug.jpg!500) |

You get these artifacts because there's less precision in the depth buffer and consequently you get more self-collisions between the reflected ray and the current surface the ray is shot from (see section 2.1 in [How SSR is working](#how-ssr-is-working)).

You can fix the problem by either using full float precision for the pre-pass renderer:
```javascript
    BABYLON.PrePassRenderer.TextureFormats[BABYLON.Constants.PREPASS_DEPTH_TEXTURE_TYPE].format = BABYLON.Constants.TEXTURETYPE_FLOAT;
```
or by raising `selfCollisionNumSkip`:
```javascript
ssr.selfCollisionNumSkip = 2;
```

## Description of the SSR parameters

In the following sections, we will describe in depth the parameters of the SSR rendering pipeline, as it's not always easy to choose the right values for each parameter, or to know how it impacts the final rendering.

### Thickness

At [step 2.2 of the SSR algorithm](#how-ssr-is-working), we know if the ray has hit an object when:
* the depth of the current point of the ray is farther than the depth of the pixel this point project to (this depth is read from the depth buffer). That means the current point of the ray is "behind" the object that has been rendered in the depth buffer at that location. Note that the depth increases for objects that are farther from the camera.
* the depth of the previous point of the ray is closer than the depth of the pixel this point project to. That means the previous point of the ray is "in front" of the object that has been rendered in the depth buffer at that location

That way, we know we crossed the boundary of the object which is rendered at that pixel location. However, the depth buffer stores only a single depth value for each pixel, so we don't know the thickness of an object, which is needed if we want to compute accurate intersections. The default is to use a constant thickness value, which is set to `0.5` by default. You can change this value by setting the `thickness` property of the SSR rendering pipeline, and this value will depend on the extents of your scene.

| Thickness 0 | Thickness 0.5 |
| --- | --- |
| ![Thickness 0](/img/how_to/ssrRenderingPipeline/balls_thickness_0.jpg!500) | ![Thickness 0.5](/img/how_to/ssrRenderingPipeline/balls_thickness_0_5.jpg!500) |

| Thickness 1 | Thickness 4 |
| --- | --- |
| ![Thickness 1](/img/how_to/ssrRenderingPipeline/balls_thickness_1.jpg!500) | ![Thickness 1](/img/how_to/ssrRenderingPipeline/balls_thickness_4.jpg!500) |

As you can see in the mirror and on the ground, the reflections of the objects do extend but only linearly, the shape of the sphere is not preserved because we use a constant thickness value.

#### Automatic thickness computation

The SSR pipeline also supports a more accurate way to compute the thickness, which is using an additional depth rendering to generate the depth of the back faces. That way, we can compute the thickness as being the difference between the depth value read from this back depth buffer and the one read from the front depth buffer:

| Thickness 1 | Thickness 0 with automatic thickness computation |
| --- | --- |
| ![Thickness 1](/img/how_to/ssrRenderingPipeline/balls_thickness_1.jpg!500) | ![Thickness 0 with automatic thickness computation](/img/how_to/ssrRenderingPipeline/balls_auto_thickness_0.jpg!500) |

You enable this mode by setting the `enableAutomaticThicknessComputation` property of the SSR rendering pipeline to `true`:
```javascript
ssr.enableAutomaticThicknessComputation = true;
```

In this mode, `thickness` is still used as an additional offset, but typically you can use a much lower value, and even 0 does work well in a lot of cases.

However, it is not a magic mode, it won't fix all SSR problems and only a single thickness can be computed that way. Also, it is more taxing on performance as there's an additional rendering of the scene to generate the back depth buffer.
Sometimes, it's better to add a bit of blur to hide the artifacts instead of enabling this mode, it will be lighter on the GPU.

You can lower the GPU requirement of this mode by setting a value greater than 0 for `backfaceDepthTextureDownsample` (1 to divide the size of the texture by 2, 2 to divide it by 3 and so on), which will reduce the size of the depth texture used by the depth renderer. However, it can lead to severe artifacts, so it will still be a trade-off between performance and quality and how you can try to best hide the artifacts.

### Max distance, Max steps, step, smooth reflections and clipToFrustum

`maxDistance`, `maxSteps`, `step` and `enableSmoothReflections` are working somewhat together, and how they impact the final rendering can be understood by reading the [How SSR is working](#how-ssr-is-working) section as well as [Debugging your SSR scenes](#debugging-your-ssr-scenes).

To sum up:
* a ray won't go farther than `maxDistance` (in 3D space)
* a ray won't go farther than `maxSteps` * `step` pixels (in 2D space)
* if `step` is greater than 1, you can enable `enableSmoothReflections` to compute more accurate intersections and improve reflections

`clipToFrustum = true` will clip the ray to the camera frustum and should generally by left `true`, as even if it is adding some shader instructions, it allows to shorten the ray and then the computation.

### Strength of the reflections

strength and reflectionSpecularFalloffExponent

### roughnessFactor, blurDispersionStrength, blurQuality, blurDownsample, ssrDownsample

### selfCollisionNumSkip

### reflectivityThreshold

### environmentTexture

### Effect attenuations

attenuateScreenBorders, attenuateIntersectionDistance, attenuateFacingCamera, attenuateBackfaceReflection

## How to deal with some Artifacts

enable transparent rendering for the back face depth renderer
back faces must exist when using enableAutomaticThicknessComputation
Screen space technique: Works only with geometry rendered on screen => quand on regarde vers le bas, disparition des reflets / pareil sur les bords de l'écran


---
To favor speed over quality, you should try to use:
* big values for `step`
* small values for `maxSteps` and `maxDistance`
* disable `enableSmoothReflections`