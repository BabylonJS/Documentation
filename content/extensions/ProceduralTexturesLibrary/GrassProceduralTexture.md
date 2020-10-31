# Grass Procedural texture

![Grass Procedural texture](/img/extensions/proceduraltextures/grasspt.png)

# Using the Grass procedural texture

Grass procedural texture can be found here: 
- Normal: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.grassProceduralTexture.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.grassProceduralTexture.js)
- Minified : [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.grassProceduralTexture.min.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.grassProceduralTexture.min.js)

A demo can be found here:  https://www.babylonjs-playground.com/#KM3TC#1

This texture has 2 parameters :
- **grassColors** is an array of 3 (BABYLON.Color3/4) for the grass. Should be green but you can create red grass if you want to (BABYLON.Color3/4)
- **groundColor** is the base color for the ground (BABYLON.Color3/4)


```
    var grassMaterial = new BABYLON.StandardMaterial(name + "bawl", scene);
    var grassTexture = new BABYLON.GrassProceduralTexture(name + "textbawl", 256, scene);
    grassMaterial.ambientTexture = grassTexture;
```
