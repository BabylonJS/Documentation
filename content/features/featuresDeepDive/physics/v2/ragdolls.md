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

A ragdoll is a physicalized system that controls a skeleton and its skinned mesh. That system is composed of shapes for collision detection and constraints between these shapes.
A shape can be used for multiple bones and is big enough to contain the skinned geometry deformed this these bones.
Defining a ragdoll consists in listing each physic shape in the system, which bone it's controlling and some properties like shape size, rotation axis constraint.
Current implementation does not allow automatic size computation.

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

In this example, 3 shapes are created: 1 for root bone, 2 for arm_r and arm_l. As properties for arms are the same because symetrical, no need to set 2 entries in the configuration.
`size` property is used if `depth`, `width` or `height` are not set. 
`rotationAxis` defines the axis that will be constrained in angles. `min` and `max` define these limits.
`boneOffsetAxis` set the axis used to offset the shape on. `boxOffset` is the world size value to shift the shape along the axis. By default, physics shapes are centered on the bone.
This offset allows to have the shape to have one of its side on the bone.

```javascript
const ragdoll = new BABYLON.Ragdoll(skeleton, newMeshes[0], config);
```

Next step is to create the ragdoll instance. This is done in 1 line and user must provide the skeleteon, the skinned mesh and the configuration.

At any moment after, to make the ragdoll dynamicaly updated, call:

```javascript
ragdoll.ragdoll();
```

Dispose the ragdoll to stop it.

<Playground id="#V6FLZP#1" title="Bunny ragdoll" description="Ragdoll sample using a bunny plush" isMain={true} category="Physics"/>

