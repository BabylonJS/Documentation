---
title: Add Your Own Physics Engine
image: 
description: Learn how to add your own physics engine to Babylon.js.
keywords: diving deeper, phyiscs, advanced physics, physics engine
further-reading:
    - title: How To Use The Physics Engines
      url: /divingDeeper/physics/usingPhysicsEngine
    - title: How to use Forces
      url: /divingDeeper/physics/forces
    - title: How To Use Joints
      url: /divingDeeper/physics/joints
    - title: How To Use Pivots and Axes
      url: /divingDeeper/physics/pivotsAxes
    - title: How To Create Compound Bodies
      url: /divingDeeper/physics/compoundBodies
    - title: How To Create Soft Bodies
      url: /divingDeeper/physics/softBodies
    - title: How To Use Advanced Features
      url: /divingDeeper/physics/advancedPhysicsFeatures
video-overview:
video-content:
---

# How To Add Your Own Physics Engine

## Define your plugin
You can create your own plugin by creating a class that provides the following interface:

* ```function initialize()```: Must initialize your engine

* ```function setGravity(gravity)```: Used by Babylon.js to set the current gravity

* ```function runOneStep(delta)```: babylon.js will call this function for each frame, giving you the delta time between current and previous frame. This is the responsibility of the plugin to update meshes' position and rotation accordingly to the physics simulation.

* ```function registerMesh(mesh, impostor, options)```: babylon.js will call this function when the user wants to create a physics impostor for a mesh. ```options``` parameter contains 3 values: ```mass```, ```friction``` and ```restitution```. Possible values for ```impostor``` are the following:
 * NoImpostor = 0;
 * SphereImpostor = 1;
 * BoxImpostor = 2;
 * PlaneImpostor = 3;
 * CompoundImpostor = 4;
 * MeshImpostor = 4;

* ```function registerMeshesAsCompound(parts, options)```: Babylon.js will call this function for compound objects. ```parts``` parameter contains an array of ```{mesh, impostor}```. ```options``` parameter is the same as above.

* ```function unregisterMesh(mesh)```: Called to remove a mesh from the simulation

* ```function applyImpulse(mesh, force, contactPoint)```: Apply a specific force to a specific contact point for a given mesh

* ```function createLink(mesh1, mesh2, pivot1, pivot2)```: Create a joint between two meshes

* ```function dispose()```: Free all allocated resources

* ```function isSupported()```: This function will be called by Babylon.js before everything else to ensure that your plugin can be instanciated (You have to check if required .js files are included for instance)

For implementation details, you can refer to cannon.js plugin: https://github.com/BabylonJS/Babylon.js/blob/master/src/Physics/Plugins/cannonJSPlugin.ts

## Using your plugin
When you launch the physics simulation, you can add a new parameter to ```enablePhysics``` function to indicate which plugin to use:

```javascript
scene.enablePhysics(null, new BABYLON.CannonJSPlugin()),
```

The first parameter can be used to define gravity (which is (0, -9.82, 0) by default).