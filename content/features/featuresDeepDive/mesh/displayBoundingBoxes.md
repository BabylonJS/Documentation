---
title: Drawing Bounding Boxes
image:
description: Learn how to draw bounding boxes in Babylon.js.
keywords: diving deeper, meshes, bounding boxes, bounds
further-reading:
video-overview:
video-content:
---

# How to Draw Bounding Boxes

It's pretty easy to draw bounding boxes around a mesh in Babylon. You can think of a bounding box as visual box that your object(s) fit inside of perfectly. It encompasses the outer "bounds" of your object.

# Drawing a bounding box around a single object

Let's start by drawing a bounding box around a single object. You can follow along with the default [playground](https://playground.babylonjs.com/).

Let's say that you have a sphere in your scene that you've affecionately named "sphere".

To draw the bounding box around your sphere, all you need to do is set the showBoundingBox property to true.

Like this :

```javascript
sphere.showBoundingBox = true;
```

Pretty simple right?

Here is a playground where you can see it working. <Playground id="#4F33I3" title="Drawing A Box Around A Single Object" description="Simple example of drawing a bounding box around a single object."/>

# Drawing a bounding box around multiple objects

Ok so let's make it a little more complicated. Let's say that your scene also has a ground plane in it that you've lovingly named "ground" and you'd like to draw a bounding box around the area that encomposes both the sphere and ground.

To do this, we're going to get the minimum and maximum values of the bounding information of both meshes and compare them with special methods that compares two vector 3 values and gives you the minimum and maximum values. Then we'll set the sphere's bounding information to this new min and max. Let's try it out.

Let's start by declaring four new variables that will hold the minimum and maximum bounding information for the sphere and the ground. Like this:

```javascript
let sphereMin = sphere.getBoundingInfo().boundingBox.minimum;
let sphereMax = sphere.getBoundingInfo().boundingBox.maximum;

let groundMin = ground.getBoundingInfo().boundingBox.minimum;
let groundMax = ground.getBoundingInfo().boundingBox.maximum;
```

Ok and now let's declare 2 new variables and use those special methods metioned above to compare the min and max bounding info of both meshes.

```javascript
let newMin = BABYLON.Vector3.Minimize(sphereMin, groundMin);
let newMax = BABYLON.Vector3.Maximize(sphereMax, groundMax);
```

So now newMin and newMax are the minimum and maximum bounds of both objects! So next we will set the sphere's bounding information to a new set of bounding data based on newMin and newMax

```javascript
sphere.setBoundingInfo(new BABYLON.BoundingInfo(newMin, newMax));
```

And finally, just like before, we then display the sphere's bounding box.

```javascript
sphere.showBoundingBox = true;
```

TA DA!!! Here it is working in a playground: <Playground id="#4F33I3#1" title="Drawing A Box Around Multiple Objects" description="Simple example of drawing a bounding box around multiple objects."/>

# A better approach

Ok so there's a problem with the technique we used above. We actually changed the bounding info of the sphere to the new bounding information that encompasses both the sphere and the ground. There's actually a better way to do this, and that's to leave the sphere's bounding information alone and instead, introduce parenting into the equation!!!!

To start, let's create a new generic mesh like this:

```javascript
let parent = new BABYLON.Mesh("parent", scene);
```

And now let's use this generic mesh as the parent of the sphere and the ground;

```javascript
sphere.setParent(parent);
ground.setParent(parent);
```

Lastly, instead of setting the bounding information and displaying the bounding box of the sphere, let's change that to the parent instead.

```javascript
parent.setBoundingInfo(new BABYLON.BoundingInfo(newMin, newMax));

parent.showBoundingBox = true;
```

So here's what our playground looks like now. <Playground id="#4F33I3#2" title="A Better Approach For Bounding Boxes" description="Better example of drawing bounding boxes."/>

Notice something wrong? Our bounding box doesn't line up with the bounds of our objects anymore does it? There's a very good reason for that. It's because up until this point we are using LOCAL coordinates instead of world coordinates! So technically the bounding box that we're seeing is the right size, but it's drawn around the parent mesh...which in this case has it's pivot at the origin. You can clearly see the problem when you comment out this line:

```javascript
sphere.position.y = 1;
```

See that here in this playground: <Playground id="#4F33I3#3" title="A Fixed Better Approach For Bounding Boxes" description="Better example of drawing bounding boxes fixed."/>

Make a bit more sense? But what about if you wanted to get the world bounds of the positioned objects? It's actually pretty easy to do. We'll make a couple of minor modifications to the sphereMin, sphereMax, groundMin, groundMax values like this:

```javascript
let sphereMin = sphere.getBoundingInfo().boundingBox.minimumWorld;
let sphereMax = sphere.getBoundingInfo().boundingBox.maximumWorld;

let groundMin = ground.getBoundingInfo().boundingBox.minimumWorld;
let groundMax = ground.getBoundingInfo().boundingBox.maximumWorld;
```

Nice! That looks more like what you were probably expecting doesn't it?

Here's the updated playground to check out. <Playground id="#4F33I3#4" title="World Transform Bounding Boxes" description="Simple example of drawing bounding boxes in world space."/>

# One last trick

So what happens if you have a whole bunch of objects and you want to get the bounding box of all of them? You wouldn't want to do that manually for each one right? So we'll introduce a loop into the mix!

Like earlier, we'll make sure that we have a parent mesh, and that each object we want to include in the bounding box will be parented to that parent mesh.

The fun technique here is that we can loop through an array of every "child mesh" of the parent. Let's start by declaring a new variable that will be an array of all of the parent's child meshes.

```javascript
let childMeshes = parent.getChildMeshes();
```

Next, let's declare two new variables that will hold the minimum and maximum bounding values.

```javascript
let min = childMeshes[0].getBoundingInfo().boundingBox.minimumWorld;
let max = childMeshes[0].getBoundingInfo().boundingBox.maximumWorld;
```

We're setting the starting values of these min and max variables to the world min and world max bounding information for the first child mesh.

Now we can loop through all of the child meshes and continually update the min and max values with the new bounding information of each comparative mesh. It looks like this:

```javascript
for (let i = 0; i < childMeshes.length; i++) {
  let meshMin = childMeshes[i].getBoundingInfo().boundingBox.minimumWorld;
  let meshMax = childMeshes[i].getBoundingInfo().boundingBox.maximumWorld;

  min = BABYLON.Vector3.Minimize(min, meshMin);
  max = BABYLON.Vector3.Maximize(max, meshMax);
}
```

SWEET! We did it! Nice job! Here's the playground result of those changes. <Playground id="#4F33I3#6" title="Loop Through Meshes to Draw Bounding Box" description="Simple example of looping through meshes to draw an overall bounding box."/>

To dive even further into bounding boxes, make sure to check out the API as well

# API

- [boundingBox](/typedoc/classes/babylon.boundingbox)
