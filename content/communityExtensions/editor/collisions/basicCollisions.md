---
title: Basic Collisions
image: 
description: Understanding how to create and edit basic collisions in a Babylon.JS Editor project
keywords: editor, collisions
further-reading:
video-overview:
video-content:
---

## Setting Basic Collisions
Using the inspector, collisions properties can be customized per object:
- `meshes`: set whether the edited mesh checks for collisions.
- `cameras`: set whether the edited camera checks collisions on meshes and if gravity should be applied.
- `scene`: set whether collisions are enabled in the scene and configure the gravity values.

## Enabling Collisions In Scene
To enable collisions in the scene, simply select the `Scene` in the graph:

![SceneGraph](/img/extensions/Editor/BasicCollisions/scene_graph.png)

And scroll in the inspector to find the section named `Collisions`:

![SceneGraph](/img/extensions/Editor/BasicCollisions/scene_collisions.png)

To enable collisions, simply check the `Enabled` checkbox and provide the gravity values desired for the current scene.

## Enabling Collisions For Camera
Cameras don't necessary check for collisions by default. If your camera doesn't check for collisions, simply select the desired
camera in the graph and scroll in the inspector to find the section named `Collisions`.

*Note: According the type of the selected camera, no all properties will be shown. For example, the `Apply Gravity` option will not be shown
for `Arc Rotate Camera` as it makes no sense.*

### Free Camera
The cameras of type `FreeCamera` are the most common types of camera in projects. To enable collisions, simply check the
`Check Collisions` checkbox and configure the ellipsoid values. For ellipsoids, check the
[following documentation](/features/featuresDeepDive/cameras/camera_collisions#2-define-an-ellipsoid) in order to understand
and setup the desired values according the nature of the current scene being edited in the Editor.

The property `Apply Gravity`, if enabled, will apply the gravity previously set in the scene and can be disabled only by unchecking the
property.

![SceneGraph](/img/extensions/Editor/BasicCollisions/free_camera.png)

### Arc Rotate Camera
As for the `FreeCamera`, the arc rotate cameras can have their collisions enabled using the checkbox `Enabled`.
Opposed to the free camera, the ellipsoid property is replaced by `Collisions Radius` property. Check the
[following documentation](/features/featuresDeepDive/cameras/camera_collisions#arcrotatecamera) in order to understand and setup
the desired value for the collisions radius.

![SceneGraph](/img/extensions/Editor/BasicCollisions/arc_rotate_camera.png)

## Enabling Collisions For Meshes
Once scene and camera(s) have been configured, the last step is to configure which mesh(es) will have collisions enabled in order
to block the camera.

To enable collisions, simply check the `Check Collisions` checkbox and configure its optional `Ellipsoid` and `Ellipsoid Offset` properties.
Don't hesitate to check as well the
[following documentation](/features/featuresDeepDive/cameras/camera_collisions#4-object-vs-object-collision) to
understand ellipsoid and ellipsoid offset properties on meshes.

![SceneGraph](/img/extensions/Editor/BasicCollisions/mesh.png)

## Using The ".moveWithCollisions" Method In Code
The Babylon.JS API provides a method named `.moveWithCollisions` on `Mesh` class. This method will work like for cameras without any,
extra configuration. It'll check collisions on all meshes that have collisions enabled in the scene.

NOTE: If you try calling moveWithCollisions twice within a single frame, you will receive unexpected results as the collision detection logic is based off the mesh's position at the start of the frame, not based on the mesh's position after the first call to `moveWithCollisions`. See [this playground](https://playground.babylonjs.com/#T5JJ6Z#1) demonstrating that behavior. 

This is by design, as re-computing the world matrix is an expensive operation and not something we want to do multiple times per-frame. If you must call move with collisions more than once within a single frame, you can force the world matrix recomputation on the mesh using `mesh.computeWorldMatrix(true)`. See the updated playground [here](https://playground.babylonjs.com/#T5JJ6Z#2).

Please use this approach with caution, as it is not cheap. Calling `computeWorldMatrix(true)` on NodeN will have the following impact

- In current frame it will recompute the world matrix on current node and all of its parents, so the complexity is O(d), where d is the depth of NodeN (this aligns with your analysis above)
- On the next frame, when computeWorldMatrix is called default by the render loop, all the children of NodeN will see that the node is not synchronized with its parent, which will force a recomputation of that node (and thus their children will also not be synchronized with their parent. - Note that if we hadn’t called computeWorldMatrix(true) on NodeN, then its children would skip the recalculation because theyd be syncronized with parent.

So the complexity of forcing recalculation on NodeN increases by # of ancestors (for current frame) and # of descendants (for next frame).