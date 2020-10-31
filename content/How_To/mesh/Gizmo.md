# Introduction

Gizmo's are objects that can be attached to a node (mesh, bone, transform) to provide interaction. The GizmoManager and BoundingBox gizmo work with mesh. Whereas Position, scale and rotation gizmos are also usable with TransformNodes and Bones.

![](/img/how_to/gui/gizmos.png)

Note: Gizmos will set/modify the [rotationQuaternion](/features/Position,_Rotation,_Scaling) of the attached node. After attaching, any rotation of the mesh should be done with the rotationQuaternion property instead of rotation.

# GizmoManager
To get a default gizmo setup, the GizmoManager class can be used.
```
var gizmoManager = new BABYLON.GizmoManager(scene);
```
The gizmo manager will attach the enabled gizmo to whatever object in the scene that is selected by a pointer. To enable a gizmo, any of the following can be used:
```
gizmoManager.positionGizmoEnabled = true;
gizmoManager.rotationGizmoEnabled = true;
gizmoManager.scaleGizmoEnabled = true;
gizmoManager.boundingBoxGizmoEnabled = true;
```
To specify the meshes which can have the gizmo attached, the attachableMeshes field can be set.
```
gizmoManager.attachableMeshes = [mesh1, mesh2, mesh3];
```
To manually change the selected mesh, the gizmo manager's *attachToMesh* method can be called and the usePointerToAttachGizmos field can be used to disable the manager's default pointer behavior.
```
gizmoManager.usePointerToAttachGizmos = false;
gizmoManager.attachToMesh(mesh);
```

All the internal gizmo's are accessible through the manager to support scenarios such as listening to drag events.
```
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
```
gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = false;
```
Note: This is not supported on the scale gizmo

[**Example**](https://www.babylonjs-playground.com/#4TBMBR#33)
# Setup

Gizmos are displayed by a [UtilityLayerRenderer](/How_To/UtilityLayerRenderer) to not disrupt the existing scene state. If not specified, the default utility layer will be used.

The utility layers are independent of the scene or engine. After creating a gizmo it is exposed off of gizmo.gizmoLayer. If creating a gizmo without specifying a utility layer it will use the default utility layer’s UtilityLayerRenderer.DefaultUtilityLayer (for overlay gizmos like position/scale) and UtilityLayerRenderer.DefaultKeepDepthUtilityLayer (for occluded gizmos like bounding box) It is recommended to use these layers and reuse layers for most cases as every new utility layer comes with additional overhead.

```
var utilLayer = new BABYLON.UtilityLayerRenderer(scene);
var gizmo = new BABYLON.AxisDragGizmo(new BABYLON.Vector3(1,0,0), BABYLON.Color3.FromHexString("#00b894"), utilLayer);
```
When created, the gizmo will not be attached to a node and will not be visible so the gizmo can be attached to a node to become active. Setting this to null will disable/hide the gizmo once again.
```
gizmo.attachedMesh = sphere;
```
By default, the gizmo will be updated to match the attached node's rotation and position but these can be modified with the following
```
// Keep the gizmo fixed to world rotation
gizmo.updateGizmoRotationToMatchAttachedMesh = false;
gizmo.updateGizmoPositionToMatchAttachedMesh = true;
```
[GLTF example](https://playground.babylonjs.com/#8GY6J8#20)
# Position, scale and rotation gizmos

Default gizmos for position, rotation and scale on a single axis are supported

 - [AxisDragGizmo](https://www.babylonjs-playground.com/#31M2AP#9)
 - [AxisScaleGizmo](https://www.babylonjs-playground.com/#31M2AP#10)
 - [PlaneRotationGizmo](https://www.babylonjs-playground.com/#31M2AP#11)

Snapping can be enabled on any of the single axis gizmos

```
gizmo.snapDistance = 0.3;
gizmo.onSnapObservable.add((event)=>{
    console.log(event);
})
```

A sensitivity factor can be customized for AxisScaleGizmo and ScaleGizmo. Default is 1, a higher value means more stretch for the same drag.
```
gizmoScale.sensitivity = 3;
```

These gizmo's internally use a [pointerDragBehavior](/How_To/MeshBehavior), this is exposed and can be used perform tasks before/during/after dragging a gizmo
```
gizmo.dragBehavior.onDragObservable.add(()=>{
    console.log("drag");
})
```

Classes for 3 axis gizmos are also provided which contain 3 of the single axis gizmos within 

 - [PositionGizmo](https://www.babylonjs-playground.com/#31M2AP#6)
 - [ScaleGizmo](https://www.babylonjs-playground.com/#31M2AP#8)
 - [RotationGizmo](https://www.babylonjs-playground.com/#31M2AP#7)

The single axis gizmos within these are exposed via the xGizmo, yGizmo and zGizmo properties. The scale gizmo also has a uniformScaleGizmo property which references center gizmo used to uniformly scale.

# Bounding box Gizmo

The BoundingBoxGizmo displays a bounding box around an object as well as controls to rotate and scale the object.

The enabled rotation axis can be customized with the following:
```
// only enable rotation on x and y axis
gizmo.setEnabledRotationAxis("xy");
```

The size of rotation and scale controls on the gizmo can be adjusted by using the following controls:
```
// The size of the rotation spheres attached to the bounding box (Default: 0.1)
gizmo.rotationSphereSize = 0.1;
// The size of the scale boxes attached to the bounding box (Default: 0.1)
gizmo.scaleBoxSize = 0.1;
// If set, the rotation spheres and scale boxes will increase in size based on the distance away from the camera to have a consistent screen size (Default: false)
gizmo.rotationSphereSize = false;
```

The following events are fired when dragging occurs on either the scale or rotation meshes of the bounding box.
```
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

To drag around objects contained inside a bounding box, [Mesh Behaviors](/How_To/MeshBehavior) can be attached.
When using with models with complex geometry such as a custom GLTF file, the complex model should be set to not be pickable by pointers and wrapped in a pickable bounding box mesh to save on performance. A helper method to do this is provided.
```
var boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(gltfMesh);
```

Additionally, the bounding box can ignore children of the attached mesh to add additional performance gain when needed.
```
gizmo.ignoreChildren = true;
```

To only ignore certain children when computing the bounding box, the includeChildPredicate can be set.
```
gizmo.includeChildPredicate = (m)=>{return m == sphere2};
```
[Example](https://www.babylonjs-playground.com/#SG9ZZB)


UI can be attached to the bounding box using the [AttachToBoxBehavior](/How_To/MeshBehavior)

[GLTF example](https://playground.babylonjs.com/#8GY6J8#20)
[Animated GLTF example](https://playground.babylonjs.com/#6E4LSB#15)
[Example](https://www.babylonjs-playground.com/#DEYAQ5#47)

# Gizmo customization

To customize the visual appearance of an existing gizmo, create a mesh on the same utility layer and then setCustomMesh on the gizmo. Utility layers do not contain lights by default so it is recommended use a material with an emissive texture.
```
var customMesh = BABYLON.MeshBuilder.CreateBox("", {size: 0.1}, gizmo.gizmoLayer.utilityLayerScene)
customMesh.material = material
gizmo.setCustomMesh(customMesh)
```
[Example](https://playground.babylonjs.com/#7KX2R8#133)

