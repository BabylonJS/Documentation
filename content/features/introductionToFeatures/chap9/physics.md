---
title: Getting Started - Chapter 9 - Your First Physics Scene
image:
description: Set up Havok Physics V2 and create static and dynamic physics bodies.
keywords: getting started, start, chapter 9, physics, havok, gravity, physics aggregate
further-reading:
    - title: Physics Overview
      url: /features/featuresDeepDive/physics
    - title: Using Havok and the Havok Plugin
      url: /features/featuresDeepDive/physics/havokPlugin
    - title: Physics Aggregates
      url: /features/featuresDeepDive/physics/aggregates
video-overview:
video-content:
---

# Getting Started - Your First Physics Scene

## Add a Physics Engine

Babylon.js connects to a separate physics engine through a plugin. In this example, we use the recommended Physics V2 API with [Havok](/features/featuresDeepDive/physics/havokPlugin). Havok calculates gravity, movement, and collisions while Babylon.js renders the result.

The Babylon.js Playground loads and initializes Havok for you. There, creating the plugin and enabling physics takes two lines:

```javascript
const havokPlugin = new BABYLON.HavokPlugin();
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin);
```

The vector passed to `enablePhysics` is gravity. Its negative Y value pulls dynamic bodies downward.

In an application of your own, install both Babylon.js and Havok:

```bash
npm install @babylonjs/core @babylonjs/havok
```

Then initialize Havok's WebAssembly module before creating the plugin:

```javascript
import HavokPhysics from "@babylonjs/havok";
import { HavokPlugin, Vector3 } from "@babylonjs/core";

const havokInstance = await HavokPhysics();
const havokPlugin = new HavokPlugin(true, havokInstance);
scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);
```

Because initialization is asynchronous, the function that creates your scene must also be asynchronous. For more setup options, including script tags and CDN usage for small experiments, see [Using Havok and the Havok Plugin](/features/featuresDeepDive/physics/havokPlugin).

## Create Something to Fall

We first create a box for the ground and a sphere above it:

```javascript
const ground = BABYLON.MeshBuilder.CreateBox("ground", {
    width: 10,
    depth: 10,
    height: 0.5,
}, scene);
ground.position.y = -0.25;

const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
    diameter: 2,
}, scene);
sphere.position.y = 6;
```

These meshes describe what we see, but the physics engine also needs bodies and collision shapes. A `PhysicsAggregate` creates both for a mesh:

```javascript
const groundAggregate = new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
);

const sphereAggregate = new BABYLON.PhysicsAggregate(
    sphere,
    BABYLON.PhysicsShapeType.SPHERE,
    { mass: 1, restitution: 0.6 },
    scene
);
```

The ground has a mass of `0`, so it is **static** and stays in place. The sphere has a nonzero mass, so it is **dynamic**: gravity moves it, and it collides with the ground. The sphere's `restitution` controls how bouncy the collision is; `0.6` gives us an easy-to-see bounce.

Press **Run** in the Playground to restart the simulation and watch the sphere fall.

<Playground id="#BHS83B" title="Your First Physics Scene" description="Enable Havok physics, then drop a dynamic sphere onto a static ground."/>

## Where to Go Next

You now have the essential parts of a physics scene: an enabled engine, a static body, and a dynamic body. The [Physics V2 overview](/features/featuresDeepDive/physics) introduces the full system. Continue with [Physics Aggregates](/features/featuresDeepDive/physics/aggregates) to adjust bodies and shapes, or learn how to apply [forces and impulses](/features/featuresDeepDive/physics/forces) to make bodies move.
