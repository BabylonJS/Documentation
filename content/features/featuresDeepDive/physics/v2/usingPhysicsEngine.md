---
title: Using A Physics Engine
image:
description: Learn how to use one of the available physics engines in Babylon.js.
keywords: diving deeper, phyiscs
further-reading:
  - title: How To Use Forces
    url: /features/featuresDeepDive/physics/forces
  - title: How to use Joints
    url: /features/featuresDeepDive/physics/joints
  - title: How To Use Pivots and Axes
    url: /features/featuresDeepDive/physics/pivotsAxes
  - title: How To Create Compound Bodies
    url: /features/featuresDeepDive/physics/compoundBodies
  - title: How To Create Soft Bodies
    url: /features/featuresDeepDive/physics/softBodies
  - title: How To Use Advanced Features
    url: /features/featuresDeepDive/physics/advancedPhysicsFeatures
  - title: How To Add Your Own Physics Engine
    url: /features/featuresDeepDive/physics/addPhysicsEngine
video-overview:
video-content:
---

# How to Use a Physics Engine

## Introduction

Babylon.js has a plugin system for physics engines that enables the user to add physics interactions to the scene objects.
Unlike the internal collision system, a physics engine calculates objects' body dynamics and emulates "real-life" interactions between them. So if two objects collide, they will "bounce" off one another, just like you would expect from a real-life object.

The plugin system allows us to use well established physics engines and to integrate them into the render loop. Apart from very advanced usage, there is no need to interact directly with the physics engine. Babylon.js does the work for you.

## What physics engine are integrated

There are plugins for X physics engines:

1.

Each engine has its own features and its own way of calculating the body dynamics. We at Babylon.js tried collecting the common usage of all engines and provide an easy-to-use interface to them.

Once you picked an engine, do not forget to add a reference to the engine code:

1.

## Basic usage

### Enabling the physics engine

To enable the physics engine, call the scene's `enablePhysics` function:

```javascript
var scene = new BABYLON.Scene(engine);
var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
var physicsPlugin = new BABYLON.XXX();
scene.enablePhysics(gravityVector, physicsPlugin);
```

Both parameters are optional. The default parameters are shown in the example. This is the same as calling:

```javascript
scene.enablePhysics();
```

```javascript
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.XXX());
```

Calling this function will create a new BABYLON.PhysicsEngine object that will be in charge of handling the physics interactions.

The physics engine is now enabled and is running during the render loop.

## Your first physics scene

Here we present a minimal example of a physics enabled scene, utilizing [Aggregates](/features/featuresDeepDive/physics/aggregates) for faster creation:

```javascript
var createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape.
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

  // Move the sphere upward at 4 units
  sphere.position.y = 4;

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

  // initialize plugin
  var v2Plugin = new BABYLON.XXX();
  // enable physics in the scene with a gravity
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), v2Plugin);

  // Create a sphere shape and the associated body. Size will be determined automatically.
  var sphereAggregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1 }, scene);

  // Create a static box shape.
  var groundAggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene);

  return scene;
};
```

## Debugging your scene

Use the physics debug display when your scene and dynamics doesn't behave the way you think it should.
It will display geometry the way the physics engine sees the world.
There are two ways to invoke the display.

### Programmatically

```javascript
physicsViewer = new BABYLON.Debug.PhysicsViewer();
for (const mesh of scene.rootNodes) {
    if (mesh.physicsBody) {
        const debugMesh = physicsViewer.showBody(mesh.physicsBody);
    }
}
```

This snippet will create the PhysicsViewer and then will add every PhysicsBody available thanks to the scene meshes.

### Using the Inspector

** Screen capture **
