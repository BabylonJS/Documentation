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
var mat = new BABYLON.("RTT mat", scene);
mat.diffuseTexture = renderTarget;
```

In the example we only add half of the spheres to the RTT, showing how you can selectively pick the objects rendered there.

Playground example: <Playground id="#69DRZ1" title="Render Target Texture" description="Simple example of using the render target texture."/>

## Making multiple passes and composing them

Another possibility, as mentioned, is making multiple render passes of the main camera and compose them. Let's do that, adding a simple effect on all meshes and compose it with the original material. One interesting effect to simulate with this technique is water caustics. We can render the scene applying a material that simulates caustics with a wave generator and mix it with the base texture.

The trick is to change the texture on the RTT to use our caustic material on all meshes instead of their own material:

```
renderTarget.onBeforeRender = (e) => {
    // Apply the shader on all meshes
    for (const i in renderTarget.renderList) {
        renderTarget.renderList[i]._saved = renderTarget.renderList[i].material;
        renderTarget.renderList[i].material = causticMaterial;
    }
};
renderTarget.onAfterRender = () => {
    // Remove the shader on all meshes
    for (const i in renderTarget.renderList) {
        renderTarget.renderList[i].material = renderTarget.renderList[i]._saved;
    }
};
```

For the final pass we'll create a shader to merge the base render (which will be provided in the GLSL as `textureSampler`) and the caustic texture, which we declare here as `causticTexture`. 

```
// create the final pass composer
var finalPass = new BABYLON.PostProcess(
    'Final compose shader', 
    'final', // shader name
    null, // attributes
    [ 'causticTexture' ], // textures
    1.0,  // options
    null, // camera
    BABYLON.Texture.BILINEAR_SAMPLINGMODE, // sampling
    engine // engine
);
finalPass.onApply = (effect) => {
    effect.setTexture('causticTexture', renderTarget); // pass the renderTarget as our second texture
};
```

We now can [use a pipeline](/divingDeeper/postProcesses/postProcessRenderPipeline) that performs a base render and uses the `finalPass` to compose it with the caustics.

```
// the render pipeline
var pipeline = new BABYLON.PostProcessRenderPipeline(engine, 'pipeline');
var renderPasses = new BABYLON.PostProcessRenderEffect(
    engine, 'renderPasses', function() { return [imagePass, finalPass]; });
pipeline.addEffect(renderPasses);
scene.postProcessRenderPipelineManager.addPipeline(pipeline);
scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('pipeline', camera);
```

Playground example: <Playground id="#TG2B18" title="Multiple Passes Example" description="Simple example showing how to run multiple passes with the render target texture."/>. On the left you'll see the base render, on the middle the caustic render, and on the right both combined together.

## Performance and tips

Remember that you'll be rendering your scene multiple times, one for each pass. This can significantly slow things down if you are not careful. There are a number of strategies to improve performance:

- reduce the RTT size.
- render as few objects as you can on the RTT.
- use a simple shader on the RTT pass.
- prefer simpler meshes.
- use instances. If you have a large amount of copies of the same object, instances are a good optimization. You only change the material of the base mesh.

Replacing materials is an expensive operation on Babylon, as it requires a resync from the CPU. If your meshes use materials, such as ShaderMaterial or a PBRMaterial, this might impact significantly on the FPS rate. The example above is simple to follow and understand the concept, but there's a way to achieve much better performance,by freezing materials before swapping them. Here's how to do it.

First, create objects that will be in the RTT with a clone of the RTT shader material.

```
// helper function to create clones of the caustic material
// we need that because we'll have different transforms on the shaders
let rttMaterials = [];
const getRTTMaterial = () => {
    let c = rttMaterial.clone();
    c.freeze(); // freeze because we'll only update uniforms
    rttMaterials.push(c);
    return c;
};

// some material for the ground.
var grass0 = new BABYLON.StandardMaterial("grass0", scene);
grass0.diffuseTexture = new BABYLON.Texture("textures/grass.png", scene);
    
// Our built-in 'ground' shape.
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
ground.material = grass0;
// add caustics
ground.rttMaterial = getRTTMaterial();
renderTarget.renderList.push(ground);
```

Swap materials on the RTT before/after callbacks.

```
 // before we render the target, swap materials.
renderTarget.onBeforeRender = (e) => {
    // Apply the shader on all meshes
    renderTarget.renderList.forEach((mesh) => {
        // skip InstancedMesh, we'll handle the original mesh
        if (mesh.getClassName() === 'InstancedMesh') {
            return;
        }
        // the PBR material takes some time to be loaded, it's possible that in the first few frames mesh.material is null...
        if (mesh.material && !mesh.isFrozen && ('isReady' in mesh) && mesh.isReady(true)) { 
            // backup effects
            const _orig_subMeshEffects = [];
            mesh.subMeshes.forEach((submesh) => {
                _orig_subMeshEffects.push([submesh.effect, submesh.materialDefines]);
            });
            mesh.isFrozen = true;
            mesh.material.freeze(); // freeze material so it won't be recomputed onAfter
            // store old material/effects
            mesh._saved_orig_material = mesh.material;
            mesh._orig_subMeshEffects = _orig_subMeshEffects;
        }
        if (!mesh._orig_subMeshEffects) {
            return;
        }
        // swap the material
        mesh.material = mesh.rttMaterial;
        // and swap the effects
        if (mesh._rtt_subMeshEffects) {
            for (let s = 0; s < mesh.subMeshes.length; ++s) {
                mesh.subMeshes[s].setEffect(...mesh._rtt_subMeshEffects[s]);
            }
        }
    });
};
renderTarget.onAfterRender = () => {
    // Set the original shader on all meshes
    renderTarget.renderList.forEach((mesh) => {
        // skip InstancedMesh, we'll handle the original mesh
        if (mesh.getClassName() === 'InstancedMesh') {
            return;
        }
        // nothing to do, early bail
        if (!mesh._orig_subMeshEffects) {
            return;
        }
        // backup sub effects on the rtt shader
        if (!mesh._rtt_subMeshEffects) {
            mesh._rtt_subMeshEffects = [];
            mesh.subMeshes.forEach((submesh) => {
                mesh._rtt_subMeshEffects.push([submesh.effect, submesh.materialDefines]);
            });
        }
        // swap back to original material
        mesh.material = mesh._saved_orig_material;
        for (let s = 0; s < mesh.subMeshes.length; ++s) {
            mesh.subMeshes[s].setEffect(...mesh._orig_subMeshEffects[s]);
        }
    });
};
```

Apply any uniforms on all material clones:

```
engine.runRenderLoop(() => {
    // ... 
    rttMaterials.forEach((c) => {c.setFloat('time', timeDiff)});
});
```

The example has the complete code, including animated objects and instances. You could freeze some meshes with `scene.freezeActiveMeshes()` to improve the performance even further.

Playground example: <Playground id="#S1W87B#5" title="Performance Example" description="Example of managing performance when running multiple passes."/>

### Notes about your shader

Note that since you replace the material with a shader from the scratch for mesh instances, you need to handle effects such as animation or the instance transformation,and this will affect your vertex shader (and possibly your fragment shader as well). There are [https://github.com/BabylonJS/Babylon.js/tree/master/src/Shaders/ShadersInclude](several includes in Babylon) that help with that. Here's a sample vertex shader with support for bone animations and instances:

```
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

Finally you can also check RT textures with the [Babylon inspector](/toolsAndResources/tools/inspector).