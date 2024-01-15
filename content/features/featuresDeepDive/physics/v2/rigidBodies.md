---
title: Physics V2 core concepts
image: 
description: All the concepts and objects designed for Physics V2 plugins
keywords: shape, body, material
further-reading:
    - title: How To Use Forces
      url: /features/featuresDeepDive/physics/forces
video-overview:
video-content:
---

## Core concepts

A physics engine enables a game engine to simulate how real-world objects would behave. This means objects will fall down due to gravity, collide and bounce off each other. The simulation used by Havok is sometimes called a *rigid body* simulation, which is simply a term which means objects which don't change shape due to squashing or stretching.

The most basic object in the physics engine is a body (`PhysicsBody`), which can be associated with a `TransformNode` - a body represents an object in the simulation; the simulation will process all the bodies, attempt to make them behave in a physically realistic manner and then update the `TransformNode` to match the position of the simulated body. The most obvious way it does this is that the engine performs collision detection to prevent bodies from intersecting. In order for a pair of bodies to detect collisions, the bodies each need a shape; however, collision detection can require a lot of calculations, so, rather than using the visual meshes of an object, the `PhysicsBody` has a shape (`PhysicsShape`) which is usually simpler than the render meshes and enable the engine to minimize the amount of calculations necessary to simulate the world. Shapes are described in more detail in a [future chapter](/features/featuresDeepDive/physics/shapes).

Bodies and shapes have properties which approximate how they behave in the real world. Bodies have a mass distributions and velocities. The velocity is the speed the body is moving at, while the mass distribution describes how the velocity changes when two bodies interact.Shapes themselves are geometric objects which is used for detecting when bodies are colliding with each other; these shapes additionally have material properties (`PhysicsMaterial`) such as friction and restitution (which describe how a collision affects the bodies when sliding and bouncing) and a density (which can be used to calculate the mass properties).

The final important object is a constraint (`PhysicsConstraint`) which allows you to link two bodies together in some manner. Two bodies linked together by a constraint still behave like independent bodies, but their movement is restricted by the constraint. A common example of a constraint is a door hinge, which allows one of the bodies to rotate around the hinge axis. Constraints are covered in more detail in a [future chapter](/features/featuresDeepDive/physics/constraints).


## Body

A physics body is a virtual object that represents a physical object in a simulation, with properties like mass, position, and velocity. When you interact with the physics engine, you'll usually be working with bodies. The first thing you need to consider is a body's *motion type*.

### Motion type

There are three kinds of motion type (`PhysicsMotionType`) a body can have.

Static bodies are bodies which never move. Use this motion type for your terrain or any kind of object which should not move, but should still affect other bodies in the engine.

Dynamic bodies, on the other hand, are bodies which *can* move. You can apply forces to these bodies and change their velocities yourself. When stepping the physics engine, the velocity of a body will be taken into account when resolving collisions and constraints and, when the simulation step is complete, the position of the body will be updated.

The final motion type is *animated* - bodies with this motion type are similar to dynamic bodies; you can change their velocities and the physics engine will update the body positions. However, the difference is that bodies with an animated motion type won't be affected by any other bodies. Animated bodies will still push dynamic bodies out of the way and pull on constraints but the animated body won't be affected by those collisions. This is useful for important objects where you need them to reach a particular goal - e.g. an elevator which should always reach the correct floor, no matter how many other bodies are inside the elevator.

### Sleep mode

When creating a body, you can request that it starts in *sleep mode*. Bodies in this mode will have their physic calculations skipped until the engine needs them to collide with another body or if a force is applied to them. This can improve performance if you're loading a scene where you know the bodies are at rest. However, *sleep mode is not an absolute guarantee*. Other factors, such as a nearby not-sleeping body can cause the body to wake up from this mode, so avoid having behavior that depends on it, and use it only as an aid to performance. Even if you don't request a body to start in sleep mode, the physics engine will automatically put bodies to sleep when they have come to rest and wake those bodies up when appropriate.

<Playground id="#KJ0945#1" title="Sleep mode" description="Shows how sleep mode has influence on created bodies dynamics"/>

### Creating a body

You can create a body using the `PhysicsBody` constructor. It takes the `TransformNode` associated with that body, a motion type (static vs dynamic vs animated), a boolean representing if the body will start in sleep mode or not, and a scene (which needs to have an active Physics Engine).

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere");
const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
```

<Playground id="#RQIZD3#1" title="Add bodies" description="Add bodies on demand"/>

<Playground id="#MZCQC4" title="Clone" description="Cloned mesh with attached body also duplicates physics properties"/>

### Setting the mass of a body

A body has a *mass properties* which affect how it responds to the physics stimuli. 

The mass properties are: *mass*, which determines how "heavy" an object is, *center of mass*, which determines the point that a body spins around, *inertia*, which is similar to mass, but describes how far away the mass is distributed from the center of mass, affecting rotations, and *inertia orientation* which determines the axes that a body spins around.

Some physics engines, such as Havok, can automatically determine the mass properties of a body from the body's shape, so it is very common to supply only the mass parameter and allow the rest of the properties to be derived by the engine (although the engine will also compute a mass if one is not provided)

These mass properties are very important for achieving physically-realistic behaviour. An object with an incorrect inertia or center of mass will appear to rotate in an unnatural way, while a body with an incorrect mass might appear to be unnaturally heavy (or light!)

```javascript
// Setting only the basic mass properties
const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
body.setMassProperties({
  mass: 1,
});
```

```javascript
// Setting the full mass properties. ONLY DO THIS IF YOU KNOW WHAT YOU'RE DOING!
const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);
body.setMassProperties({
  mass: 1,
  centerOfMass: new BABYLON.Vector3(0, 1, 0),
  inertia: new BABYLON.Vector3(1, 1, 1),
  inertiaOrientation: new BABYLON.Quaternion(0, 0, 0, 1)
});
```
<Playground id="#JVZAFL#1" title="Center of mass" description="Shos how the center of mass influences body motion"/>

### Instanced bodies

For meshes composed of [thin instances](/features/featuresDeepDive/mesh/copies/thinInstances), the body created by the engine is composed of multiple internal body instances. This allows faster rendering along with the physics simulation. All instances must have the same shape, but they can have their own individual mass, have forces and constraints individually applied to them, etc. Methods that can be applied at instance level have an optional `instanceIndex` parameter that receives the index of the instance where the method will be applied to. If no `instanceIndex` is provided, the method will be applied to all instances. An example is here:

```javascript
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere");

// This generates 3 thin instances based on the sphere mesh
sphere.thinInstanceAddSelf();
sphere.thinInstanceAddSelf();
sphere.thinInstanceAddSelf();

const body = new BABYLON.PhysicsBody(sphere, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);

// Apply a vertical force on all the 3 spheres
body.applyForce(new BABYLON.Vector3(0, 100, 0), new BABYLON.Vector3(0, 0, 0));

