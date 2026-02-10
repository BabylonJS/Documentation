---
title: Shape Emitters
image: 
description: Learn about Particle System Shape Emitters in Babylon.js.
keywords: diving deeper, particles, particle system, shape emitters
further-reading:
video-overview:
video-content:
---

# Shape Emitters

Starting from Babylon.js 3.2, you can shape the region particles are emitted from using a specific emitter type:

* Point
* Box
* Sphere
* Hemisphere
* Cylinder
* Cone
* Mesh
* Custom

Each example will show you a regular particle system, and also a [node based particle system](/features/featuresDeepDive/particles/particle_system/node_particle_editor).

## Point Emitter

To create a point emitter, you can run this code:

```javascript
var pointEmitter = particleSystem.createPointEmitter(new BABYLON.Vector3(-7, 8, 3), new BABYLON.Vector3(7, 8, -3));
```

The `createPointEmitter` method takes two parameters in the following order:

* direction1: Vector3,
* direction2: Vector3

The returned `pointEmitter` object can be used to change the values of these properties:

```javascript
pointEmitter.direction1 = new BABYLON.Vector3(-5, 2, 1); 
pointEmitter.direction2 = new BABYLON.Vector3(5, 2, 1);  
```

<Playground id="#0K3AQ2#3933" title="Point Emitter" description="Simple example of a particle point emitter."/>

## Box Emitter

To create a box emitter you use, for example:

```javascript
var boxEmitter = particleSystem.createBoxEmitter(new BABYLON.Vector3(-7, 8, 3), new BABYLON.Vector3(7, 8, -3), new BABYLON.Vector3(-1, 0, 0), new BABYLON.Vector3(1, 0, 0));
```

The `createBoxEmitter` method takes four parameters in the following order:

* direction1: Vector3,
* direction2: Vector3,
* minEmitBox: Vector3,
* maxEmitBox: Vector3

The returned `boxEmitter` object can be used to change the values of these properties:

```javascript
boxEmitter.direction1 = new BABYLON.Vector3(-5, 2, 1); 
boxEmitter.direction2 = new BABYLON.Vector3(5, 2, 1);  
boxEmitter.minEmitBox = new BABYLON.Vector3(-2, -3, -4);  
boxEmitter.maxEmitBox = new BABYLON.Vector3(2, 3, 4); 
```

<Playground id="#0K3AQ2#3912" title="Box Emitter" description="Simple example of a particle box emitter."/>

## Sphere Emitter

You can create a sphere emitter with a given radius (e.g. 1.2):

```javascript
var sphereEmitter = particleSystem.createSphereEmitter(1.2);
```

The returned `sphereEmitter` object can be used to change the value of the radius.

The particles are emitted in the direction of the surface normals, i.e. the lines from the center of the sphere through a surface point.

<Playground id="#0K3AQ2#3916" title="Sphere Emitter" description="Simple example of a particle sphere emitter."/>

With `sphereEmitter.radiusRange` you can define where along the radius the particles should be emitted. A value of 0 means only on the surface, while a value of 1 means all along the radius.

If you prefer to choose the emission direction, you can create a directed sphere emitter:

```javascript
var sphereEmitter = particleSystem.createDirectedSphereEmitter(1.2, new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(2, 8, 2));
```

The `createDirectedSphereEmitter` method takes three parameters in the following order:

* radius: Number,
* direction1: Vector3,
* direction2: Vector3,

The returned `sphereEmitter` object can be used to change the values of these properties:

```javascript
sphereEmitter.radius = 3.4;
sphereEmitter.direction1 = new BABYLON.Vector3(-5, 2, 1); 
sphereEmitter.direction2 = new BABYLON.Vector3(5, 2, -1);    
```

The particle direction will be generated randomly between `direction1` and `direction2`.

<Playground id="#0K3AQ2#3917" title="Sphere Emitter With Directions" description="Simple example of a particle sphere emitter with directions."/>

## Hemispheric Emitter

You can create a hemispheric emitter with a given radius (e.g. 1.2):

```javascript
var hemisphericEmitter = particleSystem.createHemisphericEmitter(1.2);
```

The returned `hemisphericEmitter` object can be used to change the value of the radius.

The particles are emitted in the direction of the surface normals, i.e. the lines from the center of the hemisphere through a surface point.

<Playground id="#0K3AQ2#3915" title="Hemispheric Emitter" description="Simple example of a particle hemispheric emitter."/>

With `hemisphericEmitter.radiusRange` you can define where along the radius the particles should be emitted. A value of 0 means only on the surface, while a value of 1 means all along the radius.

