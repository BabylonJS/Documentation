# Wood Procedural texture

![Wood Procedural texture](/img/extensions/proceduraltextures/woodpt.png)

## Using the Wood procedural texture

Wood procedural texture can be found here: 
- Normal: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.woodProceduralTexture.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.woodProceduralTexture.js)
- Minified : [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.woodProceduralTexture.min.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.woodProceduralTexture.min.js)

A demo can be found here:  https://www.babylonjs-playground.com/#K41IJ

This texture has 2 parameters :
- **woodColor** to modify the color of the wood in the texture (BABYLON.Color3/4)
- **ampScale** to change the waves amplitude in the wood (BABYLON.Vector2)


```
	var woodMaterial = new BABYLON.StandardMaterial(name, scene);
    var woodTexture = new BABYLON.WoodProceduralTexture(name + "text", 1024, scene);
    woodTexture.ampScale = 80.0;
    woodMaterial.diffuseTexture = woodTexture;
```