// Apply a horizontal force to the first sphere ONLY
body.applyForce(new BABYLON.Vector3(100, 0, 0), new BABYLON.Vector3(0, 0, 0), 0); 
```

> ⚠️ Important: When setting the instance matrix using the `thinInstanceSetBuffer` method, you have to set the last argument as `false`. This makes it so the instance buffers are not static, which allows them to be changed by physics. So, the expected setBuffer call should be:
 ```
 box.thinInstanceSetBuffer("matrix", matricesData, 16, false);
 ```

<Playground id="#MZKDQT#5" title="Instances" description="How to use instances with physics" isMain={true} category="Physics"/>

<Playground id="#BJZ39H#2" title="Pendulum Instances" description="Pendulum Instances"/>

#### Limitations

There are a few limitations when using instanced bodies in this way. Currently, it is not supported to have different scales on each thin instance's matrix. It is also not supported to have transformations at the mesh level, i.e, the instanced mesh's position, rotation and scale values have to be the default.

## Shape

A physics shape is a virtual representation of the collision geometry of a physics body, used for collision detection and response. If multiple bodies share the same or similar enough geometry, the same shape can be reused for all of them, greatly increasing performance. A body needs a shape to be able to collide with other objects.

```javascript
const shape = new BABYLON.PhysicsShapeSphere(
  new BABYLON.Vector3(0,0,0), // center of the sphere in local space
  0.5, // radius of the sphere
  scene // containing scene
);
body.shape = shape;
body2.shape = shape;
body3.shape = shape;
// ...
```

The Shape types supported by the V2 Plugin are:

| Enum | Description | Image | Havok plugin support |
| --- | --- | --- | --- |
| SPHERE | Simple sphere | ![Sphere Shape](/img/features/physics/sphere_shape_viewer.png) | ✅ |
| CAPSULE | A cylinder with a half sphere at top and bottom | ![capsule Shape](/img/features/physics/capsule_shape_viewer.png) | ✅ |
| CYLINDER | Cylinder | ![cylinder Shape](/img/features/physics/cylinder_shape_viewer.png) | ✅ |
| BOX | Box | ![box Shape](/img/features/physics/cube_shape_viewer.png) | ✅ |
| CONVEX_HULL | A convex hull is the smallest convex shape containing points.| ![convex_hull Shape](/img/features/physics/convex_hull_shape_viewer.png) | ✅ |
| MESH | Mesh used for rendering or a simpler version | ![mesh Shape](/img/features/physics/mesh_shape_viewer.png) | ✅ |
| CONTAINER | Holder of other shapes | ![container Shape](/img/features/physics/compound_shape_viewer.png) | ✅ |
| HEIGHTFIELD | A height field mesh is a 2D surface with height data. | | 🟥 |

[This page contains more detail about shapes and their parameters.](/features/featuresDeepDive/physics/shapes)

## Material

A Material holds friction and restitution and is associated with a Physics Shape.

Friction is a measure of how much resistance to sliding exists between two objects in contact. It describes how much force is needed to move an object against another surface or how much it will slide along that surface. Friction is often used to model the behavior of objects sliding, rolling, or sticking to each other.

Restitution, also known as elasticity or bounciness, is a measure of how much energy is conserved in a collision between two objects. It describes how much an object will bounce back after a collision, relative to how much it was moving before the collision. Restitution is often used to model the behavior of objects bouncing, colliding, or deforming.

Both friction and restitution are non-negative values, usually between 0 and 1, with higher values indicating greater resistance or energy conservation, respectively.

```javascript
const shape = new BABYLON.PhysicsShapeSphere(new BABYLON.Vector3(0,0,0), 0.5, scene);
const material = {friction: 0.2, restitution: 0.3};
shape.material = material;
```

## Disposing of your elements

When a Body or Shape is not needed anymore, it is good practice to dispose of it. This ensures that the Physics Engine doesn't waste time processing what it doesn't need to. You can dispose of them by calling the `dispose` method.

When a node associated to a Body is disposed, the corresponding Body is also disposed. However, *the shape used by the body is not automatically disposed*, as the same shape can be used by multiple bodies.

```javascript
const shape = new BABYLON.PhysicsShapeSphere(
  new BABYLON.Vector3(0,0,0), // center of the sphere in local space
  0.5, // radius of the sphere
  scene // containing scene
);
body.shape = shape;
body2.shape = shape;
body3.shape = shape;

// ...

// When disposing of the scene:
body.dispose();
body2.dispose();
body3.dispose();

// Don't forget to also dispose of the shape when it's not needed anymore!
shape.dispose();
```

## SetTargetTransform

SetTargetTransform is a method available on the PhysicsBody that takes in a target position and orientation, and sets the velocity of the body to reach that target. It is useful when you have the information about where the body should be, and don't want to have to calculate its velocity. This method is more commonly used with animated bodies.

<Playground id="#FLCVX1#2" title="SetTargetTransform" description="Playground showing how to use the setTargetTransform method to rotate a body"/>
