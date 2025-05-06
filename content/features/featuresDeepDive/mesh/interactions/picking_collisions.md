---
title: Mesh Picking
image:
description: Learn how to pick meshes in Babylon.js.
keywords: diving deeper, meshes, interactions
further-reading:
  - title: Mesh Overview
    url: /features/featuresDeepDive/mesh/creation/set
video-overview:
video-content:
---

## Raycasts

The rays are like sunrays.
They are used to check collisions or intersections in the scene between meshes and points.

In the [previous tutorial](/features/featuresDeepDive/scene/interactWithScenes), we used it to select meshes with the mouse (a ray goes from camera to mouse position in 3D),
using the function `scene.pick(scene.pointerX, scene.pointerY)`.

But here we will see that we can throw ray from any point and in any direction.
For example in a shooting game at 3rd person view: collisions between our bullets and obstacles.

**Documentation of classes :**

You must first [create a ray](/typedoc/classes/babylon.ray).

The method [scene.pickWithRay()](/typedoc/classes/babylon.scene#pickwithray) throws a ray in your scene to pick a mesh.

Use the [picking info](/typedoc/classes/babylon.pickinginfo) that is returned by [scene.pickWithRay()](/typedoc/classes/babylon.scene#pickwithray).

## Detect the first mesh touched by the ray

Check out an example here: <Playground id="#KNE0O#1327" title="Get First Mesh Hit By Ray" description="Simple example of getting the first mesh hit by a ray." isMain={true} category="Mesh"/>

(The following descriptions will reference this example. All line references are from the most recent example link)

![Raycast simple](/img/how_to/raycast01.jpg)

In all our playgrounds, we will imagine that our character is the main box at the center.
It will shoot laser beams continually forward and detect which enemy (other boxes) is hit.

So with the mouse, you don't need to click but move to turn the box with this trigonometry function `mousemovef` _(line #34)_.
A ray requires when its created: an origin, a direction and a length.

First, we set `box.isPickable` to false to avoid the ray touching the box from the inside _(line #16)_.
Because we set the starting point (origin) of the ray in the center of the box.

The most important part is to get the good directional vector _(line #57)_:

```javascript
var forward = new BABYLON.Vector3(0, 0, 1);
forward = vecToLocal(forward, box);

var direction = forward.subtract(origin);
direction = BABYLON.Vector3.Normalize(direction);
```

We want the forward vector relative to the box space and orientation.
Then, to get the direction, we subtract it from the origin, the box position.
The function `vecToLocal` is designed to transform a position from a mesh point of view by multiplicating a vector by the mesh matrix.

Then, we create the ray with all elements given and a length of 100 for example _(line #65)_:

```javascript
var ray = new BABYLON.Ray(origin, direction, length);
```

Finally, we get the hit point of the ray if it touches a mesh _(line #68)_:

```javascript
var hit = scene.pickWithRay(ray);
```

And if a mesh is hit, we do what we want with the picking info like getting the mesh name, the position of the point etc...
Here we change its size because it's funnier!

**You're not forced to set `box.isPickable` to false**, if you need later to check rays intersection on this box for example.
You can set the origin point of the vector in front of the box, the direction a little further and the length that you want _(line #55)_:

 <Playground id="#KNE0O#17" title="Ray Picking Example" description="Simple example of ray picking."/>

## Predicate function

It is a filter to choose which meshes will be selectable:

<Playground id="#KNE0O#18" title="Predicate Function Example" description="Simple example of the predicate function with ray picking."/>

![Raycast predicate](/img/how_to/raycast02.jpg)

We added a new function predicate _(line #54)_:

```javascript
function predicate(mesh) {
  if (mesh == box2 || mesh == box) {
    return false;
  }
  return true;
}
```

and in parameter here:

```javascript
scene.pickWithRay(ray, predicate);
```

The isPickable false argument becomes irrelevant so we have to avoid box.
We avoid also box2 for testing and allow the rest (box3 and box4 by default).

And the result is, only box3, the second blue one behind, and box4 will grow.
So it works fine like if box2 was transparent for the ray!

There is one other optional argument to the method `pickWithRay`. It's the boolean **fastCheck** (`false` by default).
`True` will return the first mesh that intersects with the ray (in the order of the meshes array), not the closest mesh to the ray's starting point.

## Triangle predicate

Starting with Babylon.js v4.0 you can define a custom predicate to filter the triangles selected to be tested against the incoming ray. The predicate will be called with the 3 vertices of each face and the upcoming ray:

```javascript
scene.pick(scene.pointerX, scene.pointerY, null, false, null, (p0, p1, p2, ray) => {
  var p0p1 = p0.subtract(p1);
  var p2p1 = p2.subtract(p1);
  var normal = BABYLON.Vector3.Cross(p0p1, p2p1);
  return BABYLON.Vector3.Dot(ray.direction, normal) < 0;
});
```

In this example we are filtering out all the triangles that are not facing towards the camera.

Live example: <Playground id="#EES9W5" title="Triangle Predicate" description="Simple example of ray picking with a triangle predicate."/>

---

## Multi pick

We can use `scene.multiPickWithRay` if we don't want that the ray to stop at the first obstacle:

 <Playground id="#KNE0O#19" title="Get All Meshes Hit By Ray" description="Simple example of getting all meshes hit by a ray."/>

![Raycast multipick](/img/how_to/raycast02.jpg)

The picking result will be an array _(line #68)_.

We can loop through the array to change all meshes hit. In the example you can see that the two blue boxes change in size.
It's like a strong bullet!

## Alternative picking methods
Another method of picking with a ray is to directly use the **Ray class**. There is one caveat to this method, however. When using `pickWithRay`, the method will automatically transform the ray from world coordinates to local coordinates of the mesh being picked. If you want to use the **Ray class** itself, the conversion from the world coordinates of the ray to the local space of an intersecting mesh will need to be done manually. 

To do this, first create a ray and mesh to check for intersection, then convert the ray into the local space of the mesh to determine the correct intersection point on the mesh.

```javascript
// create a mesh to intersect
let box = BABYLON.MeshBuilder.CreateBox("box", {size: 1.0}, scene);

// define the ray origin, direction, and length
let origin = new BABYLON.Vector3(0.0, 0.0, 1.5);
let dir = new BABYLON.Vector3(0.0, 0.0, -1.0);
let length = 5.0;

// create the ray
let myRay = new BABYLON.Ray(origin, dir, length);

// use the ray helper to render the ray in the scene
let rayHelper = new BABYLON.RayHelper(myRay);
rayHelper.show(scene);

// transform the ray into the local space of the mesh to get an accurate intersection point - in this case we are using the inverse of the mesh's world matrix to transform
BABYLON.Ray.Transform(myRay, box.getWorldMatrix().invert())
```

Then simply check if the ray intersects the mesh and capture the picking information.

```javascript
// check to see if the ray intersects the mesh and capture the pick information
let pickingInfo = myRay.intersectsMesh(box);
```

<Playground id="#2IETSS" title="Picking a mesh with Ray.intersectsMesh" description="Simple alternative method for picking meshes."/>

## Picking Ray

Another handy feature is the createPickingRay. This special ray is cast from a camera, out to infinity, in the direction of the cursor (relative to the virtual lens). Confusing? Basically think of it as a ray that's cast out of the camera and 'aimed' by the cursor. This is another method for picking objects in your scene. Here's a playground and video to check out on the subject.

 <Playground id="#AC8XPN#81" title="Picking Ray Example" description="Simple example of using a picking ray."/>

<Youtube id="dgsWKpa7RcY"/>

## Debugging

It could be tough to understand where a ray starts and is its direction. To help you debug you can then use the RayHelper.

You can either use a static function to create and show one:

```javascript
BABYLON.RayHelper.CreateAndShow(ray, scene, new BABYLON.Color3(1, 1, 0.1));
```

or you can use a more detailled version:

```javascript
var rayHelper = new BABYLON.RayHelper(ray);
rayHelper.show(scene);
```

The helper can also be attached to a mesh to track its direction:

```javascript
var localMeshDirection = new BABYLON.Vector3(0, 0, -1);
var localMeshOrigin = new BABYLON.Vector3(0, 0, -0.4);
var length = 3;
rayHelper.attachToMesh(box, localMeshDirection, localMeshOrigin, length);
```

<Playground id="#ZHDBJ#48" title="Picking and Debugging" description="Simple example of ray picking and debugging."/>

## GPU Picking

Picking can be an expensive feature to use as the CPU has to go through all the geometries to find the closest triangle which is intersecting with the picking ray.

Starting with Babylon v8.0, you can now use the GPU for your picking needs. This will mostly be useful if you have very complex objects where scanning all the triangles will kill your performance:

```javascript
var picker = new BABYLON.GPUPicker();
picker.setPickingList(myMeshes);

scene.onPointerObservable.add(() => {
  if (picker.pickingInProgress) {
    return;
  }
  picker.pickAsync(scene.pointerX, scene.pointerY, scene, false).then((pickingInfo) => {
    if (pickingInfo) {
      console.log(pickingInfo.mesh.name);
    }
  });
});
```

As you can see you only need to create a `GPUPicker`, defines the list of pickable meshes and call the `pickAsync` function.

The system will then render the scene onto a texture and read from that texture at the give coordinates. Each mesh will be rendered with an unique color hence the picker will be able to return the picked mesh.

Thanks to the call to `setPickingList`, the picker will be able to prepare all the instances and will associate a new vertex buffer to store their unique colors.

<Playground id="#XJKQOC#14" title="GPU picking" description="Simple example of how to use GPU picking."/>

Please note that if you pick a mesh with thin instances then the `pickingInfo.thinInstanceIndex` will give you the index of the picked thin instance if any.

### GPU Multi picking

You can perform a picking operation on multiple coordinates at once by using the `picker.multiPickAsync(coordinates: IVector2Like[])`. The function will return `Promise<BABYLON.IGPUMultiPickingInfo>`. 

```typescript
export interface IGPUMultiPickingInfo {
    /**
     * Picked mesh
     */
    meshes: Nullable<AbstractMesh>[];
    /**
     * Picked thin instance index
     */
    thinInstanceIndexes?: number[];
}
```

The `meshes` property has always the length of the array of meshes you set with the  `picker.setPickingList` function so you can use index based look up for a picking hit. If the `mesh` was not picked the `meshes` property contains `undefined` at the given index. There is no difference in the `thinInstanceIndexes` property. It returns the indexes in the samy way as the `pickAsync` function does.

Before you can use multi picking you have to set the meshes you intend to pick with the `setPickingList` as you do when performing single picking.

You can use multi picking for occlusion detection like demonstreted in the following Playground:

<Playground id="#GAB1RS#63" title="GPU Multipicking example" description="Demonstrates how can you use multipicking to get occlusion statuses of multiple meshes."/>

Multi picking is optimized and always renders only a portion of the picking texture defined by the an area from min to max picking coordinates. If this are is too big you should consider calling `multiPickAsync` multiple times with smaller areas or perform `pickAsync` multiple times with a single coordinate. 

### Important

The following applies to meshes in the picking list. Due to performance reasons, checks are not performed. It is up to the user to ensure all pickable meshes follow simple rules.

* All meshes in the picking list should always be enabled.
* Mesh enabled states are not checked when picking. If you have a pickable mesh with `mesh.setEnabled(false)`, pick results will be fouled up. If you really need to disable a mesh, remove it from the picking list first, update the pick texure with `picker.setPickingList([...newList])`, then disable your mesh.
* Any instances in the picking list must also be accompanied by its root mesh, even if its not meant to be picked.
* Any instances added/removed from the picking list needs a `picker.setPickingList([...list])` to update the pick texture. If you have to dispose said instance, remove instance from the picking list first, dispose said instance and then call `picker.setPickingList([...newList])`.
* For thin instances, if you make any changes to the matrix buffer, ie, add/remove thin instances, you have to call `picker.setPickingList([...list])` to update the pick texture after.
* GPU picking works with `mesh.visibility = 0` and `mesh.material.alpha = 0` but not with `mesh.isVisible = false`.
* `renderOverlay` does not work with GPU picking for meshes (no instances/thin instances) and cloned meshes.
