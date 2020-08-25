# Marble Procedural texture

![Marble Procedural texture](/img/extensions/proceduraltextures/marblept.png)

## Using the Marble procedural texture

Marble procedural texture can be found here: 
- Normal: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.marbleProceduralTexture.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.marbleProceduralTexture.js)
- Minified : [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.marbleProceduralTexture.min.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.marbleProceduralTexture.min.js)

A demo can be found here:  https://www.babylonjs-playground.com/#HS1SK#4

This texture has 4 parameters :
- **numberOfTilesHeight** controls the number of tiles in height (Int)
- **numberOfTilesWidth** controls the number of tiles in width (Int)
- **jointColor** changes the color for the joint between tiles (BABYLON.Color3/4)
- **marbleColor** changes the color for the tile itself (BABYLON.Color3/4)


```
	var marbleMaterial = new BABYLON.StandardMaterial("torus", scene);
    var marbleTexture = new BABYLON.MarbleProceduralTexture("marble", 512, scene);
    marbleTexture.numberOfTilesHeight = 5;
    marbleTexture.numberOfTilesWidth = 5;
    marbleMaterial.ambientTexture = marbleTexture;
```
