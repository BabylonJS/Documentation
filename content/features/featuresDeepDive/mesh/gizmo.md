---
title: Gizmos
image:
description: Learn about gizmos in Babylon.js.
keywords: diving deeper, meshes, gizmo, manipulator
further-reading:
video-overview:
video-content:
---

## Introduction

Gizmo's are objects that can be attached to a node (mesh, bone, transform) to provide interaction. The GizmoManager and BoundingBox gizmo work with mesh. Whereas Position, scale and rotation gizmos are also usable with TransformNodes and Bones.

![Babylon.js Gizmos](/img/how_to/gui/gizmos.png)

Note: Gizmos will set/modify the [rotationQuaternion](/features/featuresDeepDive/mesh/transforms) of the attached node. After attaching, any rotation of the mesh should be done with the rotationQuaternion property instead of rotation.

## GizmoManager

To get a default gizmo setup, the GizmoManager class can be used.

```javascript
var gizmoManager = new BABYLON.GizmoManager(scene);
```

The gizmo manager will attach the enabled gizmo to whatever object in the scene that is selected by a pointer. To enable a gizmo, any of the following can be used:

```javascript
gizmoManager.positionGizmoEnabled = true;
gizmoManager.rotationGizmoEnabled = true;
gizmoManager.scaleGizmoEnabled = true;
gizmoManager.boundingBoxGizmoEnabled = true;
```

To specify the meshes which can have the gizmo attached, the attachableMeshes field can be set.

```javascript
gizmoManager.attachableMeshes = [mesh1, mesh2, mesh3];
```

To manually change the selected mesh, the gizmo manager's _attachToMesh_ method can be called and the usePointerToAttachGizmos field can be used to disable the manager's default pointer behavior.

```javascript
gizmoManager.usePointerToAttachGizmos = false;
gizmoManager.attachToMesh(mesh);
```

All the internal gizmo's are accessible through the manager to support scenarios such as listening to drag events.

```javascript
gizmoManager.gizmos.scaleGizmo;
gizmoManager.gizmos.rotationGizmo;
gizmoManager.gizmos.positionGizmo;

gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragStartObservable.add(()=>{
    console.log("Position gizmo's x axis started to be dragged");
})
gizmoManager.gizmos.positionGizmo.xGizmo.dragBehavior.onDragEndObservable.add(()=>{
    console.log("Position gizmo's x axis drag was ended");
})
```

By default gizmo orientation is in local space so it will be rotated to match the rotation of the object that it is attached to. To change to world orientation, the updateGizmoRotationToMatchAttachedMesh property can be set to false:

```javascript
gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = false;
```

Note: This is not supported on the scale gizmo

<Playground id="#4TBMBR#33" title="Gizmo Manager Example" description="Simple example of using the gizmo manager."/>

## Setup

Gizmos are displayed by a [UtilityLayerRenderer](/features/featuresDeepDive/mesh/utilityLayerRenderer) to not disrupt the existing scene state. If not specified, the default utility layer will be used.

The utility layers are independent of the scene or engine. After creating a gizmo it is exposed off of gizmo.gizmoLayer. If creating a gizmo without specifying a utility layer it will use the default utility layer’s UtilityLayerRenderer.DefaultUtilityLayer (for overlay gizmos like position/scale) and UtilityLayerRenderer.DefaultKeepDepthUtilityLayer (for occluded gizmos like bounding box) It is recommended to use these layers and reuse layers for most cases as every new utility layer comes with additional overhead.

```javascript
var utilLayer = new BABYLON.UtilityLayerRenderer(scene);
var gizmo = new BABYLON.AxisDragGizmo(new BABYLON.Vector3(1,0,0), BABYLON.Color3.FromHexString("#00b894"), utilLayer);
```

When created, the gizmo will not be attached to a node and will not be visible so the gizmo can be attached to a node to become active. Setting this to null will disable/hide the gizmo once again.

```javascript
gizmo.attachedMesh = sphere;
```

By default, the gizmo will be updated to match the attached node's rotation and position but these can be modified with the following

```javascript
// Keep the gizmo fixed to world rotation
gizmo.updateGizmoRotationToMatchAttachedMesh = false;
gizmo.updateGizmoPositionToMatchAttachedMesh = true;
```

<Playground id="#8GY6J8#210" title="Gizmo .glTF Setup Example" description="Simple example of how to set up a gizmo for a .glTF File."/>

## Position, scale and rotation gizmos

Default gizmos for position, rotation and scale on a single axis are supported

- <Playground id="#31M2AP#9" title="AxisDragGizmo Example" description="Simple example of how to use the AxisDragGizmo."/>
- <Playground id="#31M2AP#10" title="AxisScaleGizmo Example" description="Simple example of how to use the AxisScaleGizmo."/>
- <Playground id="#31M2AP#11" title="PlaneRotationGizmo Example" description="Simple example of how to use the PlaneRotationGizmo."/>

Snapping can be enabled on any of the single axis gizmos

```javascript
gizmo.snapDistance = 0.3;
gizmo.onSnapObservable.add((event)=>{
    console.log(event);
})
```

A sensitivity factor can be customized for AxisScaleGizmo and ScaleGizmo. Default is 1, a higher value means more stretch for the same drag.

```javascript
gizmoScale.sensitivity = 3;
```

These gizmo's internally use a [pointerDragBehavior](/features/featuresDeepDive/behaviors/meshBehaviors), this is exposed and can be used perform tasks before/during/after dragging a gizmo

```javascript
gizmo.dragBehavior.onDragObservable.add(()=>{
    console.log("drag");
})
```

Classes for 3 axis gizmos are also provided which contain 3 of the single axis gizmos within

- <Playground id="#31M2AP#6" title="PositionGizmo Example" description="Simple example of how to use the PositionGizmo."/>
- <Playground id="#31M2AP#8" title="ScaleGizmo Example" description="Simple example of how to use the ScaleGizmo."/>
- <Playground id="#31M2AP#7" title="RotationGizmo Example" description="Simple example of how to use the RotationGizmo."/>

The single axis gizmos within these are exposed via the xGizmo, yGizmo and zGizmo properties. The scale gizmo also has a uniformScaleGizmo property which references center gizmo used to uniformly scale.

## Bounding box Gizmo

The BoundingBoxGizmo displays a bounding box around an object as well as controls to rotate and scale the object.

The enabled rotation axis can be customized with the following:

```javascript
// only enable rotation on x and y axis
gizmo.setEnabledRotationAxis("xy");
```

The size of rotation and scale controls on the gizmo can be adjusted by using the following controls:

```javascript
// The size of the rotation spheres attached to the bounding box (Default: 0.1)
gizmo.rotationSphereSize = 0.1;
// The size of the scale boxes attached to the bounding box (Default: 0.1)
gizmo.scaleBoxSize = 0.1;
// If set, the rotation spheres and scale boxes will increase in size based on the distance away from the camera to have a consistent screen size (Default: false)
gizmo.rotationSphereSize = false;
```

The following events are fired when dragging occurs on either the scale or rotation meshes of the bounding box.

```javascript
gizmo.onScaleBoxDragObservable.add(()=>{
    console.log("scaleDrag");
});
gizmo.onScaleBoxDragEndObservable.add(()=>{
    console.log("scaleEnd");
});
gizmo.onRotationSphereDragObservable.add(()=>{
    console.log("rotDrag");
});
gizmo.onRotationSphereDragEndObservable.add(()=>{
    console.log("rotEnd");
});
```

To drag around objects contained inside a bounding box, [Mesh Behaviors](/features/featuresDeepDive/behaviors/meshBehaviors) can be attached.
When using with models with complex geometry such as a custom GLTF file, the complex model should be set to not be pickable by pointers and wrapped in a pickable bounding box mesh to save on performance. A helper method to do this is provided.

```javascript
var boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh);
```

Additionally, the bounding box can ignore children of the attached mesh to add additional performance gain when needed.

```javascript
gizmo.ignoreChildren = true;
```

To only ignore certain children when computing the bounding box, the includeChildPredicate can be set.

```javascript
gizmo.includeChildPredicate = (m)=>{return m == sphere2};
```

<Playground id="#SG9ZZB" title="Bounding Box Gizmo Example" description="Simple example of a bounding box gizmo."/>

UI can be attached to the bounding box using the [AttachToBoxBehavior](/features/featuresDeepDive/behaviors/meshBehaviors)

<Playground id="#8GY6J8#199" title="Bounding Box Gizmo .glTF Example" description="Simple example of how to use the Bounding Box Gizmo with a .glTF file."/>
<Playground id="#6E4LSB#15" title="Bounding Box Gizmo Animated .glTF Example" description="Simple example of how to use the Bounding Box Gizmo with an animated .glTF file."/>
<Playground id="#DEYAQ5#47" title="Bounding Box Gizmo Example" description="Simple example of how to use the Bounding Box Gizmo."/>

## Gizmo customization

To customize the visual appearance of an existing gizmo, create a mesh on the same utility layer and then setCustomMesh on the gizmo. Utility layers do not contain lights by default so it is recommended use a material with an emissive texture.

```javascript
var customMesh = BABYLON.MeshBuilder.CreateBox("", {size: 0.1}, gizmo.gizmoLayer.utilityLayerScene)
customMesh.material = material
gizmo.setCustomMesh(customMesh)
```

<Playground id="#7KX2R8#133" title="Gizmo Customization Example" description="Simple example of how to customize the gizmo."/>
