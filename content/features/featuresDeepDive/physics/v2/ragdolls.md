---
title: Ragdolls
image:
description: A guide on ragdoll creation with the Physics V2 API
keywords: diving deeper, physics, ragdoll
further-reading:
video-overview:
video-content:
---

# Ragdolls

## Defining a ragdoll

A ragdoll is a physicalized system that controls a skeleton and its skinned mesh. That system is composed of shapes for collision detection and constraints between those shapes.
A shape can be used for multiple bones and is large enough to contain the skinned geometry deformed by those bones.
Defining a ragdoll consists of listing each physics shape in the system, which bone it is controlling, and some properties such as shape size and rotation axis constraints.
The current implementation does not allow automatic size computation.

```javascript
const config = [
            { bones: ["root"], size: 0.6, boxOffset: 0.1 },
            // Arms.
            {
                bones: ["arm_r", "arm_l"],
                depth: 0.3,
                size: 0.3,
                width: 0.6,
                rotationAxis: BABYLON.Axis.Z,
                min: -1,
                max: 1,
                boxOffset: 0.3,
                boneOffsetAxis: BABYLON.Axis.X
            }
            ...
```

In this example, 3 shapes are created: 1 for the root bone and 2 for arm_r and arm_l. Because the properties for the arms are the same due to symmetry, there is no need to set 2 entries in the configuration.
`size` property is used if `depth`, `width` or `height` are not set. 
`rotationAxis` defines the axis whose angles will be constrained. `min` and `max` define those limits.
`boneOffsetAxis` sets the axis used to offset the shape. `boxOffset` is the world-size value used to shift the shape along that axis. By default, physics shapes are centered on the bone.
This offset allows one side of the shape to sit on the bone.

```javascript
const ragdoll = new BABYLON.Ragdoll(skeleton, newMeshes[0], config);
```

The next step is to create the ragdoll instance. This is done in one line, and the user must provide the skeleton, the skinned mesh, and the configuration.
Once instantiated, the ragdoll is in Kinematic mode: physicalized bones can interact with other physics bodies, but the animation drives the physics.

At any point after that, to make the ragdoll update dynamically, call:

```javascript
ragdoll.ragdoll();
```

Dispose the ragdoll to stop it.

## Interactions

Get the aggregate associated with a bone with the `getAggregate` function. The returned aggregate works like any other aggregate: it is possible to get the shape or body and apply an impulse.

```javascript
ragdoll.getAggregate(0)?.body.applyImpulse(new BABYLON.Vector3(200,200,200), BABYLON.Vector3.ZeroReadOnly);
```
## Interactions

A few steps are needed to physicalize a bone:

```javascript
// attach sphere to a bone
sph.attachToBone(scene.getBoneByName("bone52"), result.meshes[0]);
// physics sphere is moved to a target (and not teleported) 
boxAggregate2.body.setPrestepType(BABYLON.PhysicsPrestepType.ACTION);
// no feedback from physics to transform
boxAggregate2.body.disableSync = true;
```

<Playground id="#HLZE74#0" title="Physicalized bone" description="Playground that loads an animated character and physicalize one bone" category="Physics"/>

## Limitations

Imported .GLTF/.GLB files only work as ragdolls in right-handed scenes. In left-handed scenes, an intermediate Transform Node is added at the root to emulate the LH/RH coordinate switch.
This intermediate transform is not supported by the ragdoll physics-to-bone conversion.

<Playground id="#V6FLZP#1" title="Bunny ragdoll" description="Ragdoll sample using a bunny plush" isMain={true} category="Physics"/>

<Playground id="#DLPNQT#0" title="Animated character" description="Ragdoll with an animated character and the ability to apply impulse" isMain={true} category="Physics"/>