## Cylinder Emitter

You can create a cylinder emitter with a given `radius`, `height`, `radiusRange`, and `directionRandomizer`:

```javascript
var cylinderEmitter = particleSystem.createCylinderEmitter(1, 1, 0, 0);
```

The returned `cylinderEmitter` object can be used to change these property values.

The particles are emitted in the direction of the surface normals, i.e. outward from the cylinder.

<Playground id="#0K3AQ2#3921" title="Cylinder Emitter" description="Simple example of a particle cylinder emitter."/>

With `cylinderEmitter.radiusRange` you can define where along the radius the particles should be emitted. A value of 0 means only on the surface, while a value of 1 means all along the radius.
With `cylinderEmitter.directionRandomizer` you can change how much to randomize the particle's direction.

If you prefer to choose the emission direction, you can create a directed cylinder emitter. The `createDirectedCylinderEmitter` method takes five parameters in the following order:

* radius: Number,
* height: Number,
* radiusRange: Number,
* direction1: Vector3,
* direction2: Vector3,

The returned `cylinderEmitter` object can be used to change the values of these properties:

```javascript
cylinderEmitter.radius = 3.4;
cylinderEmitter.direction1 = new BABYLON.Vector3(-5, 2, 1); 
cylinderEmitter.direction2 = new BABYLON.Vector3(5, 2, -1);    
```

The particle direction will be generated randomly between `direction1` and `direction2`.

<Playground id="#0K3AQ2#3922" title="Cylinder Emitter With Directions" description="Simple example of a particle cylinder emitter with directions."/>

## Cone Emitter

To create a cone emitter:

```javascript
var coneEmitter = particleSystem.createConeEmitter(2, Math.PI / 3);
```

The `createConeEmitter` method takes two parameters in the following order:

* radius: Number;
* angle: Number, measured in radians, the vertex angle of the cone.

The cone is created with its axis along the Y-axis and its vertex at the bottom.

With `coneEmitter.radiusRange` you can define where along the radius the particles should be emitted. A value of 0 means only on the surface, while a value of 1 means all along the radius.

The same applies to `coneEmitter.heightRange`: you can define where along the height the particles should be emitted. A value of 0 means only on the top surface, while a value of 1 means all along the height.

The returned `coneEmitter` object can be used to change the values of these properties:

```javascript
coneEmitter.radius = 3.4;
coneEmitter.angle = Math.PI / 2;    
```

With `coneEmitter.emitFromSpawnPointOnly = true` you can force the emitter to only emit particles from the spawn point (the start of the cone).

<Playground id="#0K3AQ2#3925" title="Cone Emitter" description="Simple example of a particle cone emitter."/>
<Playground id="#0K3AQ2#3935" title="Cone Emitter from spawn point" description="Simple example of a particle cone emitter from the spawn point."/>

## Mesh Emitter

You can use `MeshParticleEmitter` to emit particles from the surface of a mesh:

```javascript
var meshEmitter = new BABYLON.MeshParticleEmitter(sphere);
```

By default, the direction of the particles follows the surface normal of the mesh. You can disable this and use a custom direction instead:

```javascript
meshEmitter.useMeshNormalsForDirection = false;
meshEmitter.direction1 = new BABYLON.Vector3(0, 1, 0);
meshEmitter.direction2 = new BABYLON.Vector3(0, -1, 0);
```

**Please note that `MeshParticleEmitter` is not supported by GPU particle systems.**

Here is an example of a mesh particle emitter: <Playground id="#0K3AQ2#3929" title="Mesh Emitter" description="Simple example of a particle mesh emitter."/>

## Custom Emitter

A custom emitter lets you define the position and destination of each particle by providing two generator functions:

```javascript
var customEmitter = new BABYLON.CustomParticleEmitter();

var id = 0;
customEmitter.particlePositionGenerator = (index, particle, out) => {
    out.x = Math.cos(id) * 5;
    out.y = Math.sin(id) * 5;
    out.z = 0;
    id += 0.01;
}

customEmitter.particleDestinationGenerator = (index, particle, out) => {
    out.x = 0;
    out.y = 0;
    out.z = 0;
}
```

When used with a GPU particle system, the generators (`particlePositionGenerator` and `particleDestinationGenerator`) receive a particle index. When used with a CPU particle system, they receive the actual particle object to update.

Here is an example of a custom particle emitter: <Playground id="#0K3AQ2#3932" title="Custom Emitter" description="Simple example of a particle custom emitter."/>
