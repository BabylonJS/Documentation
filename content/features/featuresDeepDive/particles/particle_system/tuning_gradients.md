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

Some properties of a particle, size or color for example, can be changed over their lifetime. Others, such as emit rate, start size or lifetime, can be changed over the duration of the particle system.

Changing relevant properties over the duration of the particle system is available from Babylon.js V3.3 onwards, provided, of course, you set the _targetStopDuration_, When the duration is set you can alter appropriate properties from the start, 0, to the end, 1, by adding a gradient method related to the property.

Whether it is over a particle lifetime or the system duration the general form to change a specific property value is

```javascript
particleSystem.add < PROPERTY > Gradient(fraction_of_time_period_elapsed, property_value); //set a value at given time point
```

and for a range of property values

```javascript
particleSystem.add < PROPERTY > Gradient(fraction_of_time_period_elapsed, minimum_property_value, maximum_property_value); //set a range of values at given time point
```

In both cases we recommend that you add gradients for the start, 0, and end, 1, even when setting other time points between 0 and 1.

To remove a gradient you use

```javascript
particleSystem.remove < PROPERTY > Gradient(fraction_of_time_period_elapsed);
```

There are two time periods used - one for a particle lifetime and the other for the system duration. Both are running from 0 (start) to 1 (stop).

## Change Size Over Lifetime

To change size over the lifetime of the particle use

```javascript
particleSystem.addSizeGradient(0, 0.5); //size at start of particle lifetime
particleSystem.addSizeGradient(1, 3); //size at end of particle lifetime
```

For a range of values use

```javascript
particleSystem.addSizeGradient(0, 0.5, 0.8); //size range at start of particle lifetime
particleSystem.addSizeGradient(0.4, 1, 2); //size range at 2/5 of duration of particle system
particleSystem.addSizeGradient(1.0, 3, 4); //size range at end of particle lifetime
```

To remove a size gradient you use

```javascript
particleSystem.removeSizeGradient(0.4);
```

Size increases over lifetime: <Playground id="#0K3AQ2#18" title="Particle Size Increases Over Liftime" description="Simple example of particle size increasing over the lifteime of a particle."/>
Size increases then decreases over lifetime: <Playground id="#0K3AQ2#19" title="Particle Size Increases Then Decreases Over Liftime" description="Simple example of particle size increasing then decreasing over the lifteime of a particle."/>

## Change Color Over Lifetime

To change color over the lifetime of the particle use

```javascript
particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0)); //color at start of particle lifetime
particleSystem.addColorGradient(1, new BABYLON.Color4(1, 1, 1, 1)); //color at end of particle lifetime
```

For a range of values use

```javascript
particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0), new BABYLON.Color4(1, 0, 1, 0)); //color range at start of particle lifetime
particleSystem.addColorGradient(0.4, new BABYLON.Color4(1, 1, 1, 0.5), new BABYLON.Color4(1, 0, 1, 0.5)); //color range at 2/5 of particle lifetime
particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 1), new BABYLON.Color4(1, 0, 1, 1)); //color range at end of particle lifetime
```

To remove a color gradient you use

```javascript
particleSystem.removeColorGradient(0.4);
```

color change over lifetime: <Playground id="#0K3AQ2#20" title="Particle Color Change Over Liftime" description="Simple example of particle color changing over the lifteime of a particle."/>
color change with ranges over lifetime: <Playground id="#0K3AQ2#22" title="Particle Color Change With Ranges Over Liftime" description="Simple example of particle color changing with ranges over the lifteime of a particle."/>

## Change Speed Over Lifetime

To change the speed (magnitude of velocity) over the lifetime of the particle use

```javascript
particleSystem.addVelocityGradient(0, 0.5); //applied power at start of particle lifetime
particleSystem.addVelocityGradient(1, 3); //applied power at end of particle lifetime
```

For a range of values use

