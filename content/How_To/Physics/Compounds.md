---
title: Compound Bodies
image: 
description: Learn all about physics compound bodies in Babylon.js.
keywords: diving deeper, phyiscs, compound boides
further-reading:
    - title: How To Use The Physics Engines
      url: /features/divingDeeper/physics/usingPhysicsEngine
    - title: How to use Forces
      url: /features/divingDeeper/physics/forces
    - title: How To Use Joints
      url: /features/divingDeeper/physics/joints
    - title: How To Use Pivots and Axes
      url: /features/divingDeeper/physics/pivotsAxes
    - title: How To Create Soft Bodies
      url: /features/divingDeeper/physics/softBodies
    - title: How To Use Advanced Features
      url: /features/divingDeeper/physics/advancedPhysicsFeatures
    - title: How To Add Your Own Physics Engine
      url: /features/divingDeeper/physics/addPhysicsEngine
video-overview:
video-content:
---

## The Skull as a Compound Body

![Skull](/img/how_to/physics/skull.jpg)
The skull is an interesting shape to try to compound and you can see it in all its magnificence here: <Playground id="#UKNERM#0" title="Skull As A Compound Body" description="Simple example of the skull as a compound body."/>

It is roughly composed of a sphere for most of it with a box around the jaw area, with a bit of work involved to position the sphere and box as best as possible. The skull is compounded to these two covering meshes.

![Compound Skull](/img/how_to/physics/greenSkull.jpg)

**Note** Center of mass is at the origin of the compound object.

## Compound to Empty Mesh

1. Create an empty mesh to be used as a parent for the compound body;
2. Create a range of appropriately shaped standard meshes to fit over the irregular mesh;
3. Parent the standard meshes and the irregular mesh to the empty mesh;
4. Calculate or estimate the mass for each standard mesh;
5. Create physics imposters for each standard mesh with zero mass;
6. Create a physics imposter for the empty mesh, using the NoImposter property, with the total mass of all the standard meshes.

**Note** Step 3 MUST come before step 4 and step 5 before step 6.

<Playground id="#492ZK0#7" title="Skull As A Compound Body 1" description="Simple example of a skull as a compound body."/>

## Compound Covering Meshes to The Complex Mesh 

1. Create a range of appropriately shaped standard meshes to fit over the irregular mesh;
2. Parent the standard meshes to the irregular mesh;
3. Calculate or estimate the mass for each standard mesh;
4. Create physics imposters for each standard mesh with zero mass;
5. Create a physics imposter for the irregular mesh, using the NoImposter property, with the total mass of all the standard meshes.

**Note** Steps 2, 4 and 5 must be in that order.

<Playground id="#492ZK0#12" title="Skull As A Compound Body 2" description="Simple example of a skull as a compound body."/>


## Compound to One of the Covering Meshes

1. Create a range of appropriately shaped standard meshes to fit over the irregular mesh;
2. Choose one standard mesh and parent the other standard meshes and the irregular mesh to this mesh;
3. Calculate or estimate the mass for each standard mesh;
4. Create physics imposters for each standard mesh with the assumed mass;

**Note** Step 2 MUST come before step 4.

<Playground id="#492ZK0#8" title="Skull As A Compound Body 3" description="Simple example of a skull as a compound body."/>