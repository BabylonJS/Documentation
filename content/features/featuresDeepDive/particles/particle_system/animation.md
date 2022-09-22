---
title: Animating Particles
image:
description: Learn how to animate particles in Babylon.js.
keywords: diving deeper, particles, particle system, animation, particle animation
further-reading:
video-overview:
video-content:
---

## Creating Animated Particles

Here we are talking about the animation of the texture of a particle rather than any movement or the particle itself. This feature uses a similar system to that of sprite animation and was added to Babylon.js v3.1. As for sprite animation it require an uniform spritesheet.

You must set the property _isAnimationSheetEnabled_ as true for animated particles either on or after construction (fourth parameter)

```javascript
particleSystem = new BABYLON.ParticleSystem("particles", capacity, scene, null, true); // on construction

particleSystem = new BABYLON.ParticleSystem("particles", capacity);
particleSystem.isAnimationSheetEnabled = true; //after construction
```

As an example we are using the same spritesheet as for the sprite manager section of the documentstion.

![sheet](/img/how_to/sprites/08-2.png)

This spritesheet is used as the _particleTexture_

```javascript
particleSystem.particleTexture = new BABYLON.Texture("textures/player.png", scene, true, false);
```

In this case the third parameter _noMinMaps_ is set to true and the fourth, _invertY_ to false to read the texture data from top to bottom.

```javascript
particleSystem.spriteCellHeight = 64;
particleSystem.spriteCellWidth = 64;
particleSystem.startSpriteCellID = 0;
particleSystem.endSpriteCellID = 9;
particleSystem.spriteCellChangeSpeed = 4; // default is one
```

The _spriteCellHeight_ and _spriteCellWidth_ are are the cell width and height for each sprite in the animation sheet.

![Cell Dimensions](/img/how_to/sprites/08-1.png)

We are only going to use the first 10 cells of the spritesheets and so _startSpriteCellID_ is 0 and _endSpriteCellID_ is 9. The top, left most sprite is in cell 0 and you count from left to right from the top row downwards.

Starting with Babylon.js v3.3, you can also use

```javascript
particleSystem.spriteRandomStartCell = true;
```

to randomly pick the start cell id of each particles between _startSpriteCellID_ and _endSpriteCellID_.

To control the speed of animation you can play around with adjusting direction, emitPower and updateSpeed though doing this adjusts thee whole particle animation and not just the sprite animation frame rate.

To adjust the sprite animation frame rate you set the property _spriteCellChangeSpeed_. A value of 1 matches the animation rate to lifetime of a particle. The particle will be emitted with the sprite at _startSpriteCellID_ and will die displaying the sprite at _endSpriteCellID_. As values increase above 1 the animation frame rate speeds up. Although the particle will be emitted with the sprite at _startSpriteCellID_ the sprite on display when the particle dies will depend on the value of the speed and the lifetime of the particle.

## Examples

Adjust emit power and update speed: <Playground id="#0K3AQ2#47" title="Adjust Emit Power And Update Speed" description="Simple example of adjusting emit power and update speed."/>
Cell Change Speed: <Playground id="#0K3AQ2#48" title="Cell Change Speed" description="Simple example of adjusting the cell change speed."/>
