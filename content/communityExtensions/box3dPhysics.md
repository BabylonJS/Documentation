---
title: Box3D Physics
image:
description: Box3D, Erin Catto's open source 3D rigid body engine, as a physics v2 plugin for Babylon.js.
keywords: extensions, physics, box3d, box2d, wasm, ragdoll, vehicle
further-reading:
  - title: Physics V2 documentation
    url: /features/featuresDeepDive/physics
  - title: Box3D repository
    url: https://github.com/erincatto/box3d
video-overview:
video-content:
---

# Box3D Physics

[babylon-box3d](https://github.com/Pryme8/babylon-box3d) brings [Box3D](https://github.com/erincatto/box3d) to Babylon.js. Box3D is Erin Catto's 3D successor to Box2D v3: an MIT licensed rigid body engine with a soft step solver, continuous collision, cross platform determinism and SIMD. The package ships the engine compiled to WebAssembly together with `Box3DPlugin`, an implementation of the physics v2 plugin interface, so everything written for the Havok plugin (`PhysicsAggregate`, `PhysicsBody`, `PhysicsShape`, constraints, events, ray casts) works unchanged.

## Features

- Static, animated and dynamic bodies, thin instances, pre step teleport and action modes
- Sphere, capsule, cylinder, box, convex hull, mesh, height field and container shapes
- Ball and socket, hinge, prismatic, slider, lock and distance constraints with limits, velocity and position motors
- `Physics6DoFConstraint` and `SpringConstraint`: the limits are mapped onto the closest Box3D joint with Havok's axis
  rules, so ragdolls with twist, cone and one sided hinge limits behave the same
- Mass properties with Havok's semantics, including inertia per unit mass and locked rotation axes
- Collision started, continued and finished events, trigger events, per body observables, Havok's event mask bits
- Ray casts with membership and collide masks
- Box3D extras: explosions, wheel joints with suspension and steering, parallel joints, collision groups, rolling resistance
- An optional threaded build that runs one world step across several worker threads, with identical results

Not supported yet: `PhysicsCharacterController`, which currently depends on Havok internals.

## Usage

### Installation

```
npm add @babylonjs/core babylon-box3d
```

```typescript
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Box3D, Box3DPlugin } from "babylon-box3d";

const box3d = await Box3D();
scene.enablePhysics(new Vector3(0, -9.81, 0), new Box3DPlugin(true, box3d));
```

The wasm file is fetched from the same folder as the loader script. With a bundler pass its URL explicitly:

```typescript
import wasmUrl from "babylon-box3d/lib/esm/box3d.wasm?url"; // vite

const box3d = await Box3D({ locateFile: () => wasmUrl });
```

The loader and the wasm are one build and have to stay together. An app that copies `box3d.wasm` into a folder of its
own has to refresh that copy whenever it updates the package, and clear its bundler's dependency cache with it; a
loader and a wasm from two builds cannot bind to each other, so the module fails to instantiate or `new Box3DPlugin`
throws naming the entry points that are missing.

### Threads

Box3D can run a world step on several threads. That needs `SharedArrayBuffer`, which a browser only gives to a [cross origin isolated](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated) page, so it ships as a second build of the wasm that is loaded only when asked for:

```typescript
import { LoadBox3D, Box3DPlugin } from "babylon-box3d";

// the threaded build where the page allows it, the single threaded one everywhere else
const box3d = await LoadBox3D({ threads: "auto" });
scene.enablePhysics(new Vector3(0, -9.81, 0), new Box3DPlugin(true, box3d, { workerCount: "auto" }));
```

The page has to be served with:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

`workerCount` counts the thread the step is called on, so 4 means this one and 3 others; `"auto"` asks for half of `navigator.hardwareConcurrency`. On a page that is not isolated the single threaded build is loaded, the worker count is clamped to 1 and the plugin explains it once in the console, so the same code runs either way. Results do not change: the same scene stepped the same number of times reaches bit identical positions at any worker count. The step is still finished when `executeStep` returns, so nothing in a scene has to be written differently.

The threads are worth asking for on scenes with thousands of awake bodies, where they take a step several times faster than one thread can. Under a few hundred they cost more than they save.

### Script tags

```html
<script src="https://cdn.babylonjs.com/babylon.js"></script>
<script src="https://unpkg.com/babylon-box3d/lib/umd/box3d.umd.js"></script>
<script src="https://unpkg.com/babylon-box3d/umd/babylon.box3d.min.js"></script>
<script>
  const box3d = await Box3D();
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLONBOX3D.Box3DPlugin(true, box3d));
</script>
```

### Playground

```javascript
// Box3D is not on the Playground's CDN list, so load the two script tags first. This is a complete scene:
// paste it over the default one and hit run.
const createScene = async function () {
  const load = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error("could not load " + src));
      document.head.appendChild(script);
    });
  await load("https://unpkg.com/babylon-box3d@0.4/lib/umd/box3d.umd.js");
  await load("https://unpkg.com/babylon-box3d@0.4/umd/babylon.box3d.min.js");

  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2.5, Math.PI / 3, 28, new BABYLON.Vector3(0, 4, 0), scene);
  camera.attachControl(canvas, true);
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  const box3d = await Box3D();
  const plugin = new BABYLONBOX3D.Box3DPlugin(true, box3d);
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), plugin);

  const ground = BABYLON.MeshBuilder.CreateBox("ground", { width: 40, height: 1, depth: 40 }, scene);
  ground.position.y = -0.5;
  new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0, friction: 0.7 }, scene);

  // Box3D's own Large Pyramid benchmark, 20 rows of it: 2870 boxes that stay where they are put
  const rows = 20;
  const extent = 0.5;
  for (let row = 0; row < rows; row++) {
    const count = rows - row;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
        box.position.set((2 * i - count + 1) * extent, (2 * row + 1) * extent, (2 * j - count + 1) * extent);
        const material = new BABYLON.StandardMaterial("mat", scene);
        material.diffuseColor = BABYLON.Color3.FromHSV((row * 15) % 360, 0.55, 0.9);
        material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        box.material = material;
        new BABYLON.PhysicsAggregate(box, BABYLON.PhysicsShapeType.BOX, { mass: 1, friction: 0.6 }, scene);
      }
    }
  }

  // click it to blow a crater in it
  scene.onPointerDown = (event, pick) => {
    if (pick.hit) {
      plugin.explode(pick.pickedPoint, 8, 4000);
    }
  };

  return scene;
};
```

### Box3D specific features

```typescript
// radial impulse on everything within 6 units
plugin.explode(position, 6, 2500);

// a car: wheel joints with suspension, steering on the front wheels and a drive motor on the rear ones
const wheel = plugin.createWheelJoint(chassisBody, wheelBody, {
  pivotA: new Vector3(1.5, -0.5, 0.8), // chassis local anchor
  axisA: Vector3.Up(), // suspension axis
  axleA: Vector3.Forward(), // axle direction in chassis space
  enableSteering: true,
  enableSpinMotor: false,
});
wheel.setSteeringAngle(0.3);
rearWheel.setSpinSpeed(-40);

// keep a body upright with a soft spring instead of locking its rotation
plugin.createParallelJoint(groundBody, chassisBody, Vector3.Up(), Vector3.Up(), 0.5, 1);

// ragdoll bones that never collide with each other
plugin.setShapeFilterGroup(boneShape, -ragdollIndex);
```

## Performance

Box3D, Havok and Oimo building the same scenes through Babylon's physics API, engine defaults, a fixed 1/60 s step and nothing rendered. Mean milliseconds per physics step, sleep on, median of 3 interleaved runs, AMD Ryzen 9 5900X, Babylon.js 9.26.1, `@babylonjs/havok` 1.3.14, oimo 1.0.9, node 24 (2026-09-17):

| Scene                          | Box3D |           Havok |            Oimo |
| ------------------------------ | ----: | --------------: | --------------: |
| Pyramid, 20 rows (210 boxes)   |  0.09 |            0.51 |             6.3 |
| Pyramid, 50 rows (1275 boxes)  |  0.98 | 7.45, collapses | 68.2, collapses |
| Pyramid, 100 rows (5050 boxes) |  28.2 | 27.5, collapses |  174, collapses |
| Pile, 1000 boxes and spheres   |  3.44 |            4.48 |            31.3 |
| Pile, 4000 boxes and spheres   |  20.9 |            22.0 |             183 |

The same Box3D scenes on the threaded build, where Havok and Oimo have no equivalent:

| Scene                          | 1 thread | 4 workers | 8 workers |
| ------------------------------ | -------: | --------: | --------: |
| Pyramid, 20 rows (210 boxes)   |     0.09 |      0.05 |      0.11 |
| Pyramid, 50 rows (1275 boxes)  |     0.98 |      0.42 |      0.34 |
| Pyramid, 100 rows (5050 boxes) |     28.2 |      7.55 |      5.72 |
| Pile, 1000 boxes and spheres   |     3.44 |      1.38 |      1.65 |
| Pile, 4000 boxes and spheres   |     20.9 |      7.21 |      6.31 |

Reading these fairly:

- Box3D keeps every pyramid standing for 30 s of simulated time, up to 100 rows, where Babylon's default Havok setup has a 50 row pyramid flat within 10 s. The stability, not the clock, is the interesting column.
- On one thread Havok's own world step is faster in the piles (15.7 ms against 19.5 ms at 4000 bodies). Box3D is ahead on the whole Babylon step because the plugin only syncs the bodies Box3D reports as moved.
- Threads are for big scenes: the 210 box pyramid is slower with 8 workers than with none.
- Every threaded run ends in the same state as the single threaded one, drift and pile height included.
- Chrome tells the same story, with one difference: there Havok's full step wins the 4000 body pile on one thread.

The harness is in the repository: `npm run bench`, `npm run bench -- --workers 4`, or `bench.html` in the demo, with full tables in [bench/results](https://github.com/Pryme8/babylon-box3d/tree/master/bench/results).

## Examples

The repository contains a showcase with a 5000 box pyramid, Box3D's human ragdoll, a drivable car and a wrecking ball demolition: `npm run demo` in a checkout, then open `http://localhost:5178/?demo=pyramid|ragdolls|car|destruction`. The dev server sends the cross origin isolation headers, so `?demo=pyramid&rows=100&workers=8` runs the 5050 box pyramid on threads and the overlay reports the worker count.

## Documentation

Full documentation, the C shim source and build instructions are in the [GitHub repository](https://github.com/Pryme8/babylon-box3d).
