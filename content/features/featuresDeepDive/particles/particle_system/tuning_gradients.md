---
title: Changing Particle Properties Over Time
image:
description: Learn how to change particle properties over time in Babylon.js.
keywords: diving deeper, particles, particle system, particle tuning
further-reading:
video-overview:
video-content:
---

# Change Particle Behaviors Over Time

Particle properties can be changed over time using **gradients**. There are two distinct time periods you can target:

- **Particle lifetime** — the lifespan of an individual particle, from when it is emitted to when it dies. Properties like size, color, speed, angular speed, and drag can be changed over a particle's lifetime.
- **System duration** — the total running time of the particle system, controlled by _targetStopDuration_. Properties like emit rate, start size, and particle lifetime can be changed over the system's duration.

Both time periods are normalized from 0 (start) to 1 (end).

The general form to change a specific property value is:

```javascript
particleSystem.addPropertyGradient(fraction, value);
```

For a range of property values:

```javascript
particleSystem.addPropertyGradient(fraction, minValue, maxValue);
```

In both cases, we recommend that you add gradients for the start (0) and end (1), even when setting other time points between 0 and 1.

To remove a gradient:

```javascript
particleSystem.removePropertyGradient(fraction);
```

Replace `Property` with the actual property name (e.g., `addSizeGradient`, `removeColorGradient`). See the sections below for each supported property.

## Change Size Over Lifetime

To change size over the lifetime of the particle:

```javascript
particleSystem.addSizeGradient(0, 0.5); //size at start of particle lifetime
particleSystem.addSizeGradient(1, 3); //size at end of particle lifetime
```

For a range of values:

```javascript
particleSystem.addSizeGradient(0, 0.5, 0.8); //size range at start of particle lifetime
particleSystem.addSizeGradient(0.4, 1, 2); //size range at 2/5 of particle lifetime
particleSystem.addSizeGradient(1.0, 3, 4); //size range at end of particle lifetime
```

To remove a size gradient:

```javascript
particleSystem.removeSizeGradient(0.4);
```

Size increases over lifetime: <Playground id="#0K3AQ2#3843" title="Particle Size Increases Over Lifetime" description="Simple example of particle size increasing over the lifetime of a particle."/>  
Size increases then decreases over lifetime: <Playground id="#0K3AQ2#3846" title="Particle Size Increases Then Decreases Over Lifetime" description="Simple example of particle size increasing then decreasing over the lifetime of a particle."/>

## Change Start Size Over Duration

To change the size of a particle on emission over the duration of the particle system:

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addStartSizeGradient(0, 0.25); //start size at start of particle system
particleSystem.addStartSizeGradient(1, 1.5); //start size at end of particle system
```

Setting a range of start sizes:

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addStartSizeGradient(0, 0.5, 0.75); //start size range at start of particle system
particleSystem.addStartSizeGradient(0.4, 0.25, 0.5); //start size range at 2/5 of duration of particle system
particleSystem.addStartSizeGradient(1, 0, 0.1); //start size range at end of particle system
```

Remove gradient at 0.4:

```javascript
particleSystem.removeStartSizeGradient(0.4);
```

Increasing start sizes over duration: <Playground id="#0K3AQ2#3899" title="Increasing Particle Start Sizes Over Duration" description="Simple example of increasing particle start sizes over duration."/>

## Change Color Over Lifetime

To change color over the lifetime of the particle:

```javascript
particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0)); //color at start of particle lifetime
particleSystem.addColorGradient(1, new BABYLON.Color4(1, 1, 1, 1)); //color at end of particle lifetime
```

For a range of values:

```javascript
particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0), new BABYLON.Color4(1, 0, 1, 0)); //color range at start of particle lifetime
particleSystem.addColorGradient(0.4, new BABYLON.Color4(1, 1, 1, 0.5), new BABYLON.Color4(1, 0, 1, 0.5)); //color range at 2/5 of particle lifetime
particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 1), new BABYLON.Color4(1, 0, 1, 1)); //color range at end of particle lifetime
```

