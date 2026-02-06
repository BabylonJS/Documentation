---
title: Basic Particle Properties
image: 
description: Learn all about tuning basic particle properties in Babylon.js.
keywords: diving deeper, particles, particle system, tuning
further-reading:
video-overview:
video-content:
---

# Basic Particle Properties

There are a wide range of properties to tune the behavior of the particles in the system including their lifetime, size, color, emission rates, speed, direction of travel, orientation and application of gravity.

This page covers setting initial property values when creating a particle system. The next page shows how to animate these properties over time.

Each example will show you a regular particle system, and also a [node based particle system](/features/featuresDeepDive/particles/particle_system/node_particle_editor).

## Size

The size of the particles can be varied randomly within a given range:

```javascript
particleSystem.minSize = 0.1;
particleSystem.maxSize = 0.5;
```

Size range: <Playground id="#0K3AQ2#3797" title="Particle Size Range Example" description="Simple example showing how to set a size range for a particle system."/>

## Scale

When you want to change the particle base shape from square to rectangular, scale the x and y values:

```javascript
particleSystem.minScaleX = 0.1;
particleSystem.maxScaleX = 0.5;

particleSystem.minScaleY = 0.2;
particleSystem.maxScaleY = 0.4;
```

Scale range: <Playground id="#0K3AQ2#3798" title="Particle Scale Range Example" description="Simple example showing how to set a scale range for a particle system."/>

## Color

There are three colors that can be set for the particle system, two of which are combined (or blended) during the lifetime of the particle and a third that it takes on just before the end of its lifetime.

```javascript
particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
```

Color: <Playground id="#0K3AQ2#3799" title="Particle Color Example" description="Simple example showing how to set colors of particles."/>

## Speed

The speed of a particle is governed by the amount of power applied to a particle when emitted. The more power, the faster it goes. The emission power, and hence the speed, of the particles can be varied randomly within a given range:

```javascript
particleSystem.minEmitPower = 1;
particleSystem.maxEmitPower = 3;
```

Power range: <Playground id="#0K3AQ2#3802" title="Particle Power Range Example" description="Simple example showing how to set a power range for a particle system."/>

## Rotation

You can define a range of angular speeds in radians per second:

```javascript
particleSystem.minAngularSpeed = 0;
particleSystem.maxAngularSpeed = Math.PI;
```

You can also define a particle's initial rotation angle:

```javascript
particleSystem.minInitialRotation = 0;
particleSystem.maxInitialRotation = Math.PI / 2;
```

Rotating: <Playground id="#0K3AQ2#3805" title="Rotating Particles" description="Simple example showing how to rotate particles."/>  
Rotating with set initial angle: <Playground id="#0K3AQ2#3807" title="Rotating Particles With Initial Angle" description="Simple example showing how to rotate particles with an initial angle."/>

## Translation Pivot

By default, a particle's transformation center is at the middle of its plane. You can move it to a different point relative to the center:

```javascript
particleSystem.translationPivot = new BABYLON.Vector2(2, 2); // across and up the containing plane
```

Rotation with translation pivot: <Playground id="#0K3AQ2#3811" title="Changing Particle Pivot Points" description="Simple example showing how to change the pivot point of a particle."/>

## Direction

Two directions can be specified. If you specify just *direction1*, the particles will travel randomly in the general direction given. When both directions are given, the particles will travel in a direction between the two. In practice, these vectors define the velocity (direction and speed) of the particles; i.e. particles with direction (10, -10, 10) travel 10 times faster than those with direction (1, -1, 1).

```javascript
particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
```

Direction range: <Playground id="#0K3AQ2#3815" title="Particle Direction Range Example" description="Simple example showing how to set a direction range for a particle system."/>

## Gravity

Gravity can be applied as a Vector3 in any direction. For example, a negative Y value pulls particles downward.

```javascript
particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
```

Direction and gravity: <Playground id="#0K3AQ2#3820" title="Direction And Gravity" description="Simple example showing how to set direction and gravity in a particle system."/>

## Emit Rate

The emit rate determines the number of particles emitted per second. The larger the number, the denser the emitted particle cloud appears. As particles die, they are recycled to be emitted again. If their lifetime is long enough and their emission rate is fast enough, it is possible for there to be a gap in the emission of particles.

![emitRate](/img/how_to/Particles/12-3.png)

```javascript
particleSystem.emitRate = 1000;
```

You can stop the continuous emission of particles by setting a manual emit count.

```javascript
particleSystem.manualEmitCount = 300;
```

In this case, the specified number of particles are emitted once and there are no further emissions.

Slow emit rate: <Playground id="#0K3AQ2#3822" title="Slow Emission Rate" description="Simple example showing how to set a slow emission rate of a particle system."/>  
Fast emit rate: <Playground id="#0K3AQ2#3824" title="Fast Emission Rate" description="Simple example showing how to set a fast emission rate of a particle system."/>  
Emit just 10: <Playground id="#0K3AQ2#3828" title="Emission Limits" description="Simple example showing how to limit particle emission to a certain number."/>

## Lifetime

The time taken for particles to disappear (or die) after being emitted can be varied within a chosen range. A particle's lifetime is set as a random value between a minimum and maximum.

```javascript
particleSystem.minLifeTime = 0.3;
particleSystem.maxLifeTime = 1.5;
```

Short lifetime: <Playground id="#0K3AQ2#3830" title="Short Particle Lifetimes" description="Simple example showing how to create particles with a short lifetime."/>  
Long lifetime: <Playground id="#0K3AQ2#3840" title="Long Particle Lifetimes" description="Simple example showing how to create particles with a long lifetime."/>

## Adjustable Examples

The following examples allow you to modify the properties of the particle system in real time and see the effects they produce.

Adjust Min & Max of EmitBox: <Playground id="#0K3AQ2#45" title="Adjust Min And Max of EmitBox" description="Simple example showing how to adjust the min and max of an emission box."/>  
Adjust Emit Life Time, Rate, Power and Update Speed: <Playground id="#0K3AQ2#46" title="Adjust Various Particle Properties" description="Simple example showing how to adjust various particle properties."/>
