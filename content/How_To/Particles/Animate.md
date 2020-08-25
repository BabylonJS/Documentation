# Creating Animated Particles

Starting from Babylon.js v3.1 the particle system will allow animated particles using a sprite animation map as its texture.

* [Playground Example - Animated Particle](https://www.babylonjs-playground.com/#CLN02N#3)

To enable animated particles you pass a fifth Boolean parameter in the `ParticleSystem` constructor with the value `true` (The fourth for the `GPUParticleSystem`). The default value for this parameter is false. 

You can also call `particleSystem.isAnimationSheetEnabled = true` at any time.

You then need to assign a sprite animation map as the `particleTexture` with the parameters as shown below and set some further properties of the `particleSystem` (please note that the texture as to be loaded with invertY set to false if you want to read texture data from top to bottom).

```javascript
var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene, null, true);
particleSystem.particleTexture = new BABYLON.Texture("textures/player.png", scene, true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);

particleSystem.spriteCellHeight = 64;
particleSystem.spriteCellWidth = 64;
particleSystem.startSpriteCellID = 0;
particleSystem.endSpriteCellID = 44;
particleSystem.spriteCellChangeSpeed = 4; // default is one
```

The `spriteCellHeight` and `spriteCellWidth` are are the cell width and height for each sprite in the animation sheet. 

![Cell Dimensions](/img/how_to/sprites/08-1.png)

The `startSpriteCellID` and `endSpriteCellID` are set based on the cell positions of the sprites on the animation sheet, the top most, left most sprite is in cell 0 and you count from left to right from the top row downwards.

![sheet](/img/how_to/sprites/08-2.png)

Starting with Babylon.js v3.3, you can also set `particleSystem.spriteRandomStartCell = true` to randomly pick the start cell id of each particles between `startSpriteCellID` and `endSpriteCellID`.

Setting the value of `spriteCellChangeSpeed` to 1 allows the `particleSystem` to match the animation to life time of a particle. The particle will be emitted with the sprite at `startSpriteCellID` and will die displaying the sprite at `endSpriteCellID`.

Giving `spriteCellChangeSpeed` a value above 1 will control the speed of the animation for a particle. The **larger** the number the **faster** the animation. Although the particle will be emitted with the sprite at `startSpriteCellID` the sprite on display when the particle dies will depend on the value of the speed and the life time of the particle and may vary.

# Further Reading

## Basic - L1

[Particles Overview](/features/Particles)  

[Particles 101](/babylon101/particles)
 
[How to Use Sub Emitters](/how_to/Sub_Emitters)

[Solid Particle System](/How_To/Solid_Particles)

## Intermediate - L2
[How to Customize the Particle System](/how_to/Customise) 
[Create animated particles](/how_to/Animate) 


