---
title: Forces
image: 
description: Learn all about applying physical forces in Babylon.js.
keywords: diving deeper, phyiscs, forces
further-reading:
    - title: How To Use The Physics Engines
      url: /divingDeeper/physics/usingPhysicsEngine
    - title: How to use Joints
      url: /divingDeeper/physics/joints
    - title: How To Use Pivots and Axes
      url: /divingDeeper/physics/pivotsAxes
    - title: How To Create Compound Bodies
      url: /divingDeeper/physics/compoundBodies
    - title: How To Create Soft Bodies
      url: /divingDeeper/physics/softBodies
    - title: How To Use Advanced Features
      url: /divingDeeper/physics/advancedPhysicsFeatures
    - title: How To Add Your Own Physics Engine
      url: /divingDeeper/physics/addPhysicsEngine
video-overview:
video-content:
---

## How To Use Forces

This section gives some terminology needed to discuss the use of forces in the three physics' engines 

1. Cannon.js;
2. Oimo.js;
3. Ammo.js

as well as playground examples to check out the coding. In the playgrounds the physics' engine used can be changed by selecting which ones to comment out.

See [How to Use The Physics' Engines](/divingDeeper/physics/usingPhysicsEngine) for an overall view of setting up and using the three plugins.



## Body

Solids in physics are often referred to as `bodies`. In the simulation bodies are made up of two parts, the rendered object and the physics object. The rendered object is a mesh and the physics object, which holds the data about the body, is called a physics imposter. 

**Note:** a box imposter is often preferable when the body is a plane.

## Mass

This is the amount of matter in the body and is set when the imposter is formed. Static bodies should have a mass of zero.

```javascript
new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2 }, scene);
```

## Forces

These are gravity, impulses, friction and applied forces.

### Gravity 

In the simulations gravity is a universal force applied throughout the time of the simulation producing a gravitational acceleration. Setting a Vector3 for gravity is in fact setting the gravitational acceleration. The default value being `(0, -9.807, 0)`. Since it is a universal force it is set in the physics' engine either when it is enabled or later. 

```javascript
/*When physics is enabled use default gravity*/ 
scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
scene.enablePhysics(null, new BABYLON.OimoJSPlugin());

await Ammo();
scene.enablePhysics(null, new BABYLON.AmmoJSPlugin());

//set gravity
scene.enablePhysics(new BABYLON.Vector3(0, -5, 0), new BABYLON.CannonJSPlugin());
scene.enablePhysics(new BABYLON.Vector3(0, -5, 0), new BABYLON.OimoJSPlugin());
scene.enablePhysics(new BABYLON.Vector3(0, -5, 0), new BABYLON.AmmoJSPlugin());

/*Get and set gravity*/
var physicsEngine = scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
var physicsEngine = scene.enablePhysics(null, new BABYLON.OimoJSPlugin());

await Ammo();
var physicsEngine = scene.enablePhysics(null, new BABYLON.AmmoJSPlugin());

//Get gravity
var gravity = physicsEngine.gravity;

//Set gravity
physicsEngine.setGravity(new BABYLON.Vector3(0, -5, 0))
```

<Playground id="#YUNAST#3" title="Gravity Example" description="Simple example of using gravity in a phyics engine."/>

### Impulses

An impulse is a force applied to a body in an instance which will change the current linear velocity and/or the angular velocity of the body. Impulses acting at the center of mass of the body will not change the angular velocity.  Unless other forces act on it the body will continue with the new velocities.

An impulse is applied to a body's physics imposter.

Applying an impulse requires a vector giving the magnitude and direction of the impulse and the position vector of the contact point of the impulse. The contact point of the impulse is given in world coordinates. 

```javascript
imposter.applyImpulse(impluse_vector, contact_vector)

let localRefPoint = new BABYLON.Vector3(x, y, z);

imposter.applyImpulse(ImpulseVector, mesh.getAbsolutePosition()); //impulse at center of mass

imposter.applyImpulse(ImpulseVector, mesh.getAbsolutePosition().add(localRefPoint)); //impulse at a local point
```

The following playground is initially set up to apply an impulse at the center of mass vertically against gravity which eventually return the box to earth. Leaving the friction as 0 and applying horizontal impulses shows the continuity of movement.

<Playground id="#RHBQY9#12" title="Impulses Example 1" description="Simple example of adding impulses to objects." isMain={true} category="Physics"/>

### Friction

Friction is a property of a body and is set in the imposter and provides a continuous force between two bodies while they are in contact. You can set friction when creating an imposter and also get and set it later.

```javascript
new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 2, friction: 0.4}, scene); //on creation

var friction = imposter.friction; // get friction;
imposter.friction = 0.1; //set friction.
```

Since friction occurs at the boundary of a body, applying an impulse at the center of mass will produce an angular velocity as well as a linear velocity.

Re-visiting the following playground and setting friction on **both** bodies and applying horizontal impulses will show the angular velocity effect.

<Playground id="#RHBQY9#12" title="Impulses Example 2" description="Simple example of adding impulses to objects."/>

### Applied Forces

An applied force will only affect the body over the time period that it is applied which is the duration of the frame interval. For zero friction a sufficiently large force (to overcome inertia) applied in the first frame interval will set the body in motion. While `Cannon.js` and `Ammo.js` have a native apply force method `Oimo.js` does not and so an applying force is replaced (internally in Babylon.js) with the apply impulse method so a smaller value has a greater effect. 


```javascript
//Force Settings
var forceDirection = new BABYLON.Vector3(1, 0, 0);
var forceMagnitude = 50;
var contactLocalRefPoint = BABYLON.Vector3.Zero();

impostor.applyForce(forceDirection.scale(forceMagnitude), mesh.getAbsolutePosition().add(contactLocalRefPoint));
```

The following playground initially set up with zero friction and to apply an impulse at the center of mass horizontally in the X direction.

<Playground id="#RHBQY9#1" title="Applying Forces" description="Simple example of applying forces to objects." isMain={true} category="Physics"/>