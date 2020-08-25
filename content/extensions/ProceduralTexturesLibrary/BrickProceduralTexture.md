# Brick Procedural texture

![Brick Procedural texture](/img/extensions/proceduraltextures/brickpt.png)

## Using the Brick procedural texture

Brick procedural texture can be found here: 
- Normal: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.brickProceduralTexture.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.brickProceduralTexture.js)
- Minified : [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.brickProceduralTexture.min.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.brickProceduralTexture.min.js)

A demo can be found here:  https://www.babylonjs-playground.com/#1CL0BO

This texture has 4 parameters :
- **numberOfBricksHeight** controls the number of bricks in height (Int)
- **numberOfBricksWidth** controls the number of bricks in width (Int)
- **jointColor** changes the color for the joint between bricks (BABYLON.Color3/4)
- **brickColor** changes the color for the brick itself (BABYLON.Color3/4)

```
	var brickMaterial = new BABYLON.StandardMaterial(name, scene);
    var brickTexture = new BABYLON.BrickProceduralTexture(name + "text", 512, scene);
    brickTexture.numberOfBricksHeight = 6;
    brickTexture.numberOfBricksWidth = 10;
    brickMaterial.diffuseTexture = brickTexture;
```







