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
Occlusion Queries detect whether a Mesh is visible in the current scene or not, and based on that the Mesh get drawn or not. Occlusion Queries is useful when you have an expensive object on the scene and you want to make sure that it will get drawn if it is visible to the camera and it is not behind any opaque object.
BabylonJs provides an implementation for Occlusion Queries using property occlusionType in AbstractMesh Class

## How Occlusion Queries works behind scenes

Babylon.js engine draw a light transparent bounding box on the targeted Mesh before drawing the object and create a query to check with WebGl engine if the bounding box is visible or not. if the box is visible, the object gets drawn if not the object is not drawn, Occlusion Queries is asynchronous and usually the query result of the object is not available in the current frame and because of this the object is drawn based on a query result of previous frame, the user wouldn't notice the difference unless your FPS is too low.

<Playground id="#QDAZ80#5" title="Occlusion Query Example" description="Simple Example of using occlusion queries in your scene." image=""/>

## Basics

To use the Occlusion Queries on a Mesh

```javascript
var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
sphere.occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC;
```

For more about occlusionType and the supported algorithm check AbstractMesh class [documentations](/typedoc/classes/babylon.abstractmesh).

If your object by default is behind an opaque object you can set property `isOccluded` to true so Babylon.js engine won't take a decision to render or not until the query result is retrieved from WebGl engine.

```javascript
sphere.isOccluded = true;
```

## Advanced

As described earlier the Occlusion Queries result is asynchronous and it may take some time to get the result and because of this the object would take many frames to be loaded waiting for the query result. In this case you can use property `occlusionRetryCount` to set the number of waiting frames before query get broken. Once a break happens you will need to decide whether to draw the object or to maintain its state, property `occlusionType` is used for this reason as you have 2 options
1) OCCLUSION_TYPE_OPTIMISTIC: this option will render the mesh if a break is happened.
2) OCCLUSION_TYPE_STRICT: this option will restore the last state of the object whether visible continue as visible or hidden continue as hidden.

As a scenario of using restrict and optimistic if you have 2 expensive objects in your scene one of them is a must render object so you could set `occlusionRetryCount` and set the occlusionType to optimistic so your object will be rendered in case the query result is not available. If your object can wait till the query is available, don't set the `occlusionRetryCount` or set the property while use occlusionType as Strict so if the object was rendered in the last scene re-render it again in the current scene else hide it.

```javascript
sphere.occlusionRetryCount = 10;
sphere.occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_STRICT;
```

In Babylon.js you can also set the WebGl Occlusion Queries algorithm type using property `occlusionQueryAlgorithmType` for more into check AbstractMesh Class [documentations](/typedoc/classes/babylon.abstractmesh).

You can find a live demo here: <Playground id="#QDAZ80#3" title="Advanced Occlusion Queries" description="Example of using advanced occlusion query methods in your scene." image=""/>