# An Introduction to the Particle System

The creation of a particle system requires a name and its capacity and the number of particles in the system (capacity). The system is designed to produce particles that emit at a given rate, move and last for a set lifetime before they are re-cycled and re-emitted.

```javascript
const myParticleSystem = new BABYLON.ParticleSystem("particles", capacity, scene); //scene is optional and defaults to the current scene
```

Before you can start the system running you need to provide a texture so that the particles can be seen. Also you need to set the point of origin for the particle emissions. You set this as an emitter, i.e. a mesh, whose position provides the emission origin or it can be just a vector3. Particles are emitted from random points inside a region of given size about the emission point of origin.

```javascript
myParticleSystem = new BABYLON.Texture("path to texture");

myParticleSystem.emitter = mesh;
myParticleSystem.emitter = point; //a Vector3

myParticleSystem.start(); //Starts the emission of particles
```

To stop the emission use
```javascript
myParticleSystem.stop();
```
While this stops the emission of new particles the ones already emitted will continue to exist up to their time limit.  To stop and clear particles at the same time use

```javascript
myParticleSystem.stop();
myParticleSystem.reset(); //Reset to empty system
```
Minimal particle system https://www.babylonjs-playground.com/#0K3AQ2#3

You can do this all in one line using the *ParticleHelper* to create a default configured particle system.

Default particle system using the helper https://www.babylonjs-playground.com/#0K3AQ2#4

Emit particles from a box position https://www.babylonjs-playground.com/#0K3AQ2#5  

By fixing the size of the emission region you can constrain the emission region. The values used will depend on the size of the emitted particles and the size of the region. The center of an emitted particle could be inside a box, say close to the edge, yet the particle could be big enough for its perimeter to be outside the box.

Emit particles from wholly inside the box https://www.babylonjs-playground.com/#0K3AQ2#7

When you want the particle system to start after 3 seconds for example you use one of the following

```javascript
myParticleSystem.start(3000); //time in milliseconds

myParticleSystem.startDelay = 3000;
```

Delayed start particle system https://www.babylonjs-playground.com/#0K3AQ2#8

To run the particle system for a limited time you use 
```javascript
myParticleSystem.targetStopDuration = 5;
```
The target duration before the system stops is dependent of the how fast the particles system updates the particles frames. The faster the update speed the shorter time before the system stops. You set the update speed using
```javascript
myParticleSystem.updateSpeed = 0.01;
```

Once stopped you can dispose of the particle system. Very useful if you want to create a one shot particle system with a specific targetStopDuration.

```javascript
myParticleSystem.disposeOnStop = true;
```

So far we have barely touched the surface of the particle system, time to show some tuning properties.


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

#

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


