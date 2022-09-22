---
title: Pivots and Axes
image: 
description: Learn all about physics pivots and axes in Babylon.js.
keywords: diving deeper, phyiscs, joint, pivots, joint pivots.
further-reading:
    - title: How To Use The Physics Engines
      url: /features/featuresDeepDive/physics/usingPhysicsEngine
    - title: How to use Forces
      url: /features/featuresDeepDive/physics/forces
    - title: How To Use Joints
      url: /features/featuresDeepDive/physics/joints
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

# Pivots and Axes

Through the use of playgrounds this section considers how the pivot and axis parameters of the hinge joint effect the behaviour of the joint in the three physics engines 

1. Cannon.js;
2. Oimo.js;
3. Ammo.js

See [How to Use The Physics' Engines](/features/featuresDeepDive/physics/usingPhysicsEngine) for an overall view of setting up and using the three plugins.

The examples on this page a hinge joint and a main body are added to a connected axle using

```javascript
connectedAxle.physicsImpostor.addJoint(mainBody.physicsImpostor, joint);
```
the following parameters need to be set

* mainPivot: main body pivot;
* mainAxis: main body axis ;
* connectedPivot: connected axle pivot;
* connectedAxis: connected axle axis.

In all the following playgrounds the X axis is red, the Y axis green and the Z axis blue and unless clearly stated otherwise the gravity is zero. 

The main body is a purple box and the connected axle is a yellow box. Local axes are shown for both.

The purple sphere marks the position of the main pivot and is the center of rotation for the main body around the local axis of the main body. The yellow sphere marks the position of the connected pivot which is the negative of the set value for the connected pivot. 

The initial position of the main body is set by the values of the main pivot and the connected pivot and is may be shown by the slightly larger black sphere. The radius of rotation for the main body around the main pivot is determined by the value of the connected pivot.

The main body is orientated so that the connected axis and the main axis align but can be in the opposite directions.

When the position and orientation of the bodies' imposters set by their pivots do not match the position of the bodies' meshes then, at the start, movement of the bodies can occur as the meshes re-position to that given by the pivots. 

**Note** In some instances pivot and axes in `Cannon.js` can result in the an axis or movement of the body in the opposite direction to those of `Oimo.js` and `Ammo.js`.

The first and second set of playgrounds show examples when the mass of the connected axle is zero. In the first set the connected axle is positioned at the origin with no rotation. In the second the connected axle one or both of position or rotation can be non-zero. In the third set of examples both the body and the axle have a non-zero mass.

## Playground Examples  - Connected Axle Has Zero Mass and is at the Origin with No Rotation

(A) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(0, 0, 0),  
connectedPivot: new BABYLON.Vector3(0, 0, 0), 
mainAxis: new BABYLON.Vector3(0, 1, 0), //
connectedAxis: new BABYLON.Vector3(0, 1, 0)
```

<Playground id="#8RQJ1R#2" title="Pivots and Axes (A Parameters)" description="Simple example of pivots and axes with A parameters."/>

----

(B) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(0, 5, 0), //set main body position
connectedPivot: new BABYLON.Vector3(0, 0, 0),
mainAxis: new BABYLON.Vector3(0, 1, 0),
connectedAxis: new BABYLON.Vector3(0, 1, 0)
```
<Playground id="#8RQJ1R#3" title="Pivots and Axes (B Parameters)" description="Simple example of pivots and axes with B parameters."/>

----

(C) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(0, 0, 0),
connectedPivot: new BABYLON.Vector3(5, 0, 0), //adjust main body position and radius of rotation
mainAxis: new BABYLON.Vector3(0, 1, 0),
connectedAxis: new BABYLON.Vector3(0, 1, 0)
```

* <Playground id="#8RQJ1R#4" title="Pivots and Axes (C Parameters)" description="Simple example of pivots and axes with C parameters."/>

----

(D) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(10, 0, 0),
connectedPivot: new BABYLON.Vector3(0, 5, 0),
mainAxis: new BABYLON.Vector3(1, 0, 0), //different axes will orientate main body to align axes.
connectedAxis: new BABYLON.Vector3(0, 1, 0)
```
<Playground id="#8RQJ1R#5" title="Pivots and Axes (D Parameters)" description="Simple example of pivots and axes with D parameters."/>

----

(E) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(0, 0, 0), //set main body position
connectedPivot: new BABYLON.Vector3(0, 0, 0), //adjust main body position and radius of rotation
mainAxis: new BABYLON.Vector3(0, 0, 1), //different axes will orientate main body to align axes.
connectedAxis: new BABYLON.Vector3(1, 0, 0)
```
<Playground id="#8RQJ1R#6" title="Pivots and Axes (E Parameters)" description="Simple example of pivots and axes with E parameters."/>

## Playground Examples  - Connected Axle Has Zero Mass and Position or Rotation Non-Zero

Any translation or rotation of the connected axle results in the same transformation being applied to the whole hinge joint system.

(F) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(0, 0, 0),  
connectedPivot: new BABYLON.Vector3(0, 0, 0), 
mainAxis: new BABYLON.Vector3(0, 1, 0), //
connectedAxis: new BABYLON.Vector3(0, 1, 0)
```

* <Playground id="#8RQJ1R#7" title="Pivots and Axes (F Parameters)" description="Simple example of pivots and axes with F parameters."/>

----

(G) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(0, 0, 0),
connectedPivot: new BABYLON.Vector3(0, 0, 0),
mainAxis: new BABYLON.Vector3(0, 1, 0),
connectedAxis: new BABYLON.Vector3(0, 1, 0)
```
<Playground id="#8RQJ1R#8" title="Pivots and Axes (G Parameters)" description="Simple example of pivots and axes with G parameters."/>

----

(H) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(5, 0, 0),
connectedPivot: new BABYLON.Vector3(0, 0, 0), 
mainAxis: new BABYLON.Vector3(0, 1, 0),
connectedAxis: new BABYLON.Vector3(0, 1, 0)
``` 
<Playground id="#8RQJ1R#9" title="Pivots and Axes (H Parameters)" description="Simple example of pivots and axes with H parameters."/>

----

(J) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(10, 0, 0),
connectedPivot: new BABYLON.Vector3(0, 5, 0), //adjust main body position and radius of rotation
mainAxis: new BABYLON.Vector3(0, 1, 0), 
connectedAxis: new BABYLON.Vector3(0, 1, 0)
```
<Playground id="#8RQJ1R#10" title="Pivots and Axes (J Parameters)" description="Simple example of pivots and axes with J parameters."/>

----

(K) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(10, 0, 0), //set main body position
connectedPivot: new BABYLON.Vector3(0, 5, 0), //adjust main body position and radius of rotation
mainAxis: new BABYLON.Vector3(0, 0, 1), //different axes will rotate main body so stated axes align.
connectedAxis: new BABYLON.Vector3(1, 0, 0)
```
<Playground id="#8RQJ1R#11" title="Pivots and Axes (K Parameters)" description="Simple example of pivots and axes with K parameters."/>

## Playground Examples  - Connected Axle Has Non-Zero Mass and is at the Origin with No Rotation

When the position of the main body mesh is not the same as the position imposed on the impostors by the pivots or axes the body the physics will move the body from its mesh position to the position determined by the pivots and axes. This movement acts in the physics' world and so will set the hinge joint system in motion. 

In the following example the parameter setting will be applied in four situations, the last two just for fun.

  i. No Motor - main body mesh position and rotation made to be equal to that determined by pivots and axes;  
 ii. No Motor - main body mesh position and rotation different to that determined by pivots and axes;  
iii. Motor Applied - as ii.;  
 iv. Motor Applied in Non-Zero gravity - as ii.

(L) Parameter Settings
```javascript
mainPivot: new BABYLON.Vector3(0, 0, 0),  
connectedPivot: new BABYLON.Vector3(0, 0, 0), 
mainAxis: new BABYLON.Vector3(0, 1, 0),
connectedAxis: new BABYLON.Vector3(0, 1, 0)
```

<Playground id="#8RQJ1R#13" title="Pivots and Axes (L(i) Parameters)" description="Simple example of pivots and axes with L(i) parameters."/>
<Playground id="#8RQJ1R#14" title="Pivots and Axes (L(ii) Parameters)" description="Simple example of pivots and axes with L(ii) parameters."/>
<Playground id="#8RQJ1R#15" title="Pivots and Axes (L(iii) Parameters)" description="Simple example of pivots and axes with L(iii) parameters."/>
<Playground id="#8RQJ1R#16" title="Pivots and Axes (L(iv) Parameters)" description="Simple example of pivots and axes with L(iv) parameters."/>