To remove a color gradient:

```javascript
particleSystem.removeColorGradient(0.4);
```

Color change over lifetime: <Playground id="#0K3AQ2#3850" title="Particle Color Change Over Lifetime" description="Simple example of particle color changing over the lifetime of a particle."/>  
Color change with ranges over lifetime: <Playground id="#0K3AQ2#3852" title="Particle Color Change With Ranges Over Lifetime" description="Simple example of particle color changing with ranges over the lifetime of a particle."/>

## Change Speed Over Lifetime

The velocity gradient acts as a multiplier on the particle's speed. To change it over the lifetime of the particle:

```javascript
particleSystem.addVelocityGradient(0, 0.5); //speed multiplier at start of particle lifetime
particleSystem.addVelocityGradient(1, 3); //speed multiplier at end of particle lifetime
```

For a range of values:

```javascript
particleSystem.addVelocityGradient(0, 0.5, 0.8); //speed multiplier range at start of particle lifetime
particleSystem.addVelocityGradient(0.4, 1, 2); //speed multiplier range at 2/5 of particle lifetime
particleSystem.addVelocityGradient(1.0, 3, 4); //speed multiplier range at end of particle lifetime
```

To remove a velocity gradient:

```javascript
particleSystem.removeVelocityGradient(0.4);
```

Speed increases over lifetime: <Playground id="#0K3AQ2#3854" title="Particle Speed Increases Over Lifetime" description="Simple example of particle speed increasing over the lifetime of a particle."/>  
Speed increases then decreases over lifetime: <Playground id="#0K3AQ2#3858" title="Particle Speed Increases Then Decreases Over Lifetime" description="Simple example of particle speed increasing then decreasing over the lifetime of a particle."/>

## Limit Speed Over Lifetime

You can cap a particle's speed at a maximum value and apply damping when that limit is exceeded. First, set the damping factor:

```javascript
particleSystem.limitVelocityDamping = 0.1; //damping factor
```

At each frame, if the particle's current speed exceeds the limit, the speed is reduced by multiplying it by the damping factor. For example, a damping factor of 0.1 would reduce the speed to 10% of its current value.

To set the speed limit over the particle's lifetime:

```javascript
particleSystem.addLimitVelocityGradient(0, 10); //speed limit at start of particle lifetime
particleSystem.addLimitVelocityGradient(1, 0.1); //speed limit at end of particle lifetime
```

For a range of values:

```javascript
particleSystem.addLimitVelocityGradient(0, 9, 10); //speed limit range at start of particle lifetime
particleSystem.addLimitVelocityGradient(0.4, 2, 3); //speed limit range at 2/5 of particle lifetime
particleSystem.addLimitVelocityGradient(1.0, 0.1, 0.2); //speed limit range at end of particle lifetime
```

To remove a speed limit gradient:

```javascript
particleSystem.removeLimitVelocityGradient(0.4);
```

Speed limit increases over lifetime: <Playground id="#0K3AQ2#3861" title="Particle Speed Limit Increases Over Lifetime" description="Simple example of particle speed limit increasing over the lifetime of a particle."/>

## Change Rotation Speed Over Lifetime

To change the rotation or angular speed over the lifetime of the particle:

```javascript
particleSystem.addAngularSpeedGradient(0, 0.5); //angular speed at start of particle lifetime
particleSystem.addAngularSpeedGradient(1, 3); //angular speed at end of particle lifetime
```

For a range of values:

```javascript
particleSystem.addAngularSpeedGradient(0, 0.5, 0.8); //angular speed range at start of particle lifetime
particleSystem.addAngularSpeedGradient(0.4, 1, 2); //angular speed range at 2/5 of particle lifetime
particleSystem.addAngularSpeedGradient(1.0, 3, 4); //angular speed range at end of particle lifetime
```

To remove an angular speed gradient:

```javascript
particleSystem.removeAngularSpeedGradient(0.4);
```

