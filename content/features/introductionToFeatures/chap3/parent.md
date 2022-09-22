---
title: Getting Started - Chapter 3 - Mesh Parents
image:
description: Learn the basics of parenting objects in your scene.
keywords: getting started, start, chapter 3, parenting, parent
further-reading:
  - title: More on Mesh Parenting
    url: /features/featuresDeepDive/mesh/transforms/parent_pivot
video-overview:
video-content:
---

# Getting Started - Mesh Parents

## Parents and Children

We are going to add a very simple car that moves through the village.

No matter how simple a car needs wheels and we have to combine the body of the car and the wheels.

![car model](/img/getstarted/carmodel.png)

Using merge meshes to combine them would result in the wheels not being able to rotate. Instead we set the body of the car as a parent of each wheel.

Before building our simple car let's take a way to set a parent and what this means.

```javascript
meshChild.parent = meshParent;
```

Any use of position, scaling and rotation on the parent will also be applied to the child. Setting the position of the child is done in the parent space, setting the rotation and scale of the child takes place in the child's local space.

You can vary the values in the following playground to see the effect on the parent and child.

<Playground id="#GMEI6U" title="Understanding Parenting" description="Simple playground to help demonstrate parenting." image="/img/playgroundsAndNMEs/gettingStartedParents.jpg"/>

Now we are ready to build the car and afterwards to animate it.

You can read more about [parenting](/features/featuresDeepDive/mesh/transforms/parent_pivot).
