---
title: Screen Space Reflections (SSR) Post Process
image: 
description: Learn about the screen space reflection post process in Babylon.js.
keywords: diving deeper, post processes, post process, screen space reflection, reflection, SSR
further-reading: ["https://doc.babylonjs.com/typedoc/classes/babylon.screenspacereflectionpostprocess"]
video-overview:
video-content:
---

<span style={{"color": "red"}}>This post process is deprecated starting with v5.48.0! It is superseded by the [Screen Space Reflections Rendering Pipeline](/features/featuresDeepDive/postProcesses/SSRRenderingPipeline).</span>

## Introduction
Rendering reflections in real time can be done using several methods. Each method has its own pros and cons. For web technologies, two main methods exist:
* **Using a Mirror Texture**:
    * pros: renders perfect reflections on a plane.
    * cons: limited to one reflection direction and complexity grows according to the scene's geometries.
* **Using a SSR post-process**:
    * pros: renders all possible reflections in all directions and complexity only depends on the screen's resolution (as all post-processes).
    * cons: limited to what the camera sees.

As an example, with SSR enabled (look at the water-tank):
![with_ssr](/img/how_to/screenSpaceReflectionsPostProcess/with_ssr.webp)

With SSR disabled:
![with_ssr](/img/how_to/screenSpaceReflectionsPostProcess/without_ssr.webp)

You can find a simple example of the SSR post-process in our playground: 
- <Playground id="#PIZ1GK" title="SSR Post Process Example - Standard material" description="Simple example of the screen space reflection Post Process, with Standard material"/>
- <Playground id="#PIZ1GK#303" title="SSR Post Process Example - PBR material" description="Simple example of the screen space reflection Post Process, with PBR material"/>

## Prerequisite
To render reflections using the SSR post-process, the device must support WebGL 2 or at least the multiple render targets extension for WebGL 1. If not supported, the post-process will just work as a pass-through.

For any reflective geometry in your scene, the post-process must know its "reflectivity" properties. To provide this information, your reflective meshes must contain:
* a **Standard Material**: a specular texture. The specular texture will be used to know how much the object reflects for each pixel.
* a **PBR Material**: a reflectivity texture. The post-process still doesn't support the roughness/metallic properties, for instance, but this will be available in the future. That means the post-process takes the reflectivity texture as-is and doesn't compute any metallic/roughness workflow.

In other words, don't forget to assign a specular texture or a reflectivity texture to your material if you want reflections enabled on it.

```javascript
// For a BABYLON.StandardMaterial
myMaterial.specularTexture = new BABYLON.Texture("textures/specular.png", scene);
```

```javascript
// For a BABYLON.PBRMaterial
myMaterial.reflectivityTexture = new BABYLON.Texture("textures/reflectivity.png", scene);
```

**Note: the SSR post-process is a fairly demanding post-process. It is not intended to work smoothly on low-end devices and requires a powerful enough device.**

## Creating the SSR post-process
Just create an instance of BABYLON.ScreenSpaceReflectionPostProcess:
```javascript
var ssr = new BABYLON.ScreenSpaceReflectionPostProcess(
    "ssr", // The name of the post-process
    scene, // The scene where to add the post-process
    1.0, // The ratio of the post-process
    camera // To camera to attach the post-process
); 
```

## Customizing

## Strength
The strength is applied to the overall specular/reflectivity information in the scene and can be customized. The default value for the strength is 1.0 and should be changed only if you are looking for a particular result, because the result will not be realistic.

```javascript
// Double specular/reflectivity strength.
ssr.strength = 2;
```

Example playground: <Playground id="#PIZ1GK#3" title="SSR Reflective Strength Example" description="Simple example of the reflective strength of the screen space reflection post process."/>

## Falloff Exponent
The falloff exponent is used to linearly reduce the reflection's intensities. The default value is "3.0" and works for most cases.

```javascript
// Reduce more the reflection's intensities
ssr.reflectionSpecularFalloffExponent = 4;
```

Example playground with an almost equal to 0 exponent: <Playground id="#PIZ1GK#2" title="SSR Falloff Example" description="Simple example falloff in the screen space reflection post process."/>

## Quality
The reflection quality can be customized to save performance and should be adjusted for each scene type. 

The post-process is based on ray-tracing algorithms. That means the more samples the post-process takes, the better the result looks.

The quality is defined as:
* Low: 25 samples.
* Medium: 50 samples.
* High: 100 samples.

Depending on the scene, the difference between medium and high quality may not be noticeable, because the ray-tracing algorithm stops once it finds the reflection color. In other words, high quality will not always be needed.

- High quality playground: <Playground id="#PIZ1GK#7" title="High Quality SSR Example" description="Example of high quality screen space reflections."/>
- Medium quality playground: <Playground id="#PIZ1GK#5" title="Medium Quality SSR Example" description="Example of medium quality screen space reflections."/>
- Low quality playground: <Playground id="#PIZ1GK#6" title="Low Quality SSR Example" description="Example of low quality screen space reflections."/>