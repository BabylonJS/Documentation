---
title: Fluid Rendering Demos
image: 
description: Learn how to use the fluid renderer component to display particle systems as a fluid
keywords: diving deeper, particles, fluid rendering, demo
further-reading:
video-overview:
video-content:
---

## Particle system

PG: <Playground id="#544N0Q#23" title="Particle system" description="Example of a particle system rendered as a fluid"/>

This example shows how a standard particle system can be rendered as a fluid.

To enable fluid rendering of a particle system, simply do:

```javascript
const fluidRenderer = scene.enableFluidRenderer() ;
fluidRenderer.addParticleSystem(particleSystem);
```

| particle system | The same particle system rendered as fluid |
|-----------------|-----------------------------------|
|![image](/img/features/fluidrenderer/demo_psys.jpg!488)|![image](/img/features/fluidrenderer/demo_psys_fluid.jpg!488)|

If you use the **Generate Diffuse Texture** parameter:

![image](/img/features/fluidrenderer/demo_psys_wdiffuse.jpg)

With the generated diffuse texture being:

![image](/img/features/fluidrenderer/demo_psys_diffuse.jpg)

## Particle custom shape

PG: <Playground id="#XMXDAA#112" title="Particle custom shape" description="Example of a custom particle system rendered as a fluid"/>

Note: It may take a little while to load, please be patient.

This demo shows how to use `fluidRenderer.addCustomParticles()` to render the famous Dude as a list of particles and have the particles break down using a simple simulation (NOT a fluid simulation!).

Click the **Start** button to make the particles fall apart.

The particles are generated using the `PointsCloudSystem` class, which is also capable of generating vertex colors, so the **Generate diffuse texture** function is enabled by default in this demo.

Starting position:

![image](/img/features/fluidrenderer/demo_dude_start.jpg)

Image towards the end of the demo :

![image](/img/features/fluidrenderer/demo_dude_end.jpg)

## Pre-computed particles - rendering only

PG: <Playground id="#XMXDAA#113" title="Precomputed particles" description="Example of a pre-computed animation of particles rendered as a fluid"/>

This demo shows a precomputed animation of about 70000 particles. The precomputed particle positions come from https://github.com/ttnghia/RealTimeFluidRendering/releases/tag/Datasets (**SphereDropGround** dataset).

Note:
* the position files have been optimized to be smaller and have been compressed into a single zip file. As such, the quality is not the best you can get because of the quantization used to make the files smaller (especially visible at the end of the animation, when the liquid does not fluctuate much). However, it does allow the demo to load very quickly.
* if you want to get the best quality, search for `_readZipped` and set it to `false`.

![image](/img/features/fluidrenderer/demo_precomputed.jpg)

## Box, sphere and wall

PG: <Playground id="#XMXDAA#114" title="Box, sphere and wall" description="Example of real fluid simulation with dragging box and sphere"/>

This demo is the first to use a basic fluid simulator to simulate fluid movement (see the `FluidSimulator` class in the PG). Since the simulation is run in javascript, only a few thousand particles (at most, it depends on the power of your computer) can be simulated, hence the relatively large size of these particles.

The wall and the sphere can be moved with the mouse. You can also rotate the box using the cursor keys (click on the screen first to focus on the scene!) You can also play with the **Check box bounds** and **Auto rotate box** settings.

![image](/img/features/fluidrenderer/demo_box_1.jpg)

**Check box bounds** not checked:

![image](/img/features/fluidrenderer/demo_box_2.jpg)

## Height map

PG: <Playground id="#XMXDAA#115" title="Height map" description="Example of real fluid simulation with a height map"/>

Note: the terrain may take a little time to load, please be patient.

This demo demonstrates the use of a height map as a collision object, in addition to the wall and sphere from the previous demo (you can only drag the wall in this demo, the sphere is moved automatically).

![image](/img/features/fluidrenderer/demo_heightmap_1.jpg)

Instead of a basic water jet, you can inject particles according to some predefined shapes:

![image](/img/features/fluidrenderer/demo_heightmap_2.jpg)

Notes:
* these shapes were generated offline using [SPlisHSPlasH Volume Sampler](https://splishsplash.readthedocs.io/en/latest/VolumeSampling.html)
* the typical command line (used to generate *Dragon 0.04*): `.\VolumeSampling.exe -i .\Dragon_50k.obj -o Dragon_50k.vtk --viscosity 0.05 -r 0.04 -s "2.5 2.5 2.5"`
* Then, [ParaView](https://www.paraview.org/) was used to load the .vtk file produced by the above command line and to generate the .txt file that you can find at `https://github.com/Popov72/FluidRendering/tree/main/src/assets/particles`. For example: [Dragon 0.04](https://github.com/Popov72/FluidRendering/blob/main/src/assets/particles/dragon_04.txt)

The values 0.03 / 0.04 in the names are the particle sizes used to generate the shapes. The smaller the value, the more particles the object has. For example, *Dragon 0.04* has 4507 particles, but *Dragon 0.03* has 10625. Even on a fast computer, you probably won't be able to run at 60fps using the 0.03 flavors...

![image](/img/features/fluidrenderer/demo_heightmap_3.jpg)

![image](/img/features/fluidrenderer/demo_heightmap_4.jpg)

## Glass

PG: <Playground id="#XMXDAA#116" title="Glass" description="Example of real fluid simulation of wine filling a glass"/>

Note: may take a little while to load, please be patient.

Nothing really new in this demo except that it uses a cut hollow sphere (both for rendering and collision) for the top end of the glass (you can move the glass by dragging the top end).

![image](/img/features/fluidrenderer/demo_glass_1.jpg)

![image](/img/features/fluidrenderer/demo_glass_2.jpg)

## Mesh SDF

PG: <Playground id="#XMXDAA#165" image="/img/playgroundsAndNMEs/pg-XMXDAA-117.png" title="Mesh SDF" description="Example of real fluid simulation collision with mesh SDF"/>

Note: It may take a while to load, please be patient. Also, you must set `scene.useRightHandedSystem = true` for this demo to work (as of Babylon v6.49.0, due to changes made in https://github.com/BabylonJS/Babylon.js/pull/14884).

This one demonstrates the use of a custom mesh as collision object (both meshes can be moved by dragging them with the mouse).

The SDF representation of the mesh is generated offline using [SDFGen](https://github.com/christopherbatty/SDFGen). I have forked my own version to improve the .obj loading code a bit and to provide the binary exe file, so that users do not have to compile the project themselves (Windows only): [forked SDFGen](https://github.com/Popov72/SDFGen).

The **Dragon** and **High heels** SDF files used in the demo are located in the [SDF directory](https://github.com/Popov72/FluidRendering/blob/main/src/assets/sdf/).

![image](/img/features/fluidrenderer/demo_meshsdf_1.jpg)

![image](/img/features/fluidrenderer/demo_meshsdf_2.jpg)

Note: **High heels** model by cebraVFX found on Sketchfab (https://sketchfab.com/3d-models/high-heels-1561c09fc45349d680e48e3e007b64e0)
