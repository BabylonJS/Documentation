---
title: Getting Started - Chapter 2 - Making Copies
image: 
description: Continue your Babylon.js learning by making copies of meshes.
keywords: getting started, start, chapter 2, copy, duplicate, copies
further-reading:
video-overview:
video-content:
---

# Getting Started - Making Copies

## Copying Meshes
The two main ways to copy a mesh is to clone it or create an instance of it. Cloning gives you an independent copy of a mesh whereas an instance is still linked to the original for its material. You cannot change the material of an instance of a mesh. There are also advanced ways of creating copies which are available in the *Mesh Chapter*

To clone the house use

```javascript
clonedHouse = house.clone("clonedHouse")
```
and for an instance it is
```javascript
instanceHouse = house.createInstance("instanceHouse")
```

As at this point in our world all the houses will use the same material we will go with *createInstance*.

Before we do that we combine the building functions to produce a house of width 1 or 2, a detached or semi-detached house respectively.

<Playground id="#KBS9I5#77" title="Expanding the House Building Function" description="A playground expanding the house building function to accept a width of 1 or 2 for a detached or semi-detached house." image="/img/playgroundsAndNMEs/gettingStartedCopies1.jpg"/>

We now enlarge the ground and increase the camera radius a little to fit several house on and be able to view them.
To begin we build one house of each type and position them. Afterwards we will create instances of these for the remaining houses. After deciding on the type, position and orientation for the other houses we will use a loop to create the them.

```javascript
const houses = [];

for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
        houses[i] = detached_house.createInstance("house" + i);
    }
    else {
        houses[i] = semi_house.createInstance("house" + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
}
```

<Playground id="#KBS9I5#78" title="Creating Multiple House Instances" description="A playground demonstrating how to create instances of a 3D object." image="/img/playgroundsAndNMEs/gettingStartedCopies2.jpg"/>

![Village 1](/img/getstarted/village1.png)

As before, in order to keep the upper parts of the playground editor for newer code we will put the building of these houses into a function.

<Playground id="#KBS9I5#79" title="Wrapping Instances Into a Function" description="Wrapping the house instancing loop into a function." image="/img/playgroundsAndNMEs/gettingStartedCopies2.jpg"/>

Now the world we are building is a little more complex let's take a file of the village and re-visit viewing it as part of a web site we want to enhance.

<Playground id="#KBS9I5#80" title="Importing the Village as a .glb File" description="An example of how to load a .glb of the starting village into your scene." image="/img/playgroundsAndNMEs/gettingStartedCopies2.jpg"/>




