---
title: Volumetric Light Scattering Post Process
image:
description: Learn how to utilize a Babylon.js post process to simulate light scattering.
keywords: diving deeper, lights, lighting, light scattering, post process
further-reading:
video-overview:
video-content:
---

## The Volumetric LightScattering post-process

BABYLON.VolumetricLightScatteringPostProcess is a post-process that will compute the light scattering according to a light source mesh.

### How to use it? Easy!

```javascript
const vls = new BABYLON.VolumetricLightScatteringPostProcess("vls", 1.0, camera, lightSourceMesh, samplesNum, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
```

**_ Parameters _**

- name \{string\} - The post-process name.
- ratio \{any\} - The size of the post-process and/or internal pass (0.5 means that your postprocess will have a _width = canvas.width \* 0.5_ and a _height = canvas.height \* 0.5_.)
- camera \{BABYLON.Camera\} - The camera that the post-process will be attached to.
- lightSourceMesh \{BABYLON.Mesh\} - The mesh used as a light source, to create the light scattering effect (for example, a billboard with its texture simulating the sun.)
- samplesNum \{number\} - The post-process quality. Default is 100.
- samplingMode \{number\} - The post-process filtering mode.
- engine \{BABYLON.Engine\} - The Babylon engine.
- reusable \{boolean\} - If the post-process is reusable.
- scene \{BABYLON.Scene\} - If the _camera_ parameter is null (adding the post-process in a rendering pipeline), the _scene_ is needed to configure the internal pass.

The lightSourceMesh is a mesh that will contain the light color, typically a billboard with a diffuse texture. If your light source is coming from the floor, you can use the floor/ground mesh to compute the light scattering effect.

**Note: The light source mesh can be null. This causes a default lightSourceMesh to be created for you as a billboard **

To create the default mesh before the post-process, there is a static method that returns a billboard as the default:

```javascript
const defaultMesh = BABYLON.VolumetricLightScatteringPostProcess.CreateDefaultMesh("meshName", scene);
```

You can access and modify the mesh using:

```javascript
const mesh = vls.mesh;
```

By default, the post-process is computing the light scattering using the internal mesh position. You can modify and set a custom position using (typically for the floor as the internal mesh):

```javascript
vls.useCustomMeshPosition = true;
vls.setCustomMeshPosition(new BABYLON.Vector3(5.0, 0.0, 5.0));
```

**Warning: If the custom light position is too far from the light source, the result will be distorted.**

You can access the custom position using:

```javascript
const position = vls.getCustomMeshPosition();
```

To customize the light scattering, you can modify the vertical direction of the light rays. If _invert_ is set to true, the rays will go downward. Upward, if invert is set false.

```javascript
vls.invert = true;
```

To optimize performance, you can customize the rendering quality. In fact, this post-process uses an internal pass (render target texture) that will help the post-process to compute the light scattering effect. Of course, you can compute the pass in a lower ratio like:

```javascript
const vls = new BABYLON.VolumetricLightScatteringPostProcess("vls", { postProcessRatio: 1.0, passRatio: 0.5 }, camera, lightSourceMesh, 75, BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, false);
```

vls.useDiffuseColor is used to force rendering the diffuse color of the light source mesh instead of its diffuse texture.

- If useDiffuseColor is true or material.diffuseTexture is undefined, use the diffuse color

- If useDiffuseColor is false and material.diffuseTexture is not undefined, use diffuse texture

- If useDiffuseColor is false and material.diffuseTexture is undefined, use diffuse color

Using the material.diffuseColor instead of material.diffuseTexture (as default) for the light's color:

```javascript
vls.useDiffuseColor = true; // False as default
vls.mesh.material.diffuseColor = new BABYLON.Color3(0.0, 1.0, 0.0);
```

Using the material.diffuseTexture for the light's color:

```javascript
vls.useDiffuseColor = false; // False as default
vls.mesh.material.diffuseTexture= new BABYLON.Texture(...);
```

### And now, it's time to play

Feel free to tour some examples of Volumetric LightScattering in the playground :

- <Playground id="#AU5641" title="Basic Example" description="Simple example of adding a basic light scattering post process to your scene." image="/img/playgroundsAndNMEs/divingDeeperVolumetricLightScatterPP1.jpg"/>
- <Playground id="#HYFQJ" title="Spherical Harmonics as Source" description="Simple example of adding a light scattering post process with spherical harmonics as a source." image="/img/playgroundsAndNMEs/divingDeeperVolumetricLightScatterPP2.jpg"/>
- <Playground id="#UUXLX#37" title="VLS through CSG-created slots" description="Simple example of adding a light scattering post process through CSG-created slots." image="/img/playgroundsAndNMEs/divingDeeperVolumetricLightScatterPP3.jpg"/>

Have fun !

## The Volumetric Lighting Task

Starting with Babylon 9.0, you can use a new volumetric lighting effect, but it is only available with frame graphs: the [FrameGraphVolumetricLightingTask](/features/featuresDeepDive/frameGraph/frameGraphClassFramework/frameGraphTaskList#framegraphvolumetriclightingtask).

The implementation is based on the article “Participating media using extruded light volumes” that you can find in [GPU Zen 1](https://www.amazon.com/GPU-Zen-Advanced-Rendering-Techniques/dp/0998822892). You can also find information in the [GDC slides](https://d29g4g2dyqv443.cloudfront.net/sites/default/files/akamai/gameworks/downloads/papers/NVVL/Fast_Flexible_Physically-Based_Volumetric_Light_Scattering.pdf).

The `FrameGraphVolumetricLightingTask` task renders a mesh using the technique described in the links above. In general, you will want this mesh to represent the volume that a light can reach in your scene: use the [FrameGraphLightingVolumeTask](/features/featuresDeepDive/frameGraph/frameGraphClassFramework/frameGraphTaskList#framegraphlightingvolumetask) to generate such a mesh:

```typescript
// Create first a shadowGeneratorTask and a renderTask instance [...]
// Then
const lightingVolumeTask = new BABYLON.FrameGraphLightingVolumeTask("lightingVolume", frameGraph);

lightingVolumeTask.shadowGenerator = shadowGeneratorTask;

const lightVolume = lightingVolumeTask.lightingVolume;

lightVolume.frequency = isWebGPU ? 1 : 4;
lightVolume.tesselation = isWebGPU ? 1024 : 256;

frameGraph.addTask(lightingVolumeTask);

const volumetricLightingTask = new BABYLON.FrameGraphVolumetricLightingTask("volumetricLighting", frameGraph, true /*enableExtinction*/);

volumetricLightingTask.targetTexture = renderTask.outputTexture;
volumetricLightingTask.depthTexture = renderTask.outputDepthTexture;
volumetricLightingTask.camera = camera;
volumetricLightingTask.lightingVolumeMesh = lightingVolumeTask.outputMeshLightingVolume;
volumetricLightingTask.light = light;
volumetricLightingTask.lightPower = new BABYLON.Color3(0.8, 0.8, 0.8);
volumetricLightingTask.extinction = new BABYLON.Vector3(0.01, 0.01, 0.03);
volumetricLightingTask.phaseG = 0.05;

frameGraph.addTask(volumetricLightingTask);
```

This effect works best in WebGPU because we can use a compute shader to update the lighting volume, whereas in WebGL, we have to read back the shadow map texture and update the volume on the CPU side.

That's why you can see in the code above that we reduce the **frequency** of volume updates when using WebGL (4 means we update every 4 frames) and use a lower **tessellation** value (i.e., fewer triangles) for the mesh to improve performance.

Please refer to the [FrameGraphVolumetricLightingTask](/features/featuresDeepDive/frameGraph/frameGraphClassFramework/frameGraphTaskList#framegraphvolumetriclightingtask) page for detailed information on task parameters and PG examples.

<Playground engine="webgpu" id="#WLGEJB#4" image="/img/playgroundsAndNMEs/pg-WLGEJB-3.png" title="Volumetric lighting task" description="Example of a frame graph using the volumetric lighting task"/>
