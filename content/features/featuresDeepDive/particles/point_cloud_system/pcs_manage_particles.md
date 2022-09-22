---
title: Managing Point Cloud Particles
image:
description: Learn all point cloud particle management in Babylon.js.
keywords: diving deeper, point cloud, point cloud system, management
further-reading:
video-overview:
video-content:
---

## Particle Properties

Once the PCS mesh is built, unless immutable, it can respond to changes in the properties of each particle. Existing properties are shown in the table below.

| Property           | Type                | Default                     |
| ------------------ | ------------------- | --------------------------- |
| position           | Vector3             | (0, 0, 0)                   |
| rotation           | Vector3             | (0, 0, 0)                   |
| rotationQuaternion | Vector3             | undefined                   |
| velocity           | Vector3             | (0, 0, 0)                   |
| color              | Vector4             | (1, 1, 1, 1)                |
| pivot              | Vector3             | (0, 0, 0)                   |
| uvs                | Vector2             | (0,0)                       |
| translateFromPivot | boolean             | false                       |
| parentId           | integer             | null                        |
| idx                | integer (read only) | index of particle           |
| groupId            | integer (read only) | group number for a particle |

If you set a particle rotation quaternion, its rotation property will then be ignored.

New properties can be initialised.

**Note:** Since point particles **_always_** face the camera setting the rotation of a particle only has any effect in two cases:

1. The rotation of a particle parent will rotate its children about itself;
2. A pivot is set for the particle.

### Initialising Particles

Using `addPoints` particle properties can be set in the passed function. The `addSurfacePoints` and `addVolumePoints` methods obviously set the position and color properties of the particles but you may still want to set the initial values of other particle properties.

This can be done using `initParticles`. With this you must iterate over all the particles by using the `nbParticles` property and follow a call to this function with a call to `setParticles`. For example

```javascript
pcs.initParticles = function () {
  for (var p = 0; p < pcs.nbParticles; p++) {
    pcs.particles[p].velocity = BABYLON.Vector3.Zero();
    pcs.particles[p].acceleration = pcs.particles[p].position.scale(0.01);
  }
};

pcs.addSurfacePoints(model, 10000, BABYLON.PointColor.Color);
pcs.buildMeshAsync().then(() => {
  model.dispose();
  pcs.initParticles();
  pcs.setParticles();
});
```

### Updating Particles

When any appropriate particle properties are initiated the `updateParticles` method can be used. Unlike `initParticles` the function is called by `setParticles` and already passes a particle as an argument. The method `setParticles` will only execute after the PCS mesh has been built and so may safely be placed inside a render loop to produce an animation. For example

```javascript
pcs.updateParticle = function (particle) {
  particle.velocity.addInPlace(particle.acceleration);
  particle.position.addInPlace(particle.velocity);
};

scene.registerBeforeRender(() => {
  pcs.setParticles();
});
```

**Note:** All particle positions are expressed in the _local space_ of the PCS mesh.

The particle `pivot` vector is also in _local space_ of the PCS mesh. By default rotations around a pivot are calculated by translating the particle to the pivot point, then rotating it and then the inverse translation applied. By setting the particle method `translateFromPivot` to `true` (default `false`) rotations will only be calculated using the initial translation followed by the rotation leaving the particle at the translated location.

<Playground id="#UI95UC#12" title="Simple Animation" description="Simple example of animating a point cloud system."/>

In the following playground the particle pivots in the top PCS are set relative to the particle position and in the lower one are set in the same place.
<Playground id="#UI95UC#14" title="Pivot Animation Example 1" description="Simple example of animating the pivot point of a point cloud system."/>

In this playground the only difference is that the lower PCS has `translateFromPivot` set to `true`.
<Playground id="#UI95UC#15" title="Pivot Animation Example 2" description="Simple example of animating the pivot point of a point cloud system."/>

This playground animates the mesh not the particles.
<Playground id="#UI95UC#16" title="Immutable Animation" description="Simple example of point cloud system immutable animation."/>

This playground loads meshes from a file, converts to particles and animates
<Playground id="#UI95UC#17" title="Loaded Mesh Animation" description="Simple example of point cloud system animation based on loaded mesh animation."/>

### UVs

While setting and changing particle colors is straightforward doing this for UVs is a little more complex. Using `BABYLON.PointColor.UV` as a parameter within `addSurfacepoints` or `addVolumePoints` will set the UVs automatically for you based on the passed mesh.

You can also set the uv value for each particle using the passed function for `addPoints`. To make sense of the texture as the image used the uv values should relate in some way to the positional values for each particle. To then apply the texture with these uvs both the emissiveColor and emissiveTexture for the PCS mesh material must be set after the mesh is built.

**Note:** Only use emissive.

For example

```javascript
var myfunc = function (particle) {
  var x = Math.random();
  var y = Math.random();
  var z = 0;
  particle.position = new BABYLON.Vector3(x, y, z);
  //Relate uv values to positional values
  particle.uv.x = x;
  particle.uv.y = y;
};
pcs.addPoints(5000, myfunc);

pcs.buildMeshAsync().then(() => {
  pcs.mesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
  pcs.mesh.material.emissiveTexture = myTexture;
});
```

It is possible to use a texture atlas but you need to customize and calculate the more complex relationship between positional and uv values.

<Playground id="#UI95UC#23" title="UV With Added Points" description="Simple example of updating the UVs and adding points of a point cloud system."/>
<Playground id="#UI95UC#24" title="UV With Texture Atlas" description="Simple example of updating the UVs of a point cloud system with textured atlas."/>

### Recycling Particles

You can write your own code to recycle particles using `recycleParticle` which can be called from within `updateParticle`. For example,

```javascript
pcs.recycleParticle = function (particle) {
  particle.position = BABYLON.Vector3.Zero();
  particle.velocity = BABYLON.Vector3.Zero();
  particle.heightLim = 4 + 0.5 * Math.random();
};

pcs.updateParticle = function (particle) {
  if (particle.position.y > particle.heightLim) {
    this.recycleParticle(particle);
  }
  particle.velocity.addInPlace(particle.acceleration);
  particle.position.addInPlace(particle.velocity);
};
```

<Playground id="#UI95UC#19" title="Recycling Animations" description="Simple example of recycling animations of a point cloud system."/>

### Particle Parenting

Each particle can be given another particle as a parent.  
The parent must be created before the child particle. This means the parent has to have a lower index Id (`particle.idx`) than the current particle. So the first particle in the pool (`idx = 0`) can't have a parent. To give a parent to a particle, just set its property `parentId` to the parent index Id value.

```javascript
if (particle.idx > 0) {
  particle.parentId = particle.idx - 1; // the previous particle becomes the parent of the current one
}
```

To un-parent a particle, just set `.parentId` back to `null` which is the default value.

When a particle has got a parent, its position and rotation are then expressed in its parent local space.

```javascript
if (particle.idx > 0) {
  particle.parentId = particle.idx - 1; // the previous particle becomes the parent of the current one
  // the particle position and rotation are expressed in the previous particle space, this one being already
  // rotated and translated from the yet previous particle. Etc.
  particle.rotation.z = 0.01;
  particle.position.x = 1.0;
}
```

 <Playground id="#UI95UC#18" title="Parent Animation" description="Simple example of animating a point cloud system parent."/>

### Particle Intersections

The PCS provides a simple way to deal with intersections between a particle and other meshes. As this feature consumes more memory and CPU do not include it unless necessary.

To use it call the method `intersectsMesh(target)` (target is a mesh) for any particle to check if this particle intersects the _target_.  
It just will return true or false depending whether the particle intersects the target or not.

```javascript
if (particle.intersectsMesh(anyMesh)) {
  // change properties of particle
}
```

By default the check is carried out on the (AABB) bounding box of the mesh. When you wish to use the bounding sphere of the mesh add the parameter true.

```javascript
if (particle.intersectsMesh(mesh, true) {
    // change properties of particle
};
```

<Playground id="#UI95UC#20" title="Recycling Particle Collisions" description="Simple example of recycling particle collisions of a point cloud system."/>
<Playground id="#UI95UC#21" title="Mesh Colliding With Point Cloud" description="Simple example of a mesh colliding with a point cloud."/>
