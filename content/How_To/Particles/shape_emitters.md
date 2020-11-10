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
Starting from Babylonjs 3.2 you can shape the region the particles are emitted from as a

* Point
* Box
* Sphere
* Hemisphere
* Cylinder
* Cone
* Mesh
* Custom

by the addition of specific emitter function.

## Point Emitter

To create a point emitter, you can run this code:

```javascript
var pointEmitter = particleSystem.createPointEmitter(new BABYLON.Vector3(-7, 8, 3), new BABYLON.Vector3(7, 8, -3));
```
The `createPointEmitter` method takes four parameters in the following order

* direction1: Vector3, 
* direction2: Vector3

The returned `pointEmitter` object can be used to change the values of these properties.

```javascript
pointEmitter.direction1 = new BABYLON.Vector3(-5, 2, 1); 
pointEmitter.direction2 = new BABYLON.Vector3(5, 2, 1);  
```

<Playground id="#08YT34" title="Point Emitter" description="Simple example of a particle point emitter." image=""/>

## Box Emitter

To create a box emitter you use, for example

```javascript
var boxEmitter = particleSystem.createBoxEmitter(new BABYLON.Vector3(-7, 8, 3), new BABYLON.Vector3(7, 8, -3), new BABYLON.Vector3(-1, 0, 0), new BABYLON.Vector3(1, 0, 0));
```
The `createBoxEmitter` method takes four parameters in the following order

* direction1: Vector3, 
* direction2: Vector3, 
* minEmitBox: Vector3, 
* maxEmitBox: Vector3

The returned `boxEmitter` object can be used to change the values of these properties.

```javascript
boxEmitter.direction1 = new BABYLON.Vector3(-5, 2, 1); 
boxEmitter.direction2 = new BABYLON.Vector3(5, 2, 1);  
boxEmitter.minEmitBox = new BABYLON.Vector3(-2, -3, -4);  
boxEmitter.maxEmitBox = new BABYLON.Vector3(2, 3, 4); 
```

<Playground id="#MRRGXL#1" title="Box Emitter" description="Simple example of a particle box emitter." image=""/>

## Sphere Emitter

You can create a sphere emitter with a given radius, 1.2 for example,  using

```javascript
var sphereEmitter = particleSystem.createSphereEmitter(1.2);
```
The returned `sphereEmitter` object can be used to change the value of the radius.

The particles are emitted in the direction of the surface normals, ie the lines from the center of the sphere through a surface point.

<Playground id="#MRRGXL#2" title="Sphere Emitter" description="Simple example of a particle sphere emitter." image=""/>

With `sphereEmitter.radiusRange` you can define where along the radius the particles should be emitted. A value of 0 means only on the surface while a value of 1 means all along the radius.

If you prefer to chose the emission direction, you can create a directed sphere emitter

```javascript
var sphereEmitter = particleSystem.createDirectedSphereEmitter(1.2, new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(2, 8, 2));
```

The `createDirectedSphereEmitter` method takes three parameters in the following order

* radius: Number,
* direction1: Vector3, 
* direction2: Vector3, 
 

The returned `sphereEmitter` object can be used to change the values of these properties.

```javascript
sphereEmitter.radius = 3.4;
sphereEmitter.direction1 = new BABYLON.Vector3(-5, 2, 1); 
sphereEmitter.direction2 = new BABYLON.Vector3(5, 2, -1);    
```

The first parameter is the radius the second is direction1 and third is direction2. (The direction will be generated randomly between direction1 and direction2)

<Playground id="#MRRGXL#3" title="Sphere Emitter With Directions" description="Simple example of a particle sphere emitter with directions." image=""/>

## Hemispheric Emitter

You can create a hemispheric emitter with a given radius, 1.2 for example,  using

```javascript
var hemisphericEmitter = particleSystem.createHemisphericEmitter(1.2);
```
The returned `hemisphericEmitter` object can be used to change the value of the radius.

The particles are emitted in the direction of the surface normals, ie the lines from the center of the hemisphere through a surface point.

<Playground id="#FHIQYC" title="Hemispheric Emitter" description="Simple example of a particle hemispheric emitter." image=""/>

With `hemisphericEmitter.radiusRange` you can define where along the radius the particles should be emitted. A value of 0 means only on the surface while a value of 1 means all along the radius.

