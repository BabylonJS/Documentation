# Particles

This tutorial is going to talk about the particle system in BabylonJS. Particles are often small sprites used to simulate hard-to-reproduce phenomena like fire, smoke, water, or abstract visual effects like magic glitter and faery dust. This is done by emitting a cloud of very many particles from a region. From version 3.2 there are specific emitters to constrain this region in the shape of a box, sphere or cone. You can also write your own custom functions to control the cloud and region.

GPU particles are the latest addition to the particles family and can be used, with an appropriate browser, to boost performance.

![Particles](/img/how_to/Particles/12.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Particles. 

* [Playground Example - Particle System](https://www.babylonjs-playground.com/#WBQ8EM)

## Creating the Particles

### Particle System
To perform this magic trick you first need to create a `ParticleSystem` object. 

```javascript
var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
```

This sets the number of particles in the system (capacity). The particle system also requires a texture so that the particles can be seen and an emitter which sets the location and spread of the particles from a starting point. 

Please note that you can use the ParticleHelper to create a default configured system with: `BABYLON.ParticleHelper.CreateDefault(emitter)`.

Once completed you set the particle system in motion using

```javascript
particleSystem.start();
```
and stop it with

```javascript
particleSystem.stop();
```

To delay a particle systems start, `particleSystem.startDelay = 3000;` can be set. This value defines the delay in milliseconds.

You can also delay start the particle system with `particleSystem.start(3000);`. This value with override the particleSystem.startDelay field if set.

**Note:** that stopping a particle system will prevent the creation of new particles but the existing ones will continue. If you want to reset a system to an empty state, you will also have to call `particleSystem.reset()`

You can also set the amount of time the particle system is running though live particles may continue after that time.

```javascript
particleSystem.targetStopDuration = 5;
```

Once stopped you can dispose of the particle system. Very useful if you want to create a one shot particle system with a specific targetStopDuration.

```javascript
particleSystem.disposeOnStop = true;
```

### Pre-warming
Starting with Babylon.js v3.3, you can now specify a pre-warming period to make sure your system is in a correct state before rendering.

To do so, you need to setup two properties:
- `system.preWarmCycles`: Gets or sets a value indicating how many cycles (or frames) must be executed before first rendering (this value has to be set before starting the system). Default is 0 (ie. no pre-warming)
- `system.preWarmStepOffset`: Gets or sets a value indicating the time step multiplier to use in pre-warm mode (default is 1)

So if you set your system like this:

```
system.preWarmCycles = 100;
system.preWarmStepOffset = 5;
system.start();
```

It will execute the particle animation loop 100 times with a time step set to 5 times faster than realtime. The more cycles you want, the slower the system will be to start. So it could be interesting to increase the time step to have less cycles to run. But keep in mind that a too big time step will introduce issues if the life spam of a particle is smaller than the time step.

Here is an example of pre-warming: https://www.babylonjs-playground.com/#MX2Z99#8

### Particle Texture 
To apply a texture to the particles, such as  
![Flare](/img/how_to/Particles/Flare.png)

set the `particleTexture`

```javascript
particleSystem.particleTexture = new BABYLON.Texture("PATH TO IMAGE", scene);
```

You can also apply a mask to a texture to filter some colors, or filter a part of the alpha channel.

```javascript
particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
```

This example produces the following  
![TextureMask](/img/how_to/Particles/12-1.png)

To use multiple textures in the scene use multiple particle systems all of which can use the same emitter object. 

### Particle Emitter
The emitter can be located either with a vector3 or a mesh, in which case the position of the mesh is used as the location. 

```javascript
particleSystem.emitter = new BABYLON.Vector3(-1, 2, 3);
```

```javascript
var source = BABYLON.Mesh.CreateBox("source", 1.0, scene);
particleSystem.emitter = source;
```

### Local space

If the emitter is a mesh and you set `particleSystem.isLocal = true` then all particles will be generated into the mesh local space (so rotation or transforming the mesh will transform the entire particle system).

Demo: https://www.babylonjs-playground.com/#LNRAI3

### World offset
Starting with Babylon.js v4.0, you can set up a world offset to your particles with:
```
particleSystem.worldOffset = new BABYLON.Vector3(100, 20, -453);
```

This command will shift the particles using the offset (Mostly used when you need to keep the camera at the center of the world to increase precision and then move the world instead).

### Location and Spread
The spread of the particles from the emitter is from within a box the size of which is determined by setting the lower, left, front corner and upper, right, back corner of the box relative to the location of the emitter. This is done using `minEmitBox` and `maxEmitBox`

```javascript
particleSystem.minEmitBox = new BABYLON.Vector3(-2, -3, 4); 
particleSystem.maxEmitBox = new BABYLON.Vector3(4, 2, 3); 
```

The box can be collapsed to a line in the direction of an axis, for example the X-axis

![EmitBox](/img/how_to/Particles/12-2.png)

```javascript
particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); 
particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); 
```

 ## Basic Playground Example
 At his point you can now create a particle system though it is very uninspiring. Just a few particles appearing in the spread space, drifting around and disappearing. 

 * [Playground Example - Basic Creation Small Spread](https://www.babylonjs-playground.com/#TUNZFH)
 * [Playground Example - Basic Creation Larger Spread](https://www.babylonjs-playground.com/#TUNZFH#1)

Fortunately things can be made more interesting very soon with the setting of more properties. Read on.  

## Fine Tune Particle System
See how to change the lifetime, size, and color of the particles, their rates of emission, direction of travel (optionally affected by gravity). You can also affect their rotation, speed and cloud shape. Below you can find [playground examples]() where you can alter some of these parameters.

### Lifetime
The time taken for particles to disappear (or die) after being emitted can be varied. Once a particle dies, the particle is then recycled for reemission. Their lifetime is given as a random range between a low and high value as in 

```javascript
// Life time of each particle (random between...)
particleSystem.minLifeTime = 0.3;
particleSystem.maxLifeTime = 1.5;
```

Starting with Babylon.js v3.3, you can also define the lifetime respectively to the particle system duration.
For instance, if your call `system.targetStopDuration = 0.5` then you can define particle life time with a gradient like this:

```
particleSystem.addLifeTimeGradient(0, 0.5);
particleSystem.addLifeTimeGradient(1, 0);
```
The first parameter defines the gradient (0 means at the particle system start and 1 means at particle system end). The second parameter is the particle life time. This means that at the beginning of the particle system, particles will receive a life time set to 0.5. And when the system will be close to the `targetStopDuration` the particles will receive a life time close to 0.

It is recommended to at least define a gradient for 0 and 1.

You can add as much gradients as you want as long as the gradient value is between 0 and 1.

You can also define a more complex construct by providing two values per gradient:

```
particleSystem.addLifeTimeGradient(0, 0.5, 0.8);
particleSystem.addLifeTimeGradient(1.0, 0, 0.1);
```

In this case the life time of the particle will be randomly picked between the two values when the gradient will be reached.

To remove a gradient you can call `particleSystem.removeLifeTimeGradient(0.5)`.

### Size
The size of the particles can also be varied randomly within a given range.

```javascript
// Size of each particle (random between...)
particleSystem.minSize = 0.1;
particleSystem.maxSize = 0.5;
```

If you want to change the particle size to not be a square you can then use the min/max for ScaleX/Y:
```javascript
// Scale of each particle (random between...)
particleSystem.minScaleX = 0.1;
particleSystem.maxScaleX = 0.5;

particleSystem.minScaleY = 0.2;
particleSystem.maxScaleY = 0.4;
```

Starting with Babylon.js v3.3, you can also define size factor gradients.

To add a size gradient just call the following code:

```
particleSystem.addSizeGradient(0, 0.5);
```

The first parameter defines the gradient (0 means at the particle birth and 1 means at particle death). The second parameter is the size. In this case the particle will be born with size 0.5 and will end its life with size 3.
It is recommended to at least define a gradient for 0 and 1:

```
particleSystem.addSizeGradient(0, 0.5);
particleSystem.addSizeGradient(1.0, 3);
```

You can add as much gradients as you want as long as the gradient value is between 0 and 1.

You can also define a more complex construct by providing two values per gradient:

```
particleSystem.addSizeGradient(0, 0.5, 0.8);
particleSystem.addSizeGradient(1.0, 3, 4);
```

In this case the size of the particle will be randomly picked between the two values when the gradient will be reached.

To remove a gradient you can call `particleSystem.removeSizeGradient(0.5)`.

When dealing with particle size, you may need to move the pivot (aka the center of the transform). By default the scale will come from the center of the particle but you may want to scale it from the top or the bottom. To change the pivot position, just call:

```
particleSystem.translationPivot = new BABYLON.Vector2(0, -0.5); // In this case the scale will come from the bottom of the particle
```

Here is an example with size gradients and a pivot set to bottom: https://www.babylonjs-playground.com/#L9QWZB#0

### Particle Colors
There are three colors that can be set for the particle system, two which are combined (or blended) during the lifetime of the particle and a third that it takes on just before it disappears. 

```javascript
particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
```

Starting with Babylon.js v3.3, you can also define color gradients. If you define color gradients the color1, color2 and colorDead properties will be ignore.

To add a color gradient just call the following code:

```
particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0));
```

The first parameter defines the gradient (0 means at the particle birth and 1 means at particle death).
It is recommended to at least define a gradient for 0 and 1:

```
particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0));
particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 1));
```

You can add as much gradients as you want as long as the gradient value is between 0 and 1.

You can also define a more complex construct by providing two colors per gradient:

```
particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0), new BABYLON.Color4(1, 0, 1, 0));
particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 1), new BABYLON.Color4(1, 0, 1, 1));
```

In this case the color of the particle will be randomly picked between the two colors when the gradient will be reached.

To remove a gradient you can call `particleSystem.removeColorGradient(0.5)`.

Here is an example of color gradients: https://www.babylonjs-playground.com/#MX2Z99#8

### Particle blending
There are different ways that particles are blended with the scene and these are set with `blendMode`.

```javascript
particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
```

```javascript
particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
```

`BLENDMODE_ONEONE` is the default and will be used if `blendMode` is not specified.

* `BLENDMODE_ONEONE` - colors are added without alpha affecting the result;
* `BLENDMODE_STANDARD` - colors are added using particle’s alpha (ie. color * (1 - alpha) + particleColor * alpha).
* `BLENDMODE_ADD` - colors are added but only particle color uses particle’s alpha (ie. color + particleColor * alpha).
* `BLENDMODE_MULTIPLY` - colors are multiplied and added to (1 - alpha) (ie. color * particleColor +  1 - alpha). [Demo here](https://playground.babylonjs.com/#KUDH9F#1)
* `BLENDMODE_MULTIPLYADD` - two passes rendering with `BLENDMODE_MULTIPLY` and then `BLENDMODE_ADD`. [Demo here](https://www.babylonjs-playground.com/#VS5XS7#0)

### Rates
The `emitRate` determines the number of particles emitted per second. The larger the number the more dense appears the emitted cloud of particles. As particles die they are recycled to be emitted again. If their lifetime is long enough and their emission rate fast enough it is possible for there to be a gap in the emission of particles. 

![emitRate](/img/how_to/Particles/12-3.png)

```javascript
particleSystem.emitRate = 1000;
```

You can stop the continuous emission of particles by setting a manual emit count.

```javascript
particleSystem.manualEmitCount = 300;
```

In this case the number of particles given by the count are emitted and there are no further emissions of particles.

### Direction
Two directions can be specified. If you specify just one direction the particles will travel randomly in the general direction given. When both directions are given the particles will generally travel inside the two directions.

```javascript
particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
```
Direction can also be affected by gravity.

### Gravity
A value for gravity can be applied. For example if negative in the Y direction the particles will slowly be pulled downwards.

```javascript
//Set the gravity of all particles (not necessarily down)
particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
```

### Rotation
You can define a range of angular speeds for the particles about the Z-axis for the particles in radians per second:

```javascript
particleSystem.minAngularSpeed = 0;
particleSystem.maxAngularSpeed = Math.PI;
```

You can also define the initial rotation angle with:

```
particleSystem.minInitialRotation = 0;
particleSystem.maxInitialRotation = Math.PI;
```

Starting with Babylon.js v3.3, you can also define angular speed factor gradients.

To add a angular speed gradient just call the following code:

```
particleSystem.addAngularSpeedGradient(0, 0.5);
```

The first parameter defines the gradient (0 means at the particle birth and 1 means at particle death). The second parameter is the angular speed to use. In this case the particle will born with an angular speed set to 0.5 radians per frame.
It is recommended to at least define a gradient for 0 and 1:

```
particleSystem.addAngularSpeedGradient(0, 0.5);
particleSystem.addAngularSpeedGradient(1.0, 3);
```

You can add as much gradients as you want as long as the gradient value is between 0 and 1.

You can also define a more complex construct by providing two values per gradient:

```
particleSystem.addAngularSpeedGradient(0, 0.5, 0.8);
particleSystem.addAngularSpeedGradient(1.0, 3, 4);
```

In this case the angular speed of the particle will randomly be picked between the two values when the gradient will be reached.

To remove a gradient you can call `particleSystem.removeAngularSpeedGradient(0.5)`.


### Speed
You can define a range for the power of the emitting particles, and the overall motion speed (0.01 is default update speed, faster updates = faster animation).

  ```javascript
  particleSystem.minEmitPower = 1;
  particleSystem.maxEmitPower = 3;
  particleSystem.updateSpeed = 0.005;
  ```

### Velocity over time
You can define velocity over time with gradients. The velocity over time is the energy (or the factor) applied to direction of the particle. A value of 2 will multiply the direction size by two hence multiplying the particle speed by 2.

To add a velocity gradient just call the following code:

```
particleSystem.addVelocityGradient(0, 0.5);
```

The first parameter defines the gradient (0 means at the particle birth and 1 means at particle death). The second parameter is the velocity to use. In this case the particle will born with velocity set to 0.5.
It is recommended to at least define a gradient for 0 and 1:

```
particleSystem.addVelocityGradient(0, 0.5);
particleSystem.addVelocityGradient(1.0, 3);
```

You can add as much gradients as you want as long as the gradient value is between 0 and 1.

You can also define a more complex construct by providing two values per gradient:

```
particleSystem.addVelocityGradient(0, 0.5, 0.8);
particleSystem.addVelocityGradient(1.0, 3, 4);
```

In this case the velocity of the particle will randomly be picked between the two values when the gradient will be reached.

Here is an example of velocity applied to a particle system: https://www.babylonjs-playground.com/#3W04PW#0

To remove a gradient you can call `particleSystem.removeVelocityGradient(0.5)`. 

### Limit velocity over time
You can define a limit for velocity over time with gradients. This limit will be used to check the current speed of the particle and if the limit is reached then a factor will be applied to the speed.
You can define this factor with `particleSystem.limitVelocityDamping`. 

To add a limit velocity gradient just call the following code:

```
particleSystem.addLimitVelocityGradient(0, 0.5);
```

The first parameter defines the gradient (0 means at the particle birth and 1 means at particle death). The second parameter is the limit velocity to use. In this case, the particle speed will be check directly after birth and if it is bigger than 0.5 then the damping parameter will be applied (so velocity will be code velocity * damping).

It is recommended to at least define a gradient for 0 and 1:

```
particleSystem.addLimitVelocityGradient(0, 0.5);
particleSystem.addLimitVelocityGradient(1.0, 3);
```

You can add as much gradients as you want as long as the gradient value is between 0 and 1.

You can also define a more complex construct by providing two values per gradient:

```
particleSystem.addLimitVelocityGradient(0, 0.5, 0.8);
particleSystem.addLimitVelocityGradient(1.0, 3, 4);
```

In this case the limit velocity of the particle will randomly be picked between the two values when the gradient will be reached.

Here is an example of limit velocity applied to a particle system: https://www.babylonjs-playground.com/#9GBBPM#2

To remove a gradient you can call `particleSystem.removeLimitVelocityGradient(0.5)`.

### Drag factor
You can define a drag factor over time with gradients. This factor will be used to simulate air friction by applying a drag factor to the particle direction. For instance, if your drag factor is set to 0.8 then only 20% of the particle direction will be added to particle position.

To add a drag gradient just call the following code:

```
particleSystem.addDragGradient(0, 0.5);
```

The first parameter defines the gradient (0 means at the particle birth and 1 means at particle death). The second parameter is the drag factor to use. In this case, the particle position will be `particle.position = particle.direction * (1.0 - 0.5)`.

It is recommended to at least define a gradient for 0 and 1:

```
particleSystem.addDragGradient(0, 0.5);
particleSystem.addDragGradient(1.0, 3);
```

You can add as much gradients as you want as long as the gradient value is between 0 and 1.

You can also define a more complex construct by providing two values per gradient:

```
particleSystem.addDragGradient(0, 0.5, 0.8);
particleSystem.addDragGradient(1.0, 0, 0.1);
```

In this case the drag factor of the particle will randomly be picked between the two values when the gradient will be reached.

Here is an example of drag factor applied to a particle system: https://www.babylonjs-playground.com/#BDW3BF#0

To remove a gradient you can call `particleSystem.removeDragGradient(0.5)`.

### Emit rate over time
You can define particle emit rate with gradients. The emit rate over time will overwrite the value of `system.emitRate` property.

To add an emit rate gradient just call the following code:

```
particleSystem.addEmitRateGradient(0, 10);
```

**Please note that emit rate gradient will only work if the system has a determined life time meaning that you must define the `system.targetStopDuration` property**

The first parameter defines the gradient (0 means at system start and 1 means at system end). The second parameter is the emit rate to use. In this case the system will start by emitting 10 particles per frame.
It is recommended to at least define a gradient for 0 and 1:

```
particleSystem.addEmitRateGradient(0, 10);
particleSystem.addEmitRateGradient(1.0, 500);
```

You can add as much gradients as you want as long as the gradient value is between 0 and 1.

You can also define a more complex construct by providing two values per gradient:

```
particleSystem.addEmitRateGradient(0, 5, 10);
particleSystem.addEmitRateGradient(1.0, 800, 1000);
```

In this case the emit rate will randomly be picked between the two values when the gradient will be reached.

Here is an example of emit rate gradients applied to a particle system: https://www.babylonjs-playground.com/#3NM14X#0

To remove a gradient you can call `particleSystem.removeEmitRateGradient(0.5)`. 

### Start size over time
To add an start size gradient just call the following code:

```
particleSystem.addStartSizeGradient(0, 2);
```

**Please note that start size gradient will only work if the system has a determined life time meaning that you must define the `system.targetStopDuration` property**

The first parameter defines the gradient (0 means at system start and 1 means at system end). The second parameter is the start size scale to use. In this case the system will start by emitting particles of size 2 times the original size. (eg. if size is set to 2 and start size is set to 3 the resulting output size will be 6)
It is recommended to at least define a gradient for 0 and 1:

```
particleSystem.addStartSizeGradient(0, 10);
particleSystem.addStartSizeGradient(1.0, 500);
```

You can add as much gradients as you want as long as the gradient value is between 0 and 1.

You can also define a more complex construct by providing two values per gradient:

```
particleSystem.addStartSizeGradient(0, 5, 10);
particleSystem.addStartSizeGradient(1.0, 800, 1000);
```

In this case the start size will randomly be picked between the two values when the gradient will be reached.

Here is an example of start size gradients applied to a particle system: https://www.babylonjs-playground.com/#3NM14X#14

To remove a gradient you can call `particleSystem.removeStartSizeGradient(0.5)`. 

### Ramp gradients
You can use ramp gradients to change the color of the particle based on alpha.

Ramp gradients are pretty powerful but require a bit of setup.

First you need to declare your ramp gradients:
```
system.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
system.addRampGradient(0.09, new BABYLON.Color3(209/255, 204/255, 15/255));
system.addRampGradient(0.18, new BABYLON.Color3(221/255, 120/255, 14/255));
system.addRampGradient(0.28, new BABYLON.Color3(200/255, 43/255, 18/255));
system.addRampGradient(0.47, new BABYLON.Color3(115/255, 22/255, 15/255));
system.addRampGradient(0.88, new BABYLON.Color3(14/255, 14/255, 14/255));
system.addRampGradient(1.0, new BABYLON.Color3(14/255, 14/255, 14/255));
```

These gradients will be use to build a ramp color texture.

Then you need to turn them on:
```
system.useRampGradients = true;
```

By defaut the alpha value of the particle (built from `textureAlpha * particleColorAlpha`) is used to get the ramp color (Alpha is the index in the ramp gradients list) using this formula: `finalColor = textureColor * particleColor * rampColor[alphaIndex]`.

But to give you more control you can use a remap function to change remap this alpha index:
```
system.addColorRemapGradient(0, 0, 0.1);
system.addColorRemapGradient(0.2, 0.1, 0.8);
system.addColorRemapGradient(0.3, 0.2, 0.85);
system.addColorRemapGradient(0.35, 0.4, 0.85);
system.addColorRemapGradient(0.4, 0.5, 0.9);
system.addColorRemapGradient(0.5, 0.95, 1.0);
system.addColorRemapGradient(1.0, 0.95, 1.0);
```

The color remap gradients define a min and max that will vary over time (depending on hoe many gradients you add). The alpha index is then remap from [min, max] to [0, 1] with this formula: `finalAlphaIndex = clamp((alphaIndex - min) / (max - min), 0.0, 1.0)`.

Ultimately you can also remap the alpha value generated per pixel with:
```
system.addAlphaRemapGradient(0, 0, 0.1);
system.addAlphaRemapGradient(1.0, 0.1, 0.8);
```

The alpha remap will compute the final alpha value using this formula: `finalAlpha = clamp((textureAlpha * particleColorAlpha * rampColor.a - min) / (max - min), 0.0, 1.0)`.

You can find a demo of the here: https://www.babylonjs-playground.com/#VS5XS7#0

### Alignment
By default all particles are rendered as billboards. But you can decide to instead align them with particle direction with `system.isBillboardBased = false`.

You can find a demo [here](https://www.babylonjs-playground.com/#EV0SEQ)

When billboard is enabled you can decide to either have a full billboard (on all axes) or only on Y axis with this code:

```
system.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_Y;
```

You can also use stretched billboard which will be like a full billboard mode but with an additionnal rotation to align particles with their direction.

A demo can explain this billboard mode better than words: https://www.babylonjs-playground.com/#B9HKG0#0

You can also find a demo of stretched billboard particles: https://www.babylonjs-playground.com/#5A4TP5

## Adjustable Playground Examples
[THESE TWO PGS NEED CHANGING TO USE GUI]
* [Playground Example - Adjust Min & Max of EmitBox](https://www.babylonjs-playground.com/#LMG759)
* [Playground Example - Adjust Emit Life Time, Rate, Power and Update Speed](https://www.babylonjs-playground.com/#63PJFT)

## Shape Emitters
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

### Point Emitter

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

* [Playground Example - Point Emitter](https://www.babylonjs-playground.com/#08YT34)

### Box Emitter

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

* [Playground Example - Box Emitter](https://www.babylonjs-playground.com/#MRRGXL#1)

### Sphere Emitter

You can create a sphere emitter with a given radius, 1.2 for example,  using

```javascript
var sphereEmitter = particleSystem.createSphereEmitter(1.2);
```
The returned `sphereEmitter` object can be used to change the value of the radius.

The particles are emitted in the direction of the surface normals, ie the lines from the center of the sphere through a surface point.

* [Playground Example - Sphere Emitter](https://www.babylonjs-playground.com/#MRRGXL#2)

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

* [Playground Example - Sphere Emitter with Directions](https://www.babylonjs-playground.com/#MRRGXL#3)

### Hemispheric Emitter

You can create a hemispheric emitter with a given radius, 1.2 for example,  using

```javascript
var hemisphericEmitter = particleSystem.createHemisphericEmitter(1.2);
```
The returned `hemisphericEmitter` object can be used to change the value of the radius.

The particles are emitted in the direction of the surface normals, ie the lines from the center of the hemisphere through a surface point.

* [Playground Example - Hemispheric Emitter](https://www.babylonjs-playground.com/#FHIQYC)

With `hemisphericEmitter.radiusRange` you can define where along the radius the particles should be emitted. A value of 0 means only on the surface while a value of 1 means all along the radius.

### Cylinder Emitter

You can create a cylinder emitter with a given radius, height, radiusRange, directionRandomizer with the following:

```javascript
var cylinderEmitter = particleSystem.createCylinderEmitter(1,1,0,0);
```
The returned `cylinderEmitter` object can be used to change the value of the radius, height, etc.

The particles are emitted in the direction of the surface normals, ie outward from the cylinder

* [Playground Example - Cylinder Emitter](https://www.babylonjs-playground.com/#UL4WC0)

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

* [Playground Example - Cylinder Emitter with Directions](https://www.babylonjs-playground.com/#UL4WC0#5)

### Cone Emitter

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

Here is an example of a particle system emitted only from the outside of a flat cone: https://www.babylonjs-playground.com/#B9HKG0#1

The returned `coneEmitter` object can be used to change the values of these properties.

```javascript
coneEmitter.radius = 3.4;
coneEmitter.angle = Math.PI / 2;    
```

With `coneEmitter.emitFromSpawnPointOnly = true` you can force the emitter to only emit particles from the spawn point (the start of the cone).

* [Playground Example - Cone Emitter](https://www.babylonjs-playground.com/#MRRGXL#4)
* [Playground Example - Cone Emitter Rotating](https://www.babylonjs-playground.com/#MRRGXL#5)


### Mesh Emitter

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

Here is an example of a mesh particle emitter: https://www.babylonjs-playground.com/#N775HF

### Custom Emitter

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

Here is an example of a custom particle emitter: https://www.babylonjs-playground.com/#77BKY4

## Noise texture
Starting with Babylon.js v3.3, you can now use noise texture to "perturbate" the position of particles. The noise texture is technically used to apply change to the direction of the particles:

```
var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
noiseTexture.animationSpeedFactor = 5;
noiseTexture.persistence = 2;
noiseTexture.brightness = 0.5;
noiseTexture.octaves = 2;

particleSystem.noiseTexture = noiseTexture;
particleSystem.noiseStrength = new BABYLON.Vector3(100, 100, 100);
```

Alongside setting the noiseTexture you can also control the strength applied on each axis with `particleSystem.noiseStrength`.

Demo can be found here: https://www.babylonjs-playground.com/#R1JWLA#3

## GPU Particles

Starting from Babylon.js v3.2, you can leverage a new WebGL2 feature, the transform feedback buffer, to drastically boost the performance of particles. Whereas regular particles use the CPU for animation and the GPU for rendering the new WebGL2 API allows Babylon.js to use the GPU for both animation and rendering. With GPU particles, everything is offloaded to the GPU.

Unfortunately this feature is only available when WebGL2 is available. You can use `BABYLON.GPUParticleSystem.IsSupported` to detect if GPU particles can be used. When they are supported, GPU particles can almost be used like regular particles:

```javascript
var particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity:1000000 }, scene);
```

As CPU is no longer involved, you can go crazy with active particles (1000000 in this example). Also, you can use `particleSystem.activeParticleCount` to define the number of active particle count if you want to limit the GPU usage.

**Note:** Sub emitters are not supported in GPU particles.

### Random Texture
It is a shame but there is no good way to get random numbers when running on the GPU. To fill this gap, Babylon.js will create a texture filled with thousands of random values. These values will be read by the particle update shader to animate the particles.
By default the biggest supported texture size is used (16K). You may want to reduce the size of this texture by initializing the system like this:

```javascript
var particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity:1000000, randomTextureSize: 4096 }, scene);
```

### Fallback
As the GPUParticleSystem and the ParticleSystem share almost all their API, it is easy to switch from one to another when WebGL2 is not supported. Keep in mind that the CPU cannot animate as many particles as the GPU can. So you will probably have to reduce the capacity of your system when not using the GPUParticleSystem.

### Stopping a GPU Particle System
When calling `system.stop()` on a `GPUParticleSystem` object, you will force the system to stop generating new particles. But particles will still be rendered even if not visible.

To completely stop a `GPUParticleSystem`, you have to call `dispose()` on it.

### Unsupported Features
The following features are not supported by GPU particles due to their inner nature:
- ManualEmitCount
- Custom effects
- disposeOnStop
- Dual values per gradient (only one value is supported)
- Emit rate gradients are not supported
- Start size gradients are not supported
- Mesh emitter

### Playground

* [Playground Example - GPU Particles](https://www.babylonjs-playground.com/#PU4WYI#4)

## Snippet server

Starting with Babylon.js v4.2, you can edit particle systems using the Inspector. You can then save them on Babylon.js snippet server.
When you have a snippet Id, you can easily load the particle system using the following code:

```
var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2, segments: 32}, scene);
BABYLON.ParticleHelper.CreateFromSnippetAsync("T54JV7", scene, false).then(system => {
    system.emitter = sphere;
});
```

## Next step
ParticleSystems are very powerful and versatile tools that can help bring realness and movement to your scenes. Don’t hesitate to use them as they are not resource-intensive.

Stay with us, because we are going to learn a new, very interesting thing: [Configuring your environment](/babylon101/Environment).

# Further Reading

## Basic - L1

[Particles Overview](/features/Particles)  
[Particle Helper](/How_To/ParticleHelper)  
[Mesh Overview](/features/Shapes)

[How to Create Animated Particles](/how_to/Animate)  
[How to Use Sub Emitters](/how_to/Sub_Emitters)

[Solid Particle System](/How_To/Solid_Particles)  
[Points Cloud Particle System](/How_To/point_Cloud_Particles)

## Intermediate - L2
[How to Customize the Particle System](/how_to/Customise)  
[How to Create animated particles](/how_To/Particles/Animate.md)


