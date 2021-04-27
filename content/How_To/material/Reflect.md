---
title: Reflections and Refractions
image: /img/playgroundsAndNMEs/divingDeeperReflectionRefraction2.jpg
description: Learn all about reflection and refraction in Babylon.js.
keywords: diving deeper, materials, refraction, reflection
further-reading:
    - title: Skyboxes
      url: /divingDeeper/environment/skybox
    - title: Reflection Probes
      url: /divingDeeper/environment/reflectionProbes
    - title: Introduction to Physically Based Rendering 
      url: /divingDeeper/materials/using/introToPBR
video-overview:
video-content:
---

## About environment mapping
Babylon.js uses _environment mapping_ ([wikipedia](https://en.wikipedia.org/wiki/Reflection_mapping)) to simulate reflection (mirror-like materials) and refraction (glass-like materials).

Environment maps are pictures of the world (as seen from some vantage point) which are transformed and applied to meshes to simulate reflection or refraction. These pictures may be single images or composite panoramas, and may be static snapshots or dynamically updated to track scene changes.

Once created (as described below), environment maps may be used in [StandardMaterial](/typedoc/classes/babylon.standardmaterial)'s [.reflectionTexture](/typedoc/classes/babylon.standardmaterial#reflectiontexture) or [.refractionTexture](/typedoc/classes/babylon.standardmaterial#reflectiontexture); environment maps are also used in [Physically Based Rendering](/divingDeeper/materials/using/introToPBR) for sophisticated material surfaces.

## Static environment maps (CubeTexture and friends)
[CubeTexture](/typedoc/classes/babylon.cubetexture) instances use six images to make a static wraparound environment map (or "cubemap"). [The CubeMap constructor](/typedoc/classes/babylon.cubetexture#constructor) takes a base URL and appends "\_px.jpg", "\_nx.jpg", "\_py.jpg", "\_ny.jpg", "\_pz.jpg" and "\_nz.jpg" to load +x, -x, +y, -y, +z, and -z facing sides of the cube.

![Diagram of X/Y/Z axes and CubeTexture sides](/img/how_to/Materials/cubetexture1.png)

([Use the _extensions_ argument](/typedoc/classes/babylon.cubetexture#constructor) to customize these suffixes, e.g. to load .png instead of .jpg images.)

Despite the "Texture" name, CubeTexture can _only_ be used with the [.reflectionTexture](/typedoc/classes/babylon.standardmaterial#reflectiontexture) or [.refractionTexture](/typedoc/classes/babylon.standardmaterial#reflectiontexture) properties of [StandardMaterial](/typedoc/classes/babylon.standardmaterial), _not_ other properties like [.diffuseTexture](/typedoc/classes/babylon.standardmaterial#diffusetexture).

### Skybox cubemaps
[Skybox images](/divingDeeper/environment/skybox) may be used directly as environment maps. (Skyboxes also typically use CubeTexture.) In this case only the skybox will show up in the reflection/refraction, but that may suffice for simple scenes or small surfaces.

This is an example set of skybox images:

<table><tbody><tr>
<td><img src="/img/getstarted/skybox_px.jpg" width="100" height="100" caption="skybox_px.jpg" alt="some clouds"/></td>
<td><img src="/img/getstarted/skybox_nx.jpg" width="100" height="100" caption="skybox_nx.jpg" alt="more clouds"/></td>
<td><img src="/img/getstarted/skybox_py.jpg" width="100" height="100" caption="skybox_py.jpg" alt="the sun overhead"/></td>
<td><img src="/img/getstarted/skybox_ny.jpg" width="100" height="100" caption="skybox_ny.jpg" alt="solid gray"/></td>
<td><img src="/img/getstarted/skybox_pz.jpg" width="100" height="100" caption="skybox_pz.jpg" alt="more clouds"/></td>
<td><img src="/img/getstarted/skybox_nz.jpg" width="100" height="100" caption="skybox_nz.jpg" alt="more clouds"/></td>
</tr></tbody></table><p/>

These examples with only one shape in the scene look perfectly great:

<p><Playground id="#UU7RQ#3" title="Cube Reflecting Skybox" description="A cube reflecting skybox images." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction2.jpg"/>
<Playground id="#UU7RQ#5" title="Ground Reflecting Skybox" description="A ground plane reflecting skybox images." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction3.jpg"/>
<Playground id="#UU7RQ#4" title="Sphere Reflecting Skybox" description="A sphere reflecting skybox images." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction4.jpg"/></p>

After adding another shape, it becomes clear that only the skybox is reflected:

<p><Playground id="#UU7RQ#1590" title="Vampire Cube Isn't Reflected" description="A cube reflecting skybox images but not reflecting a nearby red cube."/></p>

This "vampire effect" can be fixed by carefully adding scene contents to cubemap images, or by using [dynamic maps](#dynamic-environment-maps-rendertargettexture-and-friends).

### Local cubemaps
Environment maps (static or dynamic) are flat images with no depth. By default, they are treated as infinitely far away. This works for distant environments (like skyboxes) or small surfaces, but can cause parallax errors in other cases.

As an alterative, cubemaps can be treated as axis-aligned boxes of specific size and location by setting the cubemap instance's [.boundingBoxSize](/typedoc/classes/babylon.cubetexture#boundingboxsize) and [.boundingBoxPosition](/typedoc/classes/babylon.cubetexture#boundingboxposition) to the desired box size and position (as [Vector3](/typedoc/classes/babylon.vector3)).

<p><Playground id="#RNASML#37" title="Local cubemap demo" description="Demonstraction of the effect of local cubemap projection." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction5.jpg"/></p>

(Local cubemaps must use the default CUBIC\_MODE [coordinate mode](#coordinate-modes).)

Of course, an axis-aligned box is still an approximation of true reflected/refracted scene geometry, but it may be a useful approximation. See "[Reflections Based on Local Cubemaps](https://community.arm.com/graphics/b/blog/posts/reflections-based-on-local-cubemaps-in-unity)" (from the ARM Developer's Graphics and Gaming Blog) for a good write-up of the concept as used in Unity (Babylon.js's implementation is similar).

### EquiRectangularCubeTexture
Equirectangular panoramic images ([panotools wiki](https://wiki.panotools.org/Equirectangular_Projection)) squish a spherical panorama into one image (unlike the six sides needed for ordinary CubeTexture).

<p><img caption="An equirectangular panorama image, flattened out" alt="A warped view of a dock with boats" src="https://playground.babylonjs.com/textures/equirectangular.jpg"/></p>

[EquiRectangularCubeTexture](/typedoc/classes/babylon.equirectangularcubetexture) instances load an equirectangular panorama image into a CubeTexture-compatible environment map.

<Playground id="#RY8LDL" title="Spheres Reflecting Equirectangular Skybox" description="Reflections and refractions of an equirectangular skybox panorama." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction9.jpg"/>

### HDRCubeTexture
High Dynamic Range ([wikipedia](https://en.wikipedia.org/wiki/High-dynamic-range_imaging)) images capture brighter and dimmer colors than a typical monitor can display. This can be useful for environment mapping even if the final output uses standard dynamic range.

<p><img caption="A panoramic HDR image, flattened and reduced to SDR" alt="A warped view of a room with lamps" src="/img/how_to/Materials/room.jpg"/></p>

[HDRCubeTexture](/typedoc/classes/babylon.hdrcubetexture) instances (Babylon.js v3.2+) loads a Radiance RGBE format ([wikipedia](https://en.wikipedia.org/wiki/RGBE_image_format)) HDR equirectangular panorama image into a CubeTexture-compatible environment map.

<Playground id="#114YPX#5" title="HDR Skybox" description="An HDR equirectangular skybox panorama." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction6.jpg"/>

### Flat textures as environment maps

Wraparound cubemaps work well for environment mapping, but ordinary flat Texture instances can be used for [.reflectionTexture](/typedoc/classes/babylon.standardmaterial#reflectiontexture) and [.refractionTexture](/typedoc/classes/babylon.standardmaterial#reflectiontexture) as well. The texture's .coordinatesMode must be set to define how the flat image should be "wrapped around" as an environment ([see "Coordinate Modes"](#coordinate-modes)).

<p><img src="/img/how_to/Materials/mona_lisa_head.jpg" width="200" height="200" caption="A reference texture image" alt="Mona Lisa's head"/></p>

This example shows Mona Lisa reflected in a sphere, using PLANAR\_MODE:

<p><Playground id="#UU7RQ#1629" title="Mona Lisa in SPAAAACE" description="A sphere reflecting a flat Mona Lisa texture." image="/img/playgroundsAndNMEs/pg-UU7RQ-1627.png"/></p>

(Note, cubemaps are normally preferred for environment mapping instead of flat textures.)

## Dynamic environment maps (RenderTargetTexture and friends)
[RenderTargetTexture](/typedoc/classes/babylon.rendertargettexture) instances hold environment maps updated during scene rendering, allowing reflections and refractions to track the scene in real time (unlike the [static maps](#static-environment-maps-cubetexture-and-friends) described above).

RenderTargetTexture instances are usually created through classes like ReflectionProbe or MirrorTexture, which manage the dynamic update process.

### ReflectionProbe
Each [ReflectionProbe](/typedoc/classes/babylon.reflectionprobe) instance provides a cubemap (in [.cubeTexture](/typedoc/classes/babylon.reflectionprobe#cubetexture)) that is dynamically rendered from a specified point in the scene, typically at or near a reflective object that will use the cubemap.

<p><Playground id="#KA93U#243" title="Reflection Probes" description="Moving shapes reflecting each other and the ground using reflection probes." image="/img/playgroundsAndNMEs/divingDeeperReflectionProbes1.jpg"/></p>

You must set each ReflectionProbe's [.renderList](/typedoc/classes/babylon.reflectionprobe#renderlist) to an explicit list of meshes to render. Be mindful of efficiency as each probe renders six times (once for each cube face) for every update. See the [Reflection Probes main page](/divingDeeper/environment/reflectionProbes) for more details.

### MirrorTexture
[MirrorTexture](/typedoc/classes/babylon.mirrortexture) (a RenderTargetTexture subclass) acts as a dynamically rendered environment map for flat mirrors.

<p><Playground id="#1YAIO7#5" title="Mirrors" description="Several mirrors surrounding a sphere." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction11.jpg"/></p>

As with reflection probes, you must set each MirrorTexture's [.renderList](/typedoc/classes/babylon.mirrortexture#renderlist) to an explicit list of meshes to show in the mirror, keeping efficiency in mind. You must also set each MirrorTexture's [.mirrorPlane](/typedoc/classes/babylon.mirrortexture#mirrorplane) to the [Plane](/typedoc/classes/babylon.plane) of reflection, with the plane's normal pointing _into_ the mirror (away from the viewer).

You may set Plane coordinates directly, but it can be convenient to build the Plane from mesh geometry:

```javascript
// Create, position, and rotate a flat mesh surface.
const mesh = BABYLON.MeshBuilder.CreatePlane("mirrorMesh", {width: 5, height: 5}, scene);
mesh.position = new BABYLON.Vector3(0, 0, 4);
mesh.rotation = new BABYLON.Vector3(Math.PI/4, Math.PI/6, Math.PI/8);

// Create the reflective material for the mesh.
mesh.material = new BABYLON.StandardMaterial("mirrorMaterial", scene);
mesh.material.reflectionTexture = new BABYLON.MirrorTexture("mirrorTexture", 512, scene, true);

// Get a normal vector from the mesh and invert it to create the mirror plane.
mesh.material.reflectionTexture.mirrorPlane = BABYLON.Plane.FromPositionAndNormal(
    mesh.position, mesh.getFacetNormal(0).scale(-1));
mesh.material.reflectionTexture.renderList = [... list of meshes ...];
```

<p/>

To create a blurred reflection, set MirrorTexture's [.blurKernel](/typedoc/classes/babylon.mirrortexture#blurkernel) to the blur kernel size (higher is blurrier) relative to the render texture size (set when MirrorTexture is created). Use [.adaptiveBlurKernel](/typedoc/classes/babylon.mirrortexture#blurkernel) instead to scale the blur value by the ratio of the render texture size and viewport size.

<p><Playground id="#LVTTQX#1" title="Reflection Blur" description="A shape reflected in a surface with blurring." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction12.jpg"/></p>

### RefractionTexture
[RefractionTexture](/typedoc/classes/babylon.refractiontexture) (also a RenderTargetTexture subclass) is similar to MirrorTexture, but designed for refraction instead of reflection.

RefractionTexture acts as a dynamically rendered single-image environment map for flat _refractors_ (materials like glass or water that bend light). You can use RefractionTexture instances directly in [.refractionTexture](/typedoc/classes/babylon.standardmaterial#reflectiontexture). (Note, RefractionTexture simulates fixed-thickness plates of refractive material, and does not support lenses or shapes "bent" by immersion.)

<p><Playground id="#22KZUW#15" title="Refraction" description="A refractive disc in a simple scene." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction13.jpg"/></p>

As with MirrorTexture, you must set each RefractionTexture's [.renderList](/typedoc/classes/babylon.refractiontexture#renderlist) to an explicit list of meshes to show in the refraction, keeping efficiency in mind.

You must also set each RefractionTexture's [.refractionPlane](/typedoc/classes/babylon.refractiontexture#refractionplane) to the [Plane](/typedoc/classes/babylon.plane) of refraction, with the plane's normal pointing _out of_ the refractor (_toward_ the viewer). You may set Plane coordinates directly, but it can be convenient to build the Plane from mesh geometry as described above for MirrorTexture (but without the `.scale(-1)` call).

Finally, you must set each RefractionTexture's [.indexOfRefraction](/typedoc/classes/babylon.refractiontexture#indexofrefraction) and [.depth](/typedoc/classes/babylon.refractiontexture#depth) to the index of refraction ([wikipedia](https://en.wikipedia.org/wiki/Refractive_index)) and thickness of the refractive plate to simulate.

<p>
<Playground id="#1YAIO7#19" title="Changing Index Of Refraction" description="A plate with varying index of refraction." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction15.jpg"/>
<Playground id="#1YAIO7#20" title="Changing Refraction Depth" description="A plate with varying refraction depth." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction14.jpg"/>
</p>

## Coordinate Modes

By default, cubemaps (static and dynamic) simulate the physical laws of reflection ([wikipedia](https://en.wikipedia.org/wiki/Reflection_(physics)#Laws\_of\_reflection)), which produces realistic shiny materials. However, sometimes other reflection effects are desired. 

[default.fragment.fx](https://github.com/BabylonJS/Babylon.js/blob/master/src/Shaders/default.fragment.fx)

[defaultFragmentDeclaration.fx](https://github.com/BabylonJS/Babylon.js/blob/master/src/Shaders/ShadersInclude/defaultFragmentDeclaration.fx)

[reflectionFunction.fx](https://github.com/BabylonJS/Babylon.js/blob/master/src/Shaders/ShadersInclude/reflectionFunction.fx)

<p><img src="/img/how_to/Materials/letter_grid.png" width="200" height="200" caption="test pattern"/></p>

<Playground id="#20OAV9#4307" title="Reflection Texture Coordinate modes"/>

<table><tbody><tr>
<td><img src="/img/how_to/Materials/testcube_px.png" width="100" height="100" caption="testcube_px.png" alt="RGT test pattern"/></td>
<td><img src="/img/how_to/Materials/testcube_nx.png" width="100" height="100" caption="testcube_nx.png" alt="LFT test pattern"/></td>
<td><img src="/img/how_to/Materials/testcube_py.png" width="100" height="100" caption="testcube_py.png" alt="TOP test pattern"/></td>
<td><img src="/img/how_to/Materials/testcube_ny.png" width="100" height="100" caption="testcube_ny.png" alt="BOT test pattern"/></td>
<td><img src="/img/how_to/Materials/testcube_pz.png" width="100" height="100" caption="testcube_pz.png" alt="BCK test pattern"/></td>
<td><img src="/img/how_to/Materials/testcube_nz.png" width="100" height="100" caption="testcube_nz.jpg" alt="FRT test pattern"/></td>
</tr></tbody></table><p/>

<Playground id="#20OAV9#4308" title="Reflection CubeTexture Coordinate Modes"/>