## Cylinder Emitter

You can create a cylinder emitter with a given radius, height, radiusRange, directionRandomizer with the following:

```javascript
var cylinderEmitter = particleSystem.createCylinderEmitter(1,1,0,0);
```
The returned `cylinderEmitter` object can be used to change the value of the radius, height, etc.

The particles are emitted in the direction of the surface normals, ie outward from the cylinder

<Playground id="#UL4WC0" title="Cylinder Emitter" description="Simple example of a particle cylinder emitter." image=""/>

With `cylinderEmitter.radiusRange` you can define where along the radius the particles should be emitted. A value of 0 means only on the surface while a value of 1 means all along the radius.
With `cylinderEmitter.directionRandomizer` can change how much to randomize the particles direction.

The `createDirectedCylinderEmitter` method takes three parameters in the following order

* radius: Number,
* height: Number,
* radiusRange: Number,
* direction1: Vector3, 
* direction2: Vector3, 
 

The returned `cylinderEmitter` object can be used to change the values of these properties.

```javascript
cylinderEmitter.radius = 3.4;
cylinderEmitter.direction1 = new BABYLON.Vector3(-5, 2, 1); 
cylinderEmitter.direction2 = new BABYLON.Vector3(5, 2, -1);    
```

The first parameter is the radius the second is direction1 and third is direction2. (The direction will be generated randomly between direction1 and direction2)

<Playground id="#UL4WC0#5" title="Cylinder Emitter With Directions" description="Simple example of a particle cylinder emitter with directions." image=""/>

## Cone Emitter

To create a cone emitter you use, for example

```javascript
var coneEmitter = particleSystem.createConeEmitter(2, Math.PI / 3);
```

The `createConeEmitter` method takes two parameters in the following order

* radius: Number;
* angle: Number, measured in radians, the vertex angle of the cone.

The cone is created with its axis along the Y-axis and its vertex at the bottom.

With `coneEmitter.radiusRange` you can define where along the radius the particles should be emitted. A value of 0 means only on the surface while a value of 1 means all along the radius.

The same applies to `coneEmitter.heightRange`: you can define where along the height the particles should be emitted. A value of 0 means only on the top surface while a value of 1 means all along the height.

Here is an example of a particle system emitted only from the outside of a flat cone: <Playground id="#B9HKG0#1" title="Emitter From Outside A Cone" description="Simple example of a particle system emitting from outside of a flat cone." image=""/>

The returned `coneEmitter` object can be used to change the values of these properties.

```javascript
coneEmitter.radius = 3.4;
coneEmitter.angle = Math.PI / 2;    
```

With `coneEmitter.emitFromSpawnPointOnly = true` you can force the emitter to only emit particles from the spawn point (the start of the cone).

<Playground id="#MRRGXL#4" title="Cone Emitter" description="Simple example of a particle cone emitter." image=""/>
<Playground id="#MRRGXL#5" title="Cone Emitter Rotating" description="Simple example of a particle cone emitter rotating." image=""/>


# Mesh Emitter

You can use the MeshParticleEmitter to emit your particles from the surface of a mesh:

```javascript
 var meshEmitter = new BABYLON.MeshParticleEmitter(sphere);
```

By default the direction of the particles will be the normal of the surface of the mesh but you can turn it off and then use a custom direction:

```
meshEmitter.useMeshNormalsForDirection = false;
meshEmitter.direction1 = new BABYLON.Vector3(0, 1, 0);
meshEmitter.direction2 = new BABYLON.Vector3(0, -1, 0);
```

**Please note that the MeshParticleEmitter is not supported by GPU Particle**

Here is an example of a mesh particle emitter: <Playground id="#N775HF" title="Mesh Emitter" description="Simple example of a particle mesh emitter." image=""/>

## Custom Emitter

To create a custom emitter you need to provide 2 functions:

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

A custom emitter will let you define the position and the destination of each particle.

When used with a GPU Particle system the generators(`particlePositionGenerator` and `particleDestinationGenerator`) will provide a particle index whereas when used with a CPU Particle system they will provide the actual particle to update.

Here is an example of a custom particle emitter: <Playground id="#77BKY4" title="Custom Emitter" description="Simple example of a particle custom emitter." image=""/>