```javascript
particleSystem.addVelocityGradient(0, 0.5, 0.8); //applied power range at start of particle lifetime
particleSystem.addVelocityGradient(0.4, 1, 2); //applied power range at 2/5 of duration of particle system
particleSystem.addVelocityGradient(1.0, 3, 4); //applied power range at end of particle lifetime
```

To remove a velocity gradient you use

```javascript
particleSystem.removeVelocityGradient(0.4);
```

Speed increases over lifetime: <Playground id="#0K3AQ2#29" title="Particle Speed Increases Over Liftime" description="Simple example of particle speed increasing over the lifteime of a particle."/>
Speed increases then decreases over lifetime: <Playground id="#0K3AQ2#30" title="Particle Speed Increases Then Decreases Over Liftime" description="Simple example of particle speed increasing then decreasing over the lifteime of a particle."/>

## Limit Speed Over Lifetime

You can define by how much to limit the speed of a particle with

```javascript
particleSystem.limitVelocityDamping = 0.1; //damping factor
```

A limit will be used to check the current speed of the particle over its lifetime. And if the limit is reached, then the damping factor is applied as speed \* damping factor.

To set the speed limit use

```javascript
particleSystem.addLimitVelocityGradient(0, 10); //speed limit at start of particle lifetime
particleSystem.addLimitVelocityGradient(1, 0.1); //speed limit at end of particle lifetime
```

For a range of values use

```javascript
particleSystem.addLimitVelocityGradient(0, 9, 10); //speed limit range at start of particle lifetime
particleSystem.addLimitVelocityGradient(0.4, 2, 3); //speed limit range at 2/5 of duration of particle system
particleSystem.addLimitVelocityGradient(1.0, 0.1, 0.2); //speed limit range at end of particle lifetime
```

To remove a speed limit gradient you use

```javascript
particleSystem.removeLimitVelocityGradient(0.4);
```

Speed limit increases over lifetime: <Playground id="#0K3AQ2#33" title="Particle Speed Limit Increases Over Liftime" description="Simple example of particle speed limit increasing over the lifteime of a particle."/>

## Change Rotation Speed Over Lifetime

To change the rotation or angular speed over the lifetime of the particle use

```javascript
particleSystem.addAngularSpeedGradient(0, 0.5); //angular speed at start of particle lifetime
particleSystem.addAngularSpeedGradient(1, 3); //angular speed at end of particle lifetime
```

For a range of values use

```javascript
particleSystem.addAngularSpeedGradient(0, 0.5, 0.8); //angular speed range at start of particle lifetime
particleSystem.addAngularSpeedGradient(0.4, 1, 2); //angular speed range at 2/5 of duration of particle system
particleSystem.addAngularSpeedGradient(1.0, 3, 4); //angular speed range at end of particle lifetime
```

To remove an angular speed gradient you use

```javascript
particleSystem.removeAngularSpeedGradient(0.4);
```

AngularSpeed increases over lifetime: <Playground id="#0K3AQ2#26" title="Particle AngularSpeed Increases Over Liftime" description="Simple example of particle Angularspeed increasing over the lifteime of a particle."/>
AngularSpeed increases then decreases over lifetime: <Playground id="#0K3AQ2#27" title="Particle AngularSpeed Increasing and Decreasing Over Liftime" description="Simple example of particle Angularspeed increasing and decreasing over the lifteime of a particle."/>

## Change Drag Over Lifetime

You can simulate air friction by applying a drag to the particle, and you can change the amount of drag the particle experiences over its lifetime. Drag is applied in the direction of the particle's velocity. A drag of 0.8 will reduce the velocity to 20% of its value. When the drag is &gt; 1, the particle's direction will reverse.

To change drag over the lifetime of the particle use

```javascript
particleSystem.addDragGradient(0, 0.1); //drag at start of particle lifetime
particleSystem.addDragGradient(1, 0.8); //drag at end of particle lifetime
```

For a range of values use

```javascript
particleSystem.addDragGradient(0, 0.1, 0.2); //drag range at start of particle lifetime
particleSystem.addDragGradient(0.4, 0.5, 0.6); //drag range at 2/5 of duration of particle system
particleSystem.addDragGradient(1.0, 0.8, 0.9); //drag range at end of particle lifetime
```

To remove a drag gradient you use

```javascript
particleSystem.removeDragGradient(0.4);
```

Drag &le; 1: <Playground id="#0K3AQ2#39" title="Particle Drag Changing Over Liftime 1" description="Simple example of particle drag changing over the lifteime of a particle."/>
Drag &gt; 1: <Playground id="#0K3AQ2#40" title="Particle Drag Changing Over Liftime 2" description="Simple example of particle drag changing over the lifteime of a particle."/>

## Change Emit Rate Over Duration

For example as energy builds over the duration of the particle system and increases the emit rate you might use,

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addEmitRateGradient(0, 10); //emit rate at start of particle system
particleSystem.addEmitRateGradient(1.0, 500); //emit rate at end of particle system
```

Setting a range of lifetimes

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addEmitRateGradient(0, 10, 20); //emit rate range at start of particle system
particleSystem.addEmitRateGradient(0.4, 200, 250); //emit rate range at 2/5 of duration of particle system
particleSystem.addEmitRateGradient(1, 500, 600); //emit rate range at end of particle system
```

remove gradient at 0.4

```javascript
particleSystem.removeEmitRateGradient(0.4);
```

Faster emit rate over duration: <Playground id="#0K3AQ2#13" title="Particle Faster Emission Rate Over Duration" description="Simple example of faster particle emission rates over the duration."/>

Increasing and then decreasing emit rates over duration: <Playground id="#0K3AQ2#14" title="Increasing Then Decreasing Emission Rates Over Duration" description="Simple example of increasing then decreasing the emission rate over the duration."/>

## Change Lifetime Over Duration

For example to shorten lifetime as energy is used up over the duration of the particle system you might use,

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addLifeTimeGradient(0, 0.5); //lifetime at start of particle system
particleSystem.addLifeTimeGradient(1, 0); //lifetime at end of particle system
```

Setting a range of lifetimes

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addLifeTimeGradient(0, 0.5, 0.75); //lifetime range at start of particle system
particleSystem.addLifeTimeGradient(0.4, 0.25, 0.5); //lifetime range at 2/5 of duration of particle system
particleSystem.addLifeTimeGradient(1, 0, 0.1); //lifetime range at end of particle system
```

remove gradient at 0.4

```javascript
particleSystem.removeLifeTimeGradient(0.4);
```

Shorter lifetimes over duration: <Playground id="#0K3AQ2#9" title="Shorter Lifetimes Over Duration" description="Simple example of shortening lifetimes of particles over duration."/>
Increasing and then decreasing lifetimes over duration: <Playground id="#0K3AQ2#15" title="Increasing and Decreasing Lifetimes Over Duration" description="Simple example of increasing and then decreasing lifetimes over duration."/>

## Change Start Size Over Duration

To change the size of a particle on emission over the duration of the particle system use

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addStartSizeGradient(0, 0.25); //start size at start of particle system
particleSystem.addStartSizeGradient(1, 1.5); //start size at end of particle system
```

Setting a range of start sizes

```javascript
particleSystem.targetStopDuration = 8;

particleSystem.addStartSizeGradient(0, 0.5, 0.75); //start size range at start of particle system
particleSystem.addStartSizeGradient(0.4, 0.25, 0.5); //start size range at 2/5 of duration of particle system
particleSystem.addStartSizeGradient(1, 0, 0.1); //start size range at end of particle system
```

remove gradient at 0.4

```javascript
particleSystem.removeStartSizeGradient(0.4);
```

Increasing start sizes over duration: <Playground id="#0K3AQ2#41" title="Increasing Particle Start Sizes Over Duration" description="Simple example of increasing particle start sizes over duration."/>
