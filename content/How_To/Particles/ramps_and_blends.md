# Color Ramps and Blends, and Billboard Mode

## Ramp Gradients
Ramp gradients produce a gradient color texture by assigning a color to an index between 0 and 1

![ramp gradient](/img/how_to/Particles/rampgrad.png)

To produce a gradient color texture, such as the color bar above, you need the *addRampGradient* method

```javascript
particleSystem.addRampGradient(fraction_of_bar, color3);
```
For this particular color bar you use
```
particleSystem.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
particleSystem.addRampGradient(0.09, new BABYLON.Color3(209/255, 204/255, 15/255));
particleSystem.addRampGradient(0.18, new BABYLON.Color3(221/255, 120/255, 14/255));
particleSystem.addRampGradient(0.28, new BABYLON.Color3(200/255, 43/255, 18/255));
particleSystem.addRampGradient(0.47, new BABYLON.Color3(115/255, 22/255, 15/255));
particleSystem.addRampGradient(0.88, new BABYLON.Color3(14/255, 14/255, 14/255));
particleSystem.addRampGradient(1.0, new BABYLON.Color3(14/255, 14/255, 14/255));
```
To use them you need to turn them on.
```javascript
particleSystem.useRampGradients = true;
```

By default the alpha value of the particle (built from `textureAlpha * particleColorAlpha`) is used to as the index get the ramp color from the ramp gradient using this formula: `finalColor = textureColor * particleColor * rampColor`.

Ramp gradient https://www.babylonjs-playground.com/#0K3AQ2#42

To give you more control you can use a remap function to change the index over time with  
```javascript
particleSystem.addColorRemapGradient(fraction_of_lifetime_elapsed, minimum_index, maximum_index); //set a range of values for the index at the given time point
```

```javascript
particleSystem.addColorRemapGradient(0, 0, 0.1);
particleSystem.addColorRemapGradient(0.2, 0.1, 0.8);
particleSystem.addColorRemapGradient(0.3, 0.2, 0.85);
particleSystem.addColorRemapGradient(0.35, 0.4, 0.85);
particleSystem.addColorRemapGradient(0.4, 0.5, 0.9);
particleSystem.addColorRemapGradient(0.5, 0.95, 1.0);
particleSystem.addColorRemapGradient(1.0, 0.95, 1.0);
```

The color remap gradients define a min and max that will vary over the particle lifetime.  The index is then remapped from [min, max] to [0, 1] with this formula: `finalIndex = clamp((index - min) / (max - min), 0.0, 1.0)`.

With remap over lifetime of particle https://www.babylonjs-playground.com/#0K3AQ2#43

Ultimately you can also remap the alpha value generated per pixel with:
```
particleSystem.addAlphaRemapGradient(0, 0, 0.1);
particleSystem.addAlphaRemapGradient(1.0, 0.1, 0.8);
```

The alpha remap will compute the final index value using this formula: `finalIndex = clamp((textureAlpha * particleColorAlpha * rampColor.a - min) / (max - min), 0.0, 1.0)`.


# Particle blending
There are different ways that particles are blended with the scene and these are set with `blendMode`.

```javascript
particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
```

```javascript
particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
```

* `BLENDMODE_ONEONE` - colors are added without alpha affecting the result, default;
* `BLENDMODE_STANDARD` - colors are added using particle’s alpha (ie. color * (1 - alpha) + particleColor * alpha).
* `BLENDMODE_ADD` - colors are added but only particle color uses particle’s alpha (ie. color + particleColor * alpha).
* `BLENDMODE_MULTIPLY` - colors are multiplied and added to (1 - alpha) (ie. color * particleColor +  1 - alpha). 
* `BLENDMODE_MULTIPLYADD` - two passes rendering with `BLENDMODE_MULTIPLY` and then `BLENDMODE_ADD`. 

# Billboard Modes
By default all particles are rendered as billboards, that is to face the camera. But you can decide to instead align them with particle direction with 
```javascript
particleSystem.isBillboardBased = false;
```

When billboard is enabled you can decide to either have a full billboard (on all axes) or only on Y axis with this code:

```javascript
particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_Y;
```

You can also use stretched billboard which will be like a full billboard mode but with an additional rotation to align particles with their direction.

```javascript
particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_STRETCHED;
```

# Examples
Billboard mode Y - steam https://www.babylonjs-playground.com/#B9HKG0#0
Billboard false - spherical https://www.babylonjs-playground.com/#EV0SEQ
Multiply blend mode - smoke pillar https://playground.babylonjs.com/#KUDH9F#1  
Add blend mode and billboard mode stretched - sparks (select scene, press space) https://www.babylonjs-playground.com/#5A4TP5
Ramp and blend - explosion (select scene, press space) https://www.babylonjs-playground.com/#VS5XS7#0