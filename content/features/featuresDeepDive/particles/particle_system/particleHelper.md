---
title: The Particle Helper
image:
description: Learn all about the fabulous particle helper in Babylon.js.
keywords: diving deeper, particles, particle system, helper, particle helper
further-reading:
  - title: Particles Overview
    url: /features/featuresDeepDive/particles/particle_system
  - title: Particles
    url: /features/featuresDeepDive/particles
  - title: How to Use Sub Emitters
    url: /features/featuresDeepDive/particles/particle_system/subEmitters
  - title: Solid Particle System
    url: /features/featuresDeepDive/particles/solid_particle_system
  - title: How to Customize the Particle System
    url: /features/featuresDeepDive/particles/particle_system/customizingParticles
video-overview:
video-content:
---

## Introducing the Particle Helper

Starting with Babylon.js v3.3, you can now use the Particle Helper to create complex particle systems without having to deal with individual properties.

To use the Particle Helper, you only need to know the name of the effect and then call this code:

```javascript
BABYLON.ParticleHelper.CreateAsync("sun", scene).then((set) => {
    set.start();
});
```

This will create regular particle systems. If you want to use GPU particle systems instead, just call this code:

```javascript
BABYLON.ParticleHelper.CreateAsync("sun", scene, true).then((set) => {
    set.start();
});
```

You can find a demo here: <Playground id="#1VGT5D#2" title="Particle Helper Example" description="Simple example of creating a particle system with the particle helper." isMain={true} category="Particles"/>

## ParticleSystemSet

When calling `BABYLON.ParticleHelper.CreateAsync()`, you will get a Promise that will resolve returning a `ParticleSystemSet`.
This class can be used with the following properties and functions:

- `emitterNode`: Use this property to get the transform node used as emitter by the particle systems
- `start(emitter)`: Call this function to start all particle systems associated with the current set. You can use the optional parameter to overwrite the emitter
- `dispose()`: Call this function to stop and clear all particle systems

You can also get the list of particle systems used by the set with `set.systems`.

## Available effects

Each effect can be described using a json file like this one: https://github.com/BabylonJS/Assets/blob/master/particles/systems/sun.json

List of available effects:

| Effect name   | Image                                             | Playground                                                                                          |
| ------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **sun**       | ![sun](/img/how_to/Particles/sun.jpg)             | <Playground id="#1VGT5D#2" title="Particle Sun Demo" description="Particle Sun Demo."/>             |
| **smoke**     | ![smoke](/img/how_to/Particles/smoke.jpg)         | <Playground id="#HT18SF#0" title="Particle Smoke Demo" description="Particle Smoke Demo."/>         |
| **rain**      | ![rain](/img/how_to/Particles/rain.jpg)           | <Playground id="#XQ8H3C#0" title="Particle Rain Demo" description="Particle Rain Demo."/>           |
| **fire**      | ![fire](/img/how_to/Particles/fire.jpg)           | <Playground id="#7IM02G#0" title="Particle Fire Demo" description="Particle Fire Demo."/>           |
| **explosion** | ![explosion](/img/how_to/Particles/explosion.jpg) | <Playground id="#X37LS1#3" title="Particle Explosion Demo" description="Particle Explosion Demo."/> |

## Custom ParticleSets

It is reasonably simple to create your own custom particleSet. Each of the particleSets listed above... is stored in aBabylon.js folder currently located [**here**](https://github.com/BabylonJS/Assets/tree/master/particles/systems). For instance, when you use “sun” as the particleSet _type_, the particleHelper will pick [**this json**](https://github.com/BabylonJS/Assets/blob/master/particles/systems/sun.json) (which defines the 'sun' particleSet _type_).

You may store these custom JSON particleSets anywhere you wish. You can set the base URL for the particleHelper with: `BABYLON.ParticleHelper.BaseAssetsUrl = “https://yourBaseUrl”;`

This must be done BEFORE you execute the CreateAsync call which loads your particleSet json file:

```javascript
var myParticleSet = new BABYLON.ParticleHelper.CreateAsync("tornado", scene).then(function(set) {
    set.start();
});
```

In the above example, 'tornado' is NOT the _name_ of a particle system. It is the name of a particleSet _TYPE_. In a moment, we will see how the _type_ string is used.

Let's look at the code-line that loads JSON particleSets into the particleHelper:

`` Tools.LoadFile(`${ParticleHelper.BaseAssetsUrl}/systems/${type}.json`, (data) => { ``

Notice the _type_ is used as the name of the JSON file. Using the previous example, your complete filename would be `tornado.json`.

Also notice the /systems/ subFolder hierarchy. Your custom particleSet JSON file needs to be located in a subFolder called /systems/. So, `yourDomain/systems/tornado.json` is where your file should be located and how it should be named (for our example).

## Generate Custom ParticleSets

You can automatically generate a new JSON particleSet (into a variable) by creatively configuring your particles systems, and then using the ExportSet option.

https://doc.babylonjs.com/api/classes/babylon.particlehelper#exportset

Usage: `var mySet = BABYLON.ParticleHelper.ExportSet( [includedPS1, includedPS2, includedPS3...] );`
