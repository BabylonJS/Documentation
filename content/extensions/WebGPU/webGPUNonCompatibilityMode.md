---
title: WebGPU Non Compatibility Mode
image: 
description: Learn how to use the non compatibility mode for faster scene display
keywords: babylon.js, WebGPU, compatibility, rendering
further-reading:
video-overview:
video-content:
---

WebGPU can be run in a **non compatibility mode** (NCM - also called **fast path**) that can allow for better performances, depending on your scene.

The `WebGPUEngine.compatibilityMode` property is a switch which is `true` by default. In this mode, the WebGPU engine is in a full **compatibility mode** (CM) with WebGL, meaning all scenes that can be rendered with WebGL can also be rendered by WebGPU without any changes on your side.

When setting this property to `false` you switch to the **non compatibility mode** (NCM), allowing the engine to use another code path which may improve performances at the cost of some possible re-organisation of your code.

## Description
What this mode does is that it builds an object called a **bundle** which holds the commands to draw a mesh (more precisely a submesh) in a given context and then reuse this bundle each time the mesh must be drawn in this context. Building this bundle has a cost, so the bundle must have a lifetime long enough to compensate for this cost: if the bundle is recreated on each frame you will actually suffer a performance penalty by using the NCM!

A bundle must be recreated when a number of things happen: you change the material, you change some global context directly on the engine, you update some vertices data, etc. You can know how many bundles are recreated and how many are reused for the last frame by looking at the `engine.countersLastFrame` property:
```javascript
> engine.countersLastFrame
> {numEnableEffects: 0, numEnableDrawWrapper: 2, numBundleCreationNonCompatMode: 0, numBundleReuseNonCompatMode: 2}
```
What you are interested in are the two `numBundleXXX` counters:
* `numBundleReuseNonCompatMode` is the number of bundles that have been reused in the last frame
* `numBundleCreationNonCompatMode` is the number of bundles that have been created in the last frame

The lower `numBundleCreationNonCompatMode` is the better: the best case is when this counter is 0. Of course, depending on what you are doing, it won't be possible to have this counter always equal to 0 but you should try to have it as low as possible.

**Note**: if both counters are 0 it means you are not in NCM, you should do `engine.compatibilityMode = false` to switch to NCM.

See last section of this page for things to watch for that could lead to bundle (re)creations and how to modify your code to avoid this.

## Caveats
When in NCM mode, theoritically it *may* be possible that some things don't work as expected (for eg. that changing a material would not work), in which case calling `scene.resetDrawCache()` would fix the problem (or `mesh.resetDrawCache()` if the problem only impacts a single mesh).

However, this should not happen in practice: if it does, please report to the forum so we can analyze the case and see if it can be made to work automatically without having to call `resetDrawCache`.

Also, even if you are able to achieve low (or even 0) bundle recreations each frame you may not see a performance improvement over the **compatibility mode**. It will depend on your scene and you should do some benchmarking to see if NCM improves things for you.

