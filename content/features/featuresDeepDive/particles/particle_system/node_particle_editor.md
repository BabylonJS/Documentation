# Node Particle Editor

Starting from Babylon.js v8.14, you can design complex and intricate particle systems using the Node Particle Editor (NPE).

![NPE screenshot](/img/tools/npe/01.jpg)

## NPE

NPE lets you define one or multiple particle systems. It creates a [ParticleSystemSet](/features/featuresDeepDive/particles/particle_system/particleHelper#ParticleSystemSet) that can be used directly.

```javascript
const npe = await BABYLON.NodeParticleSystemSet.ParseFromSnippetAsync("#8O4BJ2");
const particleSystemSet = await npe.buildAsync(scene);
particleSystemSet.start();
```

Here’s a complete example you can try out:

<Playground id="#P96UPW" title="NPE" description="Complete example of using a system set from NPE."/>

## How To Use NPE

To use NPE, head to [](https://npe.babylonjs.com).

The default setup matches the one we just showed. Let’s dive deeper.

![NPE screenshot](/img/tools/npe/02.jpg)

To set up a particle system, you’ll need three core components:

- The particle system itself, defined by a ParticleSystem block

- The creation logic, using at least a Create Particle block and a Shape block

- The update logic

**Note: For now, NPE only generates CPU-based particle systems.**

## The particle system block
This block defines the static properties of the system (like `capacity` or `emitRate`). You must provide, at a minimum, a particle input and a texture input.

## Creation phase
Every time a particle is created, this code runs. Each input is dynamic, meaning it’s evaluated per particle.
![NPE screenshot](/img/tools/npe/03.jpg)

In this example, each new particle is given a randomly chosen lifetime between 1 and 2.

The shape blocks are how you define [shape emitters](/features/featuresDeepDive/particles/particle_system/shape_emitters)

## Update phase

The update logic is executed every frame for each particle. In this example, we update the position by adding the velocity (also known as scaled direction, i.e., direction adjusted for frame rate).

![NPE screenshot](/img/tools/npe/04.jpg)

Each particle property can be updated:

![NPE screenshot](/img/tools/npe/05.jpg)

The blocks labeled Position and Scaled direction are contextual values — they reflect the intrinsic properties of a particle.

For basic behaviors, we offer direct function blocks so you don't need to manually wire everything. For example, the earlier logic can be replaced with a BasicPositionUpdate:

![NPE screenshot](/img/tools/npe/06.jpg)

## Managing random values

A core feature of any particle system is randomness. To support this, we provide three types of randomization blocks:

### Random

The basic node for generating random values. It can generate values per particle, per system, or on every call.
![NPE screenshot](/img/tools/npe/07.jpg)

### Gradient

Use this to create value ramps. Based on an input from 0 to 1, it picks the appropriate value from a range.
![NPE screenshot](/img/tools/npe/08.jpg)

In this case, we use the AgeGradient contextual value (representing particle life from 0 to 1) to determine color. The particle is born white and fades to red, reaching full red at 75% of its lifetime.

## Triggers

To add more complex behaviors, you can use triggers to link several particle systems. For instance to start a new particle system when a specific condition is met.

