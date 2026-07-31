---
title: Occlusion Queries
image:
description: Learn all about leveraging occlusion queries in Babylon.js.
keywords: diving deeper, occlusion queries
further-reading:
video-overview:
video-content:
---

## Introduction

Babylon.js v3.1 introduced a new feature: Occlusion Queries.
Occlusion Queries detect whether a mesh is visible in the current scene and, based on that, whether the mesh should be drawn. Occlusion Queries are useful when you have an expensive object in the scene and want to ensure that it is drawn only when it is visible to the camera and not behind an opaque object.
Babylon.js provides an implementation of Occlusion Queries through the `occlusionType` property in the `AbstractMesh` class.

**Very important**: The meshes you activate for occlusion requests **must** be rendered *after* their potential occluders! The easiest way to do this is to set their `renderingGroupId` property to a value greater than that of the occluding meshes (don't forget to call `scene.setRenderingAutoClearDepthStencil()` with the appropriate parameters, as you probably won't want to clear the depth buffer between rendering groups).

## How Occlusion Queries Work Behind the Scenes

The Babylon.js engine draws a light, transparent bounding box on the targeted mesh before drawing the object and creates a query to check with the WebGL engine whether the bounding box is visible. If the box is visible, the object gets drawn; if not, the object is not drawn. Occlusion Queries are asynchronous, and the query result for the object is usually not available in the current frame. Because of this, the object is drawn based on the query result from the previous frame. Users generally will not notice the difference unless the FPS is very low.

<Playground id="#QDAZ80#646" title="Occlusion Query Example" description="Simple Example of using occlusion queries in your scene."/>

## Basics

To use Occlusion Queries on a mesh, make sure you include these imports so you have access to the feature:
```javascript
import '@babylonjs/core/Engines/Extensions/engine.query';
import '@babylonjs/core/Rendering/boundingBoxRenderer';
```

Then set the occlusionType on your mesh:

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);
sphere.occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC;
```

For more about `occlusionType` and the supported algorithm, see the `AbstractMesh` class [documentation](/typedoc/classes/babylon.abstractmesh).

If your object is behind an opaque object by default, you can set the `isOccluded` property to true so the Babylon.js engine will not decide whether to render it until the query result is retrieved from the WebGL engine.

```javascript
sphere.isOccluded = true;
```

## Advanced

As described earlier, the Occlusion Queries result is asynchronous, and it may take some time to get the result. Because of this, the object may take several frames to appear while waiting for the query result. In this case, you can use the `occlusionRetryCount` property to set the number of waiting frames before the query is interrupted. Once that happens, you will need to decide whether to draw the object or maintain its state. The `occlusionType` property is used for this purpose, and you have 2 options:

1. OCCLUSION_TYPE_OPTIMISTIC: this option will render the mesh if a break happens.
2. OCCLUSION_TYPE_STRICT: this option will restore the last state of the object, whether visible remains visible or hidden remains hidden.

As an example of using strict and optimistic modes, suppose you have 2 expensive objects in your scene and one of them must be rendered. In that case, you could set `occlusionRetryCount` and set `occlusionType` to optimistic so the object will be rendered if the query result is not available. If your object can wait until the query is available, do not set `occlusionRetryCount`, or use `occlusionType` set to strict so that if the object was rendered in the last scene, it is rendered again in the current scene; otherwise, it stays hidden.

```javascript
sphere.occlusionRetryCount = 10;
sphere.occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_STRICT;
```

In Babylon.js, you can also set the WebGL Occlusion Queries algorithm type using the `occlusionQueryAlgorithmType` property. For more information, see the `AbstractMesh` class [documentation](/typedoc/classes/babylon.abstractmesh).

You can find a live demo here: <Playground id="#QDAZ80#3" title="Advanced Occlusion Queries" description="Example of using advanced occlusion query methods in your scene."/>
