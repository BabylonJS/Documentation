---
title: Customizing Particles
image:
description: Learn how to customize particles in Babylon.js.
keywords: diving deeper, particles, particle system, customization, particle customization
further-reading:
video-overview:
video-content:
---

## How To Customize Particles

As you will have seen, there are many properties of the particle system that can be tweaked to control its look. Babylon.js allows you even more customization to obtain the system you want. These can be split into two types: Custom Functions and Custom Effects.

## Custom Functions

There are three methods you can customize:

- `startDirectionFunction`: specifies the direction for each new particle;
- `startPositionFunction`: specifies the start position for each new particle;
- `updateFunction`: provides an update to each particle on each frame and can affect position, color, age, size etc. Try to keep it simple and fast.

You can directly attach all these functions to the particleSystem.

Since Babylon.js V3.2 you can use the first two, `startDirectionFunction` and `startPositionFunction`, in creating a new particle emitter type as was done with the [createBoxEmitter, createSphereEmitter and createConeEmitter](/features/featuresDeepDive/particles/particle_system/shape_emitters).

### Direct

The start direction function has the default form

```javascript
particleSystem.startDirectionFunction = (worldMatrix: Matrix, directionToUpdate: Vector3, particle: Particle, isLocal: boolean) {
    var randX = randomNumber(this.direction1.x, this.direction2.x);
    var randY = randomNumber(this.direction1.y, this.direction2.y);
    var randZ = randomNumber(this.direction1.z, this.direction2.z);

    Vector3.TransformNormalFromFloatsToRef(randX, randY, randZ, worldMatrix, directionToUpdate);
}
```

The start position function has the default form

```javascript
particleSystem.startPositionFunction = (worldMatrix: Matrix, positionToUpdate: Vector3, particle: Particle, isLocal: boolean): void => {
  var randX = randomNumber(this.minEmitBox.x, this.maxEmitBox.x);
  var randY = randomNumber(this.minEmitBox.y, this.maxEmitBox.y);
  var randZ = randomNumber(this.minEmitBox.z, this.maxEmitBox.z);

  Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
};
```

The update function has the default form

```javascript
updateFunction = function (particles) {
  for (let index = 0; index < particles.length; index++) {
    var particle = particles[index];
    particle.age += this._scaledUpdateSpeed;

    if (particle.age >= particle.lifeTime) {
      // Recycle
      particles.splice(index, 1);
      this._stockParticles.push(particle);
      index--;
      continue;
    } else {
      particle.colorStep.scaleToRef(this._scaledUpdateSpeed, this._scaledColorStep);
      particle.color.addInPlace(this._scaledColorStep);

      if (particle.color.a < 0) particle.color.a = 0;

      particle.angle += particle.angularSpeed * this._scaledUpdateSpeed;

      particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
      particle.position.addInPlace(this._scaledDirection);

      this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
      particle.direction.addInPlace(this._scaledGravity);
    }
  }
};
```

Two simple examples of customizing the update function

**Randomize the Particle's Color per Frame**

Add the line in the `else` section

```javascript
particle.color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), 1);
```

<Playground id="#MRRGXL#6" title="Random Colored Particles" description="Simple example of creating random colored particles."/>

**Grow Particles from Size 0 to a Final Size**

A little trickier since the particles are to start from size 0, both min and max sizes must be 0. And a new property must be added to give the final size.

Add in main body of code

```javascript
particleSystem.minSize = 0;
particleSystem.maxSize = 0;

particleSystem.finalSize = 1;
```

And in the `else` section, to get the particle to its final size by 35% of life time add

```javascript
if (particle.age < particle.lifeTime * 0.35) {
  particle.size = (particleSystem.finalSize * particle.age) / (particle.lifeTime * 0.35);
}
```

<Playground id="#WJBZQH#2" title="Growing Particles" description="Simple example of creating growing particles."/>

### Particle Emitter Type

Starting from Babylon.js V3.2 you can create a new object of type `IParticleEmitterType` into the particle system. [Examples](/features/featuresDeepDive/particles/particle_system/shape_emitters) of this type of object are `sphereParticleEmitter` and `coneParticleEmitter` which are produced by using createSphereEmitter and createConeEmitter.

These objects are assigned to a new property `particleEmitterType` of the particleSystem.

You use the `startDirectionFunction` and `startPositionFunction` as methods for objects of this type to determine the region of space that the particles are emitted from and their direction of travel.

You can create your own ParticleEmitterType by extending IParticleEmitterType and assigning it to `particleEmitterType`, overriding the default methods `startDirectionFunction` and `startPositionFunction`.

Below is an example to create a new spray emitter which will send streams of particles out of the top, bottom and sides of a cylindrical region.

#### Create Spray Emitter

In order to determine where a particle is emitted from, the cylinder is divided into two regions as in the diagram below.

![cylinder emitter](/img/how_to/particles/cyl_particles.png)

Any particle with a start position inside the red region is emitted in the direction from the center to the particle. Any particle with a start position inside the blue region is emitted horizontally.

The `createSprayEmitter` method sets the radius and height of the cylinder, creates a new `SprayParticleEmitter` object which is assigned to the `particleEmitterType` property.

