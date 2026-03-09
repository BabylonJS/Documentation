---
title: Render Target Texture With Multiple Passes
image: 
description: Learn about the render target texture and running multiple passes in Babylon.js.
keywords: diving deeper, post processes, post process, render target texture
further-reading:
video-overview:
video-content:
---

## How to use RenderTargetTexture and run multiple passes

Sometimes it's interesting to render a scene multiple times and compose the generated passes for the final image. There are multiple uses for that: you can generate a texture in real time, to make a car rearview mirror for example, or you can perform complex effects with multiple independent renders that are combined together. 

The PostProcess API doesn't let you render a scene twice. That's where RenderTargetTexture (RTT) comes into play. Several [games use multiple passes for their graphics](http://www.adriancourreges.com/blog/2016/09/09/doom-2016-graphics-study/).

## Creating a RenderTargetTexture

You need to create a RenderTargetTexture and attach it to the scene. It's pretty straightforward:

```    
var renderTarget = new BABYLON.RenderTargetTexture(
    'render to texture', // name 
    512, // texture size
    scene // the scene
);
scene.customRenderTargets.push(renderTarget); // add RTT to the scene
```

You also need to pick which objects will be rendered to that texture. This enables you to select only a few objects for a particular effect, or use simpler meshes for faster rendering.

```
let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene); // create your mesh
renderTarget.renderList.push(sphere); // add it to the RTT
```

## Using the RTT in your scene as a regular texture

You can use the rendered image as the texture of an object in your main render. Just set it as the texture of a material:

```
var mat = new BABYLON.StandardMaterial("RTT mat", scene);
mat.diffuseTexture = renderTarget;
```

In this example we only add half of the spheres to the RTT, showing how you can selectively pick the objects rendered there.

Playground example: <Playground id="#69DRZ1" title="Render Target Texture" description="Simple example of using the render target texture."/>

In this example we add two meshes, pool and ground, to the RTT and distort the UVs of the texture applied to the water plane using a node material to simulate refraction of the mesh behind the water plane.

Playground example: <Playground id="#7ILX7T" title="Water Refraction with RTT" description="Render Target Texture used to simulate water refraction." image="/img/playgroundsAndNMEs/NMEwaterRefractionRTT.jpg" />

## Making multiple passes and composing them

Another possibility, as mentioned, is making multiple render passes of the main camera and compose them. Let's do that, adding a simple effect on all meshes and compose it with the original material. One interesting effect to simulate with this technique is water caustics. We can render the scene applying a material that simulates caustics with a wave generator and mix it with the base texture.

Since v5.0 it's very easy to use a different material than the regular material (`mesh.material`) when a mesh is rendered into a render target texture: simply use `RenderTargetTexture.setMaterialForRendering(meshOrMeshes, material)`.

```javascript
const causticMaterial = new BABYLON.ShaderMaterial(
    'caustic shader material', // human name
    scene,
    'caustic', // shader path
    {
        attributes: ['position', 'normal', 'uv'],
        uniforms: ['world', 'worldView', 'worldViewProjection', 'view', 'projection', 'time', 'direction']
    }
);

// the render texture. We'll render the scene with caustic shader to this texture.
const renderTarget = new BABYLON.RenderTargetTexture('caustic texture', 512, scene);
scene.customRenderTargets.push(renderTarget);

renderTarget.setMaterialForRendering(ground, causticMaterial);
```

For the final pass we'll create a shader to merge the base render (which will be provided in the [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) as `textureSampler`) and the caustic texture, which we declare here as `causticTexture`. 

```javascript
// create the final pass composer
var finalPass = new BABYLON.PostProcess(
    'Final compose shader', 
    'final', // shader name
    null, // attributes
    [ 'causticTexture' ], // textures
    1.0,  // options
    camera,
    BABYLON.Texture.BILINEAR_SAMPLINGMODE, // sampling
    engine // engine
);
finalPass.onApply = (effect) => {
    effect.setTexture('causticTexture', renderTarget); // pass the renderTarget as our second texture
};
```

Playground example: <Playground id="#TG2B18#60" title="Multiple Passes Example" description="Simple example showing how to run multiple passes with the render target texture." isMain={true} category="Post-processing"/>. On the left you'll see the base render, on the middle the caustic render, and on the right both combined together.

## Performance and tips

Remember that you'll be rendering your scene multiple times, one for each pass. This can significantly slow things down if you are not careful. There are a number of strategies to improve performance:

- reduce the RTT size.
- render as few objects as you can on the RTT.
- use a simple shader on the RTT pass.
- prefer simpler meshes.
- use instances. If you have a large amount of copies of the same object, instances are a good optimization. You only change the material of the base mesh.

Replacing materials is an expensive operation on Babylon, as it requires a resync from the CPU. If your meshes use materials, such as `ShaderMaterial` or a `PBRMaterial`, this might impact significantly on the FPS rate. The example above is simple to follow and understand the concept, but there's a way to achieve much better performance, by freezing materials. Here's how to do it.

Note that since v5.0 you don't need to add some complicated code in the `RTT.onBeforeRender` / `RTT.onAfterRender` observers to save/replace the effects manually, you just have to freeze the materials you know that they won't change and you are good to go!

First, create objects that will be in the RTT with a clone of the RTT shader material.

```javascript
// helper function to create clones of the caustic material
// we need that because we'll have different transforms on the shaders
let rttMaterials = [];
const getCausticMaterial = () => {
    let c = rttMaterial.clone();
    c.freeze(); // freeze because we'll only update uniforms
    rttMaterials.push(c);
    return c;
};

// some material for the ground.
var grass0 = new BABYLON.StandardMaterial("grass0", scene);
grass0.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);
grass0.freeze();

// Our built-in 'ground' shape.
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
ground.material = grass0;
// add caustics
renderTarget.setMaterialForRendering(ground, getCausticMaterial());
renderTarget.renderList.push(ground);
```

Apply any uniforms on all material clones:

```javascript
scene.onBeforeRenderObservable.add(() => {
    // ... 
    rttMaterials.forEach((c) => c.setFloat('time', timeDiff));
});
```

The example has the complete code, including animated objects and instances. You could freeze some meshes with `scene.freezeActiveMeshes()` to improve the performance even further.

Playground example: <Playground id="#S1W87B#42" title="Performance Example" description="Example of managing performance when running multiple passes."/>


### Notes about your shader

Note that since you replace the material with a shader from the scratch for mesh instances, you need to handle effects such as animation or the instance transformation,and this will affect your vertex shader (and possibly your fragment shader as well). There are [several includes in Babylon](https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Shaders/ShadersInclude) that help with that. Here's a sample vertex shader with support for bone animations and instances:

```glsl
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 view;
uniform mat4 projection;
uniform mat4 worldViewProjection;

varying vec2 vUV;

#include<bonesDeclaration>
#include<instancesDeclaration>

void main() {
    vec3 positionUpdated = position;

    #include<instancesVertex>
    #include<bonesVertex>

    vec4 worldPos = finalWorld * vec4(positionUpdated, 1.0);

    vUV = uv;

    gl_Position = projection * view * worldPos;
}
```

### Debugging multiple passes

Your final composer might become a complicated shader, and each pass might be complicated in itself. You certainly will need to debug shaders along the way. One way to easily debug individual passes is to show only that pass to the screen, commenting the rest of the code.

```
varying vec2 vUV;
uniform sampler2D somePassTexture;

void main() {
    // comment other code
    vec4 debugColor = texture2D(someTexture, vUV);
    gl_FragColor = debugColor;
}
```

Testing passes in separate and then adding them one at a time to the composer will make it easier to debug any issues. You can use the technique from the playgrounds above, splitting the screen on columns, each with a different pass, as well.

Finally you can also check RT textures with the [Babylon inspector](/toolsAndResources/inspectorv2).
