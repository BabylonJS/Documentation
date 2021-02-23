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
Mesh behaviors are [Behaviors](/divingDeeper/behaviors) that can be attached to a mesh.

## PointerDragBehavior
This is used to drag a mesh around a plane or axis using a mouse or vr controller.
```
var pointerDragBehavior = new BABYLON.PointerDragBehavior({dragAxis: new BABYLON.Vector3(0,1,0)});
```
It can be initialized in 3 different modes
 - dragAxis: Dragging will occur along the provided axis
 - dragPlaneNormal: Dragging will occur along the plane defined by the normal
 - None: Dragging will occur along the plane facing the camera

By default, the dragging plane/axis will be modified by the objects orientation. To keep the specified axis/plane fixed to the world set this to false.
```
pointerDragBehavior.useObjectOrientationForDragging = false;
```
By default, the drag plane will update on every frame, to disable this set updateDragPlane to false
```
pointerDragBehavior.updateDragPlane = false;
```
To listen to drag events the following can be used.
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
To use the drag behavior without moving the attached mesh set this to false. The drag events above can then be listened to to allow custom drag interactions.
```
pointerDragBehavior.moveAttached = false;
```
To disable all dragging behavior, set enabled to false
```
pointerDragBehavior.enabled = false;
```
To inspect the current state of the dragged mesh, currentDraggingPointerID, dragging and lastDragPosition can be inspected
```
// The id of the pointer that is currently interacting with the behavior (-1 when no pointer is active)
pointerDragBehavior.currentDraggingPointerID;
// The last position where the pointer hit the drag plane in world space
pointerDragBehavior.lastDragPosition;
// If the behavior is currently in a dragging state
pointerDragBehavior.dragging;
```

* Playground Example: <Playground id="#YEZPVT" title="Drag Along an Axis" description="A simple example of the pointerDragBehavior." image="/img/playgroundsAndNMEs/divingDeeperMeshBehaviors1.jpg" isMain={true} category="Behaviors"/>

## SixDofDragBehavior
This is used to drag a mesh around in 3D space based on the pointers origin (eg. camera or vr controller position)
```
var sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
```
By default, pointer jitter is smoothed by slowly moving the mesh to where the pointer is pointing. To remove or modify this behavior the following field can be modified.
```
// The distance towards the target drag position to move each frame. This can be useful to avoid jitter. Set this to 1 for no delay. (Default: 0.2)
sixDofDragBehavior.dragDeltaRatio = 0.2;
```
By default, dragging objects away/towards you will be magnified to make moving objects large distances easier. To avoid/modify this the following can be used.
```
// The distance towards the target drag position to move each frame. This can be useful to avoid jitter. Set this to 1 for no delay. (Default: 0.2)
sixDofDragBehavior.zDragFactor = 0.2;
```
**Note** - To avoid large performance hits when using with models with complex geometries, the object should be wrapped in a bounding box mesh. See [BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox](/divingDeeper/mesh/gizmo)
* Playground Example: <Playground id="#5G9MC5" title="Six Directions Example" description="A simple example of SixDofDragBehavior." image="/img/playgroundsAndNMEs/divingDeeperMeshBehaviors2.jpg" isMain={true} category="Behaviors"/>

## MultiPointerScaleBehavior
This is used to scale a mesh based on 2 pointers (eg. fingers or vr controllers)
```
var multiPointerScaleBehavior = new BABYLON.MultiPointerScaleBehavior();
```
**Note** - To avoid large performance hits when using with models with complex geometries, the object should be wrapped in a bounding box mesh. See [BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox](/divingDeeper/mesh/gizmo)
* Playground Example: <Playground id="#5G9MC5" title="MultiPointerScaleBehavior Example" description="A simple example of SixDofDragBehavior." image="/img/playgroundsAndNMEs/divingDeeperMeshBehaviors2.jpg" />

## AttachToBoxBehavior (AppBar)
This is used to attach a mesh or UI on top of a meshes bounding box
```
var behavior = new BABYLON.AttachToBoxBehavior(appBar);
boundingBox.addBehavior(behavior);
```

Adjust the positioning of mesh attached using
```
behavior.distanceAwayFromFace = 0.15;
behavior.distanceAwayFromBottomOfFace = 0.15;
```

This can be used to attach an app bar to a mesh

![](/img/how_to/gui/appBar.png)

* Playground Example: <Playground id="#X6MQ1L" title="AttachToBoxBehavior Example" description="A simple example of AttachToBoxBehavior." image="/img/playgroundsAndNMEs/divingDeeperMeshBehaviors2.jpg" isMain={true} category="Behaviors"/>