Angular speed increases over lifetime: <Playground id="#0K3AQ2#3864" title="Particle Angular Speed Increases Over Lifetime" description="Simple example of particle angular speed increasing over the lifetime of a particle."/>  
Angular speed increases then decreases over lifetime: <Playground id="#0K3AQ2#3867" title="Particle Angular Speed Increasing and Decreasing Over Lifetime" description="Simple example of particle angular speed increasing and decreasing over the lifetime of a particle."/>

## Change Drag Over Lifetime

You can simulate air friction by applying drag to a particle over its lifetime. Drag reduces the particle's velocity: a drag value of 0.8 reduces the velocity to 20% of its current value. When drag is &gt; 1, the particle's direction will reverse.

To change drag over the lifetime of the particle:

```javascript
particleSystem.addDragGradient(0, 0.1); //drag at start of particle lifetime
particleSystem.addDragGradient(1, 0.8); //drag at end of particle lifetime
```

For a range of values:

```javascript
particleSystem.addDragGradient(0, 0.1, 0.2); //drag range at start of particle lifetime
particleSystem.addDragGradient(0.4, 0.5, 0.6); //drag range at 2/5 of particle lifetime
particleSystem.addDragGradient(1.0, 0.8, 0.9); //drag range at end of particle lifetime
```

To remove a drag gradient:

```javascript
particleSystem.removeDragGradient(0.4);
```

Drag &le; 1: <Playground id="#0K3AQ2#3870" title="Particle Drag Changing Over Lifetime 1" description="Simple example of particle drag changing over the lifetime of a particle."/>  
Drag &gt; 1: <Playground id="#0K3AQ2#3874" title="Particle Drag Changing Over Lifetime 2" description="Simple example of particle drag changing over the lifetime of a particle."/>

## Change Emit Rate Over Duration

To change the emit rate over the duration of the particle system:

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addEmitRateGradient(0, 10); //emit rate at start of particle system
particleSystem.addEmitRateGradient(1.0, 500); //emit rate at end of particle system
```

Setting a range of emit rates:

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addEmitRateGradient(0, 10, 20); //emit rate range at start of particle system
particleSystem.addEmitRateGradient(0.4, 200, 250); //emit rate range at 2/5 of duration of particle system
particleSystem.addEmitRateGradient(1, 500, 600); //emit rate range at end of particle system
```

Remove gradient at 0.4:

```javascript
particleSystem.removeEmitRateGradient(0.4);
```

Faster emit rate over duration: <Playground id="#0K3AQ2#3882" title="Particle Faster Emission Rate Over Duration" description="Simple example of faster particle emission rates over the duration."/>  
Increasing and then decreasing emit rates over duration: <Playground id="#0K3AQ2#3881" title="Increasing Then Decreasing Emission Rates Over Duration" description="Simple example of increasing then decreasing the emission rate over the duration."/>

## Change Lifetime Over Duration

To change how long each particle lives over the duration of the particle system:

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addLifeTimeGradient(0, 0.5); //lifetime at start of particle system
particleSystem.addLifeTimeGradient(1, 0); //lifetime at end of particle system
```

Setting a range of lifetimes:

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addLifeTimeGradient(0, 0.5, 0.75); //lifetime range at start of particle system
particleSystem.addLifeTimeGradient(0.4, 0.25, 0.5); //lifetime range at 2/5 of duration of particle system
particleSystem.addLifeTimeGradient(1, 0, 0.1); //lifetime range at end of particle system
```

Remove gradient at 0.4:

```javascript
particleSystem.removeLifeTimeGradient(0.4);
```

Shorter lifetimes over duration: <Playground id="#0K3AQ2#3887" title="Shorter Lifetimes Over Duration" description="Simple example of shortening lifetimes of particles over duration."/>  
Increasing and then decreasing lifetimes over duration: <Playground id="#0K3AQ2#3894" title="Increasing and Decreasing Lifetimes Over Duration" description="Simple example of increasing and then decreasing lifetimes over duration."/>