```javascript
BABYLON.ParticleSystem.prototype.createSprayEmitter = function (radius, height) {
  if (radius === void 0) {
    radius = 0.5;
  }
  if (height === void 0) {
    height = 1;
  }
  var particleEmitter = new BABYLON.SprayParticleEmitter(radius, height);
  this.particleEmitterType = particleEmitter;
  return particleEmitter;
};
```

The `SprayParticleEmitter` class is formed with two methods `startDirectionFunction` and `startPositionFunction` and Babylon.js takes care of the rest.

```javascript
var SprayParticleEmitter = (function () {
  function SprayParticleEmitter(radius, height, directionRandomizer) {
    if (radius === void 0) {
      radius = 0.5;
    }
    if (height === void 0) {
      height = 1;
    }
    if (directionRandomizer === void 0) {
      directionRandomizer = 0;
    }
    this.height = height;
    this.directionRandomizer = directionRandomizer;
    this.radius = radius;
  }

  SprayParticleEmitter.prototype.startDirectionFunction = function (worldMatrix, directionToUpdate, particle) {
    var direction = particle.position.subtract(worldMatrix.getTranslation()).normalize();
    var randX = BABYLON.Scalar.RandomRange(0, this.directionRandomizer);
    var randY = BABYLON.Scalar.RandomRange(0, this.directionRandomizer);
    var randZ = BABYLON.Scalar.RandomRange(0, this.directionRandomizer);
    if (direction.x * direction.x + direction.z * direction.z > 0.1 * this.radius && Math.abs(direction.y) > (0.1 * this.height) / 2) {
      direction.x += randX;
      direction.y = randY;
      direction.z += randZ;
    } else {
      direction.x += randX;
      direction.y += randY;
      direction.z += randZ;
    }
    direction.normalize();
    BABYLON.Vector3.TransformNormalFromFloatsToRef(direction.x, direction.y, direction.z, worldMatrix, directionToUpdate);
  };

  SprayParticleEmitter.prototype.startPositionFunction = function (worldMatrix, positionToUpdate, particle) {
    var s = BABYLON.Scalar.RandomRange(0, Math.PI * 2);
    var h = BABYLON.Scalar.RandomRange(-0.5, 0.5);
    var radius = BABYLON.Scalar.RandomRange(0, this.radius);
    var randX = radius * Math.sin(s);
    var randZ = radius * Math.cos(s);
    var randY = h * this.height;
    BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(randX, randY, randZ, worldMatrix, positionToUpdate);
  };
  return SprayParticleEmitter;
})();
BABYLON.SprayParticleEmitter = SprayParticleEmitter;
```

<Playground id="#V07WF8#10" title="Custom Spray Emitter Showing Container" description="Simple example of a custom spray emitter showing container."/>
<Playground id="#V07WF8#11" title="Custom Spray Emitter Without Container" description="Simple example of a custom spray emitter without container."/>

## Custom Effects

A custom effect is achieved via a fourth parameter when creating a new particle system

```javascript
var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene, customEffect);
```

The customEffect is a type of BABYLON.Effect used to target a valid shader program and is created with the `createEffectForParticles` method of the `engine` object.

This method takes three parameters

```javascript
var customEffect = engine.createEffectForParticles(fragment, uniforms, samplers);
```

- fragment: string, the name of the fragment shader which can be in the [shaders store](/features/featuresDeepDive/materials/advanced/custom_procedural_textures#using-a-shaderstore-for-shader-storage) or the [id of a DOM element](/features/featuresDeepDive/materials/shaders/shaderCodeInBjs#shader-code-in-script-tags);
- uniforms: [strings], array of uniforms used in the shader;
- samplers: [strings], array of names of samplers for additional textures!

### Fragment Shader Assignment

When assigning a fragment shader to the shader store, the name should have `FragmentShader` appended. So for example, the creation of a custom effect using fragment name `myParticle` would require a `myParticleFragmentShader` added to the shader store

```javascript
BABYLON.Effect.ShadersStore["myParticleFragmentShader"] = [...]
```

```javascript
var customEffect = engine.createEffectForParticles("myParticle", [...]);
```

### Uniforms Assignment

By default Babylon.js will give you a vUV and a vColor varying parameter. It will also transmit you the particle texture.

You can add further uniform variables, for example to pass a `uniform` variable such as time, put it into the uniforms array

```javascript
var customEffect = engine.createEffectForParticles("myParticle", [time]);
```

then pass it using `setFloat` with an `onBind` method for `customEffect`.

```javascript
var time = 0;
var order = 0.1;

customEffect.onBind = function () {
  customEffect.setFloat("time", time);

  time += order;

  if (time > 100 || time < 0) {
    order *= -1;
  }
};
```

You can see an example of the above in this playground  
<Playground id="#1ASENS#43" title="Custom Effect using Shader Store" description="Simple example of a custom effect using shader store."/>

### Particle Effect Object

The particle effect object is a slightly modified [Babylon Effect Object](/typedoc/classes/babylon.effect). Also notice that the `ShadersStore` is a namespace upon this special-effect object.
