---
title: Add Your Own Physics Engine
image:
description: Learn how to add your own physics engine to Babylon.js.
keywords: diving deeper, phyiscs, advanced physics, physics engine
further-reading:
  - title: How To Use The Physics Engines
    url: /features/featuresDeepDive/physics/usingPhysicsEngine
  - title: How to use Forces
    url: /features/featuresDeepDive/physics/forces
  - title: How To Use Joints
    url: /features/featuresDeepDive/physics/joints
  - title: How To Use Pivots and Axes
    url: /features/featuresDeepDive/physics/pivotsAxes
  - title: How To Create Compound Bodies
    url: /features/featuresDeepDive/physics/compoundBodies
  - title: How To Create Soft Bodies
    url: /features/featuresDeepDive/physics/softBodies
  - title: How To Use Advanced Features
    url: /features/featuresDeepDive/physics/advancedPhysicsFeatures
video-overview:
video-content:
---

# How To Add Your Own Physics Engine

## Define your plugin

You can create your own plugin by creating a class that provides the interface defined in this TypeScript file : https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/Physics/IPhysicsEngine.ts

For implementation details, you can refer to cannon.js plugin: https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/core/src/Physics/Plugins/cannonJSPlugin.ts

## Using your plugin

When you launch the physics simulation, you can add a new parameter to `enablePhysics` function to indicate which plugin to use:

```javascript
scene.enablePhysics(null, new BABYLON.CannonJSPlugin()),
```

The first parameter can be used to define gravity (which is (0, -9.807, 0) by default).
