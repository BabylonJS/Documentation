---
title: Mesh Behaviors
image: 
description: Everything you want to know about mesh behaviors.
keywords: diving deeper, behaviors, mesh behaviors
further-reading:
video-overview:
video-content:
---

## Introduction
Mesh behaviors are [Behaviors](/features/divingDeeper/behaviors) that can be attached to a mesh.

## PointerDragBehavior
This is used to drag a mesh around a plane or axis using a mouse or VR controller.
```
var pointerDragBehavior = new BABYLON.PointerDragBehavior({dragAxis: new BABYLON.Vector3(0,1,0)});
```
It can be initialized in 3 different modes:
 - `dragAxis`: Dragging will occur along the provided axis
 - `dragPlaneNormal`: Dragging will occur along the plane defined by the normal
 - _None_: Dragging will occur along the plane facing the camera

By default, the dragging plane/axis will be modified by the object's orientation. To keep the specified axis/plane fixed to the world, set `useObjectOrientationForDragging` to false.
```
pointerDragBehavior.useObjectOrientationForDragging = false;
```
By default, the drag plane will update on every frame. To disable this, set `updateDragPlane` to false.
```
pointerDragBehavior.updateDragPlane = false;
```
To listen to drag events, the following can be used.
```
pointerDragBehavior.onDragStartObservable.add((event)=>{
    console.log("dragStart");
    console.log(event);
})
pointerDragBehavior.onDragObservable.add((event)=>{
    console.log("drag");
    console.log(event);
})
pointerDragBehavior.onDragEndObservable.add((event)=>{
    console.log("dragEnd");
    console.log(event);
})
```
To use the drag behavior without moving the attached mesh, set `moveAttached` to false. The drag events above can then be used for custom drag interactions.
```
pointerDragBehavior.moveAttached = false;
```
To disable all dragging behavior, set `enabled` to false.
```
pointerDragBehavior.enabled = false;
```
To inspect the current state of the dragged mesh, `currentDraggingPointerID`, `dragging` and `lastDragPosition` can be inspected.
```
// The id of the pointer that is currently interacting with the behavior (-1 when no pointer is active)
pointerDragBehavior.currentDraggingPointerID;
// The last position where the pointer hit the drag plane in world space
pointerDragBehavior.lastDragPosition;
// If the behavior is currently in a dragging state
pointerDragBehavior.dragging;
```

* Playground Example: <Playground id="#YEZPVT" title="Drag Along an Axis" description="A simple example of the pointerDragBehavior." image="/img/playgroundsAndNMEs/features/divingDeeperMeshBehaviors1.jpg" isMain={true} category="Behaviors"/>

## SixDofDragBehavior
This is used to drag a mesh around in 3D space based on the pointer's origin (eg. camera or VR controller position).
```
var sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
```
By default, pointer jitter is smoothed by slowly moving the mesh to where the pointer is pointing. To remove or modify this behavior, the following field can be modified.
```
// The distance towards the target drag position to move each frame. This can be useful to avoid jitter. Set this to 1 for no delay. (Default: 0.2)
sixDofDragBehavior.dragDeltaRatio = 0.2;
```
By default, dragging objects away/towards you will be magnified to make moving objects large distances easier. To avoid/modify this, the following can be used.
```
// The distance towards the target drag position to move each frame. This can be useful to avoid jitter. Set this to 1 for no delay. (Default: 0.2)
sixDofDragBehavior.zDragFactor = 0.2;
```
**Note** - To avoid large performance hits when using with models that have complex geometries, the object should be wrapped in a bounding box mesh. See [BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox](/divingDeeper/mesh/gizmo)
* Playground Example: <Playground id="#5G9MC5" title="Six Directions Example" description="A simple example of SixDofDragBehavior." image="/img/playgroundsAndNMEs/divingDeeperMeshBehaviors2.jpg" isMain={true} category="Behaviors"/>

## MultiPointerScaleBehavior
This is used to scale a mesh based on 2 pointers (eg. fingers or VR controllers).
```
var multiPointerScaleBehavior = new BABYLON.MultiPointerScaleBehavior();
```
**Note** - To avoid large performance hits when using with models that have complex geometries, the object should be wrapped in a bounding box mesh. See [BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox](/divingDeeper/mesh/gizmo)
* Playground Example: <Playground id="#5G9MC5" title="MultiPointerScaleBehavior Example" description="A simple example of MultiPointerScaleBehavior." image="/img/playgroundsAndNMEs/divingDeeperMeshBehaviors2.jpg" />

## AttachToBoxBehavior (AppBar)
This is used to attach a mesh or UI on top of a mesh's bounding box.
```
var behavior = new BABYLON.AttachToBoxBehavior(appBar);
boundingBox.addBehavior(behavior);
```

To adjust the positioning of the attached mesh, use the following.
```
behavior.distanceAwayFromFace = 0.15;
behavior.distanceAwayFromBottomOfFace = 0.15;
```

This can be used to attach an app bar to a mesh.

![](/img/how_to/gui/appBar.PNG)

* Playground Example: <Playground id="#X6MQ1L" title="AttachToBoxBehavior Example" description="A simple example of AttachToBoxBehavior." image="/img/playgroundsAndNMEs/features/divingDeeperMeshBehaviors2.jpg" isMain={true} category="Behaviors"/>

## FollowBehavior
This is used to make a mesh follow the camera.

```
var followBehavior = new BABYLON.FollowBehavior();
followBehavior.attach(mesh);
```

The position/rotation of the mesh will be updated in 3 cases:
+ Either the mesh goes outside the bounds of the field of view. Use `maxViewVerticalDegrees` and `maxViewHorizontalDegrees` to tweak these bounds.
+ Either the mesh goes too close or too far from the camera. Use `defaultDistance`, `minimumDistance` and `maximumDistance` to tweak these distances.
+ Either the mesh is facing away from the camera. Use `orientToCameraDeadzoneDegrees` to delimit the maximum angle that the mesh can be facing away.

In XR experiences, it can be useful not to consider the user's complete head rotation. Use the property `ignoreCameraPitchAndRoll` to only consider the yaw (rotation around the Y axis) of the head. In this mode, you can use `pitchOffset`, to slightly put the mesh under or over the horizontal plane.

Like `SixDofDragBehavior`, every transformation of the mesh is interpolated to avoid jitter. Use `lerpTime` to adjust the length of the interpolation (the higher the slower).

## SurfaceMagnetismBehavior
This is used to make a mesh stick to another mesh, and be oriented along its normal. It can, for instance, be used in XR experiences to make UI controls stick to walls.

The property `meshes` is the list of meshes that we should consider as intersectors.

```
var surfaceMagnetismBehavior = new BABYLON.SurfaceMagnetismBehavior();
surfaceMagnetismBehavior.attach(mesh);
surfaceMagnetismBehavior.meshes = meshes;
```

By default, it will intersect `meshes` everytime the pointer moves, and the position will be updated accordingly (with interpolation, like with `FollowBehavior`). Use the flag `enabled` to control whether this behavior should get into play.

## HandConstraintBehavior
This is used to make a mesh follow the hand of the user. It should always be linked to a [WebXRDefaultExperience](/features/divingDeeper/webXR/webXRExperienceHelpers#the-webxr-default-experience) to retieve the position of the hand.
The XR experience should also enable the [HandTracking](/features/divingDeeper/webXR/WebXRSelectedFeatures#hand-tracking) feature like this :

```
xr.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
    xrInput: xr.input
});
```

And then you can instanciate the behavior, attach it to a mesh, and link it to the XR experience:

```
var handConstraintBehavior = new BABYLON.HandConstraintBehavior();
handConstraintBehavior.attach(mesh);
handConstraintBehavior.linkToXRExperience(xr);
```

You can change the hand it should follow with the property `handedness`.
