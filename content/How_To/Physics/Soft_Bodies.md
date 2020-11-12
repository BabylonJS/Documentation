---
title: Soft Bodies
image: 
description: Learn all about physics soft bodies in Babylon.js.
keywords: diving deeper, phyiscs, soft bodies
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
    - title: How To Use Advanced Features
      url: /divingDeeper/physics/advancedPhysicsFeatures
    - title: How To Add Your Own Physics Engine
      url: /divingDeeper/physics/addPhysicsEngine
video-overview:
video-content:
---

# Soft Bodies
In terms of physics' engines a soft body is a body that can have its shape deformed by interactions with other bodies or forces within the physics world. Out of the three plugins available with Babylon.js soft bodies are only available using Ammo.js. There are three soft bodies you can create, the three dimensional `softbody`, the two dimensional `cloth` and the one dimensional rope. First a number of limitations need to be considered, followed by some aspects particular to soft bodies and then some examples.

See [How to Use The Physics' Engines](/divingDeeper/physics/usingPhysicsEngine) for an overall view of setting up and using the three plugins.

## Limitations
A deformation of a body can only be shown if there are sufficient vertices to produce the deformation. The number of vertices used and the need to check their positions and velocities each time step means that the number of soft bodies can be restricted to one, two or possibly three. 

Any triangular facet belonging to a mesh used as the basis for a soft body must share its vertices with any adjacent facet. If not the soft body will rip apart along unshared vertices. As an example look at the triangular facets in the diagram below

![Shared Facets](/img/how_to/physics/share.jpg)

In Mesh A the positions have new indices for each of the facets 0, 1, 2 and 3, 4, 5. This happens, for instance, in a sphere and also when a mesh is converted to a flat shaded mesh. In this case a soft body would tear along the lines 0,2 and 3,4.

In Mesh B the positions share indices for each of the facets 0, 1, 2 and 0, 2, 3. The soft body will then hold together.

To force a mesh to share vertices use

```javascript
mesh.forceSharedVertices();
```
One benefit of this is to reduce the number of vertices in the mesh. Of course there may not be enough vertices in the mesh to make a properly functioning soft body, in this case use

```javascript
mesh.increaseVertices(n);
```
where n is the number of extra vertices to be added to each side of a triangular facet. The number of facets is increased by a factor (n + 1)<sup>2</sup>. This method forces repeated vertex positions to share indices. The order to use the above two methods is always share then increase.

```javascript
mesh.forceSharedVertices();
mesh.increaseVertices(4);
```

**Note**
1. The position and rotation of the mesh must be set before its soft impostor is created;
2. A mesh used for a soft body cannot be a parent or child of another mesh.

## Options for Soft Bodies

As well as the usual optional parameters of mass, friction and restitution that can be set when creating a physics impostor there are a number peculiar to soft bodies. These come in two sets. 

Those that can be set during or after the impostor creation

* velocityIterations, positive integer, the maximum iterations used when solving for vertex velocities, default 20; 
* positionIterations, positive integer, the maximum iterations used when solving for vertex positions, default 20;
* stiffness, a float from 0 to 1, 0 very elastic, the distance between vertices is not constrained; 1 in-elastic, the distance between vertices is invariant, default 1;
* pressure, softbody only, a positive number; the higher it is the less likely the softbody will collapse onto itself, default 200; cloth and rope pressure is maintained at 0; 

and those that can only be set during creation

* margin, the collision margin around the soft body, set it around about 1/100 of the lengths of the body when needed, useful particularly to stop a cloth passing through a body, default 0;
* damping, slows down the changes in vertex positions, useful if it looks like parts of the body are vibrating, start from around 0.01;
* fixedPoints, cloth only, can be 0, 1, 2, 4, 8 or sums of these; 0 no fixed points, 1 back left corner fixed, 2, back right corner, 4 front left corner, 8 front right corner and sum to fix more than one corner, default 0.

You may have to do a trial and error on the above parameters to get the effect you want.

## The Softbody Soft Body

A softbody is a 3D soft body. To ensure that the body is not pulled apart the mesh used has to have [shared vertices](/toolsAndResources/utilities/Minimise_Vertices). This is achieved using

```javascript
mesh.forceSharedVertices()
```

It also has to have sufficient vertices to simulate the body. Where the mesh used cannot [increase the number of vertices](/toolsAndResources/utilities/Increasing_Facets) in its construction, a box for example, you use 

```javascript
mesh.increaseVertices(n);
```
 where n is the extra number of vertices to add to one side of a triangular facet. The number of facets is increased by a factor of (n + 1)<sup>2</sup>

A softbody is constructed using

```javascript
var options = {
    mass: 15,
    friction: 0.2,
    restitution: 0.3,
    pressure: 3500,
    velocityIterations: 10, 
    positionIterations: 10,
    stiffness: 1,
    margin: 0.1;
    damping: 0.05
}

new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SoftbodyImpostor, options, scene);
```

or possibly

```javascript
mesh.physicsImpostor =  new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.SoftbodyImpostor, { mass: 1, friction: 0.1}, scene);
mesh.physicsImpostor.velocityIterations = 10; 
mesh.physicsImpostor.positionIterations = 10;
mesh.physicsImpostor.stiffness = 0.9;
```
### Examples
<Playground id="#480ZBN#1" title="Softbody Example" description="Simple example of a softbody." image=""/>
<Playground id="#480ZBN#2" title="Softbody and Rigid Sphere" description="Simple example of a soft body and a rigid sphere." image=""/>


## The Cloth Soft Body

A 2D soft body. All cloth soft bodies are created from a [ground mesh](/divingDeeper/mesh/creation/set/ground) as this is already two dimensional, has shared vertices and the number of vertices can be increased by setting the subdivisions used. The usual [options](/divingDeeper/physics/softBodies#options-for-soft-bodies) are available.

The clothImpostor is created by, for example,

```javascript
cloth.physicsImpostor =  new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.ClothImpostor, {margin: 0.25, damping: 0.01}, scene);
cloth.physicsImpostor.velocityIterations = 10; 
cloth.physicsImpostor.positionIterations = 10;
cloth.physicsImpostor.stiffness = 1;
```

**Note** Using the `increaseVertices` method on a plane mesh will not provide a suitable mesh for a clothImpostor as the algorithm used to increase the vertices does not place them in the correct row by row order.

To see both sides of a cloth set `backFaceCulling = false` on the material to be applied to the ground mesh.

### Examples

<Playground id="#480ZBN#3" title="Cloth Over a Softbody" description="Simple example of a cloth over a softbody." image=""/>
<Playground id="#480ZBN#4" title="Cloth Over a Rigid Box" description="Simple example of a cloth over a rigid box." image=""/>
<Playground id="#480ZBN#5" title="Cloth Over Rigid Box With Fixed Corners" description="Simple example of a cloth over a rigid box with fixed corners." image=""/>

### Fixed Points

![Cloth Points](/img/how_to/physics/cloth.jpg)

To fix corner points of the cloth so that those points do not move use the numbers (or their sum) as shown in the diagram above.

Set the fixedPoints parameter during the construction of the cloth.

```javascript
cloth.physicsImpostor =  new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.ClothImpostor, {margin, 0.2, fixedPoints: 3}, scene);
cloth.physicsImpostor.velocityIterations = 10; 
cloth.physicsImpostor.positionIterations = 10;
cloth.physicsImpostor.stiffness = 1;
```

<Playground id="#480ZBN#6" title="Fixed Points Example" description="Simple example of a cloth over rigid box fixed at 1 + 2 = 3." image=""/>

### Anchors

As well as being able to fix the corners of a cloth in space it is also possible to anchor points on a cloth to a rigid body.

![Horizontal Cloth](/img/how_to/physics/cloth2.jpg)

Anchor points are given as a fraction across the width and height of the ground forming the cloth as shown in the diagram above.

Rotating the cloth mesh to a vertical position using

```javascript
cloth.rotate.x = -Math.PI /2
```

will place (0, 0) as the bottom left corner and (1, 1) as the top right corner.

Using 

```javascript
cloth.rotate.x = Math.PI /2
```

will place (0, 1) as the bottom left corner and (1, 0) as the top right corner.

Setting an anchor needs three required parameter plus two optional ones, as in

```
clothImpostor.addAnchor(rigidImpostor, fraction of width, fraction of height, influence, noCollisionBetweenLinkedBodies);
```

* rigidImpostor, to which the anchor points are attached. The attachments are calculated automatically by Ammo.js and depend on the position of the softImpostor and the anchor points used.
* fraction of width, from 0 to 1, fraction across width of ground mesh
* fraction of height, from 0 to 1, fraction up height of ground mesh
* influence, from 0 to 1, defaults to 1. A value of 1 fixes the distance of the anchor from the rigid body, the closer to 0 the more elastic the distance
* noCollisionBetweenLinkedBodies, default false. When true the soft body and the rigid body, it is attached to, will not detect collisions to each other.

The width and height fraction coordinates are used to determine the closest vertex within the ground mesh to those fractional coordinates.

You are able to add multiple anchors, for example 

```javascript
cloth.physicsImpostor.addAnchor(box.physicsImpostor, 0, 1);
cloth.physicsImpostor.addAnchor(box.physicsImpostor, 1, 1, 0.8);
```

<Playground id="#480ZBN#8" title="Anchoring A Cloth" description="Simple example of anchoring a cloth." image=""/>

## The Rope Soft Body

A rope is a 1D soft body. This can be constructed using a [lines mesh](/divingDeeper/mesh/creation/param/lines) or an [extruded shape](/divingDeeper/mesh/creation/param/extrude_shape) mesh. The usual [options](/divingDeeper/physics/softBodies#options-for-soft-bodies) available for both, however the use of an extruded shape requires extra parameters in the options.

### Using Lines

A lines mesh should be constructed in a straight line and an imposter constructed in the same way as for a softbody or a cloth.

```javascript
var rope = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints}, scene); 
rope.color = BABYLON.Color3.Black();
    
rope.physicsImpostor = new BABYLON.PhysicsImpostor(rope, BABYLON.PhysicsImpostor.RopeImpostor, {mass: 2}, scene);
rope.physicsImpostor.velocityIterations = 20; 
rope.physicsImpostor.positionIterations = 20;
rope.physicsImpostor.stiffness = 0.8;
```

<Playground id="#8WC6ZN" title="Rope With Fixed Ends" description="Simple example of a rope with fixed ends." image=""/>

In the following playground note the use of the margin for the rope impostor to prevent the rope cutting into the soft box.
<Playground id="#8WC6ZN#1" title="Rope With Fixed Ends Over Soft Box" description="Simple example of a rope with fixed ends over a soft box." image=""/>

### Using an Extruded Shape

The path for the extruded shape should be in a straight line and the shape and path parameters used in constructing the shape should be copied and pasted into the options for the impostor. Currently shape and path are the only two parameters that can be used when an extruded shape is used to construct a rope.

```javascript
var rope = BABYLON.MeshBuilder.ExtrudeShape("ext", {shape: myShape, path: myPoints}, scene);
rope.material = ropeMat;
    
rope.physicsImpostor = new BABYLON.PhysicsImpostor(rope, BABYLON.PhysicsImpostor.RopeImpostor, {mass: 2, shape: myShape, path: myPoints}, scene);
rope.physicsImpostor.velocityIterations = 20; 
rope.physicsImpostor.positionIterations = 20;
rope.physicsImpostor.stiffness = 1;
```
<Playground id="#8WC6ZN#2" title="Extruded Rope With Fixed Ends" description="Simple example of an extruded rope with fixed ends." image=""/>

In the following playground remember that the extruded shape does not have an impostor, that it lies on the surface of the box is because the margin for the rope is set to the radius of the extruded shape.
<Playground id="#8WC6ZN#3" title="Extruded Rope With Fixed Ends Over Soft Box" description="Simple example of an extruded rope with fixed ends over a soft box." image=""/>

### Fixed Points
Fixing the end points for a rope is the same whichever of the two meshes are used and must be set during construction. A 1 fixes the starting point of the rope, a 2 fixes the end point of the rope and 3 fixes both.

### Hooks

A hook can be added anywhere along the length of the rope using a number from 0 (start) to 1 (end) and is attached to a rigid body using

```
ropeImpostor.addHook(rigidImpostor, fraction of length, influence, noCollisionBetweenLinkedBodies);
```

where

* rigidImpostor, to which hook attached. The attachments are calculated automatically by Ammo.js and depend on the position of the ropeImpostor and the hook used.
* fraction of length, from 0 to 1, fraction across length of rope
* influence, from 0 to 1, defaults to 1. A value of 1 fixes the distance of the hook from the rigid body, the closer to 0 the more elastic the distance
* noCollisionBetweenLinkedBodies, default false. When true the rope and the rigid body, it is attached to, will not detect collisions to each other.

For example attaching a ball to the end of a rope and an crossbar to the start of a rope with influence 1,

```javascript
rope.physicsImpostor.addHook(crossbar.physicsImpostor, 0, 1);
rope.physicsImpostor.addHook(ball.physicsImpostor, 1, 1);
```

<Playground id="#8WC6ZN#4" title="Winging Ball (Lines Mesh)" description="Simple example of a swinging ball using a lines mesh." image=""/>

<Playground id="#8WC6ZN#5" title="Swinging Ball (Extruded Mesh)" description="Simple example of a swinging ball using an extruded shape mesh." image=""/>