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

[babylon-box3d](https://github.com/Pryme8/babylon-box3d) brings [Box3D](https://github.com/erincatto/box3d) to Babylon.js. Box3D is Erin Catto's 3D successor to Box2D v3: an MIT licensed rigid body engine with a soft step solver, continuous collision, cross platform determinism and SIMD. The package ships the engine compiled to WebAssembly together with `Box3DPlugin`, an implementation of the physics v2 plugin interface. It supports most of the Physics V2 API (`PhysicsAggregate`, `PhysicsBody`, `PhysicsShape`, constraints, events, ray casts), so scenes written for the Havok plugin generally run on it without changes. The differences that can change how a scene behaves are listed under [Limitations](#limitations).

## Features

- Static, animated and dynamic bodies, thin instances, pre step teleport and action modes
- Sphere, capsule, cylinder, box, convex hull, mesh, height field and container shapes
- Ball and socket, hinge, prismatic, slider, lock and distance constraints with limits, velocity and position motors
- `Physics6DoFConstraint` and `SpringConstraint`, mapped onto the closest Box3D joint with Havok's axis rules: twist limits, a swing cone and one sided hinge limits carry over, which covers ragdolls
- Mass properties with Havok's semantics, including inertia per unit mass and locked rotation axes
- Collision started, continued and finished events, trigger events, per body observables, Havok's event mask bits
- Ray casts with membership and collide masks
- Box3D extras: explosions, wheel joints with suspension and steering, parallel joints, collision groups, rolling resistance
- An optional threaded build that runs one world step across several worker threads, with identical results

## Limitations

Box3D is a different engine, so parts of the API map onto it approximately and a few do not map at all:

- `PhysicsCharacterController` is not supported yet: it depends on Havok internals.
- `MESH` shapes are for static and animated bodies and `HEIGHTFIELD` shapes for static ones, as in Box3D itself. A dynamic body needs convex shapes, or a `CONTAINER` of them.
- `BOX`, `CYLINDER` and `CONVEX_HULL` are built as Box3D convex hulls. A cylinder is a 16 sided prism, and a hull above Box3D's limit of 128 vertices, faces or edges is simplified until it fits.
- Box3D has a fixed set of joints, so a `Physics6DoFConstraint` becomes the one its axes describe: weld, revolute, spherical, prismatic or distance. The swing cone is symmetric (the larger of the `ANGULAR_Y` and `ANGULAR_Z` ranges is used) and at most 90 degrees, limit stiffness and damping become one softness for the whole joint, and a motor on an axis the chosen joint does not have does nothing. Combinations that match no joint fall back to the closest one or leave the bodies unconstrained, and say so once in the console.
- `COLLISION_CONTINUED` comes from Box3D's hit events. It is reported when two shapes hit each other faster than 1 m/s, not on every step they stay in contact, and its `impulse` holds that approach speed.
- The queries only the Havok plugin has, `shapeCast`, `shapeProximity` and `pointProximity`, have no equivalent. Ray casts are supported.

## Usage

### Installation

```
npm add @babylonjs/core babylon-box3d
```

```typescript
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent"; // adds scene.enablePhysics
import { Box3D, Box3DPlugin } from "babylon-box3d";

const box3d = await Box3D();
scene.enablePhysics(new Vector3(0, -9.81, 0), new Box3DPlugin(true, box3d));
```

`scene.enablePhysics` comes from the side effect import `@babylonjs/core/Physics/joinedPhysicsEngineComponent`, which `babylon-box3d` does not import. An app that imports Babylon module by module, as above, needs that line once. Without it `scene.enablePhysics` is either missing (`scene.enablePhysics is not a function`) or, in recent Babylon 9 releases, a stub that does nothing, so the first physics body throws `No Physics Engine available.` Importing from the `@babylonjs/core` index includes it.

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
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import "@babylonjs/core/Physics/joinedPhysicsEngineComponent";
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
  // a classic script cannot use await at the top level, so the setup runs in an async function
  (async () => {
    const box3d = await Box3D();
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLONBOX3D.Box3DPlugin(true, box3d));
    // create physics bodies from here on
  })();
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

  // Box3D's Large Pyramid benchmark, the pyramid in the performance tables below: a 2D pyramid of unit boxes, rows
  // boxes wide at the base. 20 rows is the 210 box scene, 50 rows the 1275 box one.
  const rows = 20;

  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2 + 0.6, Math.PI / 2.6, rows * 1.6 + 10, new BABYLON.Vector3(0, rows * 0.4, 0), scene);
  camera.attachControl(canvas, true);
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  const box3d = await Box3D();
  const plugin = new BABYLONBOX3D.Box3DPlugin(true, box3d);
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), plugin);

  // the benchmark's ground slab, friction and restitution
  const groundSize = Math.max(40, rows * 2 + 20);
  const ground = BABYLON.MeshBuilder.CreateBox("ground", { width: groundSize, height: 1, depth: groundSize }, scene);
  ground.position.y = -0.5;
  new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { mass: 0, friction: 0.6, restitution: 0 }, scene);

  const h = 0.5;
  for (let i = 0; i < rows; i++) {
    const material = new BABYLON.StandardMaterial("row" + i, scene);
    material.diffuseColor = BABYLON.Color3.FromHSV((i * 15) % 360, 0.55, 0.9);
    material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    for (let j = i; j < rows; j++) {
      const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
      box.position.set((i + 1) * h + 2 * (j - i) * h - h * rows, (2 * i + 1) * h, 0);
      box.material = material;
      // 1 tonne, a unit box at the benchmark's density of 1000
      new BABYLON.PhysicsAggregate(box, BABYLON.PhysicsShapeType.BOX, { mass: 1000, friction: 0.6, restitution: 0 }, scene);
    }
  }

  // click it to blow a crater in it
  scene.onPointerDown = (event, pick) => {
    if (pick.hit) {
      plugin.explode(pick.pickedPoint, 6, 25000, 3);
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