## Case analysis
Below is a list of all the playgrounds from our validation test suite that recreated one or more bundles each frame when we first tested them in the **non compatibility mode**. We explain why they were creating bundles and how we fixed them (when that was possible). You can see the fixed code by appending the PG number (given inside the parenthesis after the PG name) to the Playground url (https://playground.babylonjs.com/).

### WebGPU list (webgpu.json)

* **sphere with custom shader to display wireframe using glow layer** (#Y05E2C#6)
    * why: a property of a material is changed two times in a frame, to change the color depending on where the mesh is drawn (the glow layer or the regular rendering)
    * solution: use two materials, one for each case
* **particle system matrix like** (#WL44T7)
    * why: a new particle system is recreated to replace one that has reached its time to live
    * solution: none. New particle systems are recreated regularly as part as the normal working of the PG, so it's expected that bundles are created regularly too

### Default list (config.json)

* **Nested BBG, Chibi Rex, Yeti, Bones, GLTF Serializer Morph Target Animation Group** (#ZG0C8B#5, #QATUCH#18, #QATUCH#19, #7EC27T#3, #T087A8#29)
    * why: use same material for different meshes that are using different skeletons
    * solution: use as many materials as the number of skeletons
* **Solid particle system** (#WCDZS#92)
    * why: SPS mesh is pickable. When the mesh is pickable, the vertex attributes (position, normal) are updated by calling `mesh.updateVerticesData` which dirtifies the material and ends-up recreating the bundle used by the fast path code
    * solution: sets the mesh as not pickable
* **Ribbon morphing** (#ACKC2#1)
    * why: updating the position attribute each frame
    * solution: none at the time, the `CreateTube` (and all functions of `MeshBuilder`) are using `getVerticesData` / `updateVerticesData` to update an existing instance, the latter method triggering a `markAsAttributeDirty` call on the material. We would need to update the GPU buffer directly without using `updateVerticesData`, but by doing so we would loose the baking CPU array which is necessary for the mesh builder methods to work (the `Buffer.updateDirectly` method is clearing the `_data` property but `getVerticesData` works only if this property is not `null`)
* **Custom render target** (#TQCEBF#3)
    * why: changing the material used by a `RenderTargetTexture` in `onBeforeRender` and reseting it in `onAfterRender`
    * solution: use `RenderTargetTexture.setMaterialForRendering` instead of `onBeforeRender` / `onAfterRender`
* **Advanced shadows, Advanced shadows (right handed), Reverse depth buffer and shadows** (#SLV8LW#3, #B48X7G#64, #WL4Q8J#20)
    * why: the same material is used for the 8 floors (for **Reverse depth buffer and shadows** it's the boxes/sphere/knot which are reusing the same material). Each floor + box is lit by a specific light which has its own shader generator. When a floor is drawn, the shadow sampler corresponding to the shadow generator is bound to the shader, and because all floors are using the same material, setting a new shadow sampler resets the cache
    * solution: use a different (cloned) material for each floor
* **Motion Blur, Instances + GBR + motion blur** (#E5YGEL#20, #YB006J#403)
    * why: the number of spheres (of trees in **Instances + GBR + motion blur**) visible each frame is never the same because they are moving. The `LeftOver` uniform buffer that stores the motion blur parameters for each sphere has a number of GPU buffers internally, one per sphere. When the fast path bundle is created, one buffer is associated to the bundle (buffer #0 for first sphere displayed, #1 for second sphere and so on). However, the next frame, the GPU buffer that will be used for a given sphere may be different because the buffers are reused starting from the first one: the first buffer is used for the first sphere displayed, second buffer is used for the second sphere displayed, etc. So, if the spheres are not displayed in the same order, the bundle(s) will be recreated
    * solution: none at the time. For the PG, we simply set `alwaysSelectAsActiveMesh=true` so that the number of spheres handled by the system does not vary
* **Thin instances + motion blur + manual** (#HJGC2G#132)
    * why: `thinInstanceSetBuffer` was called each frame, which is (re)creating a vertex buffer, which in turn is flagging the material as "attribute dirty"
    * solution: use `thinInstanceBufferUpdated` instead
* **Multi cameras and output render target** (#BCYE7J#31)
    * why: `cameraRTT1` and `cameraRTT2` are rendering into the same RTT (using their `outputRenderTarget` property), but when rendering in a RTT the render pass id which is used is `RTT.renderPassId`, meaning the meshes are rendered two times (because two cameras) with the same `renderPassId`, leading to bundle recreations (because the scene ubo is not the same in both cases as it stores the camera view/projection)
    * solution: remove the `RTT.renderPassID` property (`RTT.renderPassID = undefined`) => in that case, the `camera.renderPassId` value will be used instead
* **Order independent transparency** (#1PLV5Z#104)
    * why: not using `useRenderPasses = true` on the depth peeling renderer
    * solution: set `scene.depthPeelingRenderer.useRenderPasses = true;`
