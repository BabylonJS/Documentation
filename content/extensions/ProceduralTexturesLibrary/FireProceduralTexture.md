# Fire Procedural texture

![Fire Procedural texture](/img/extensions/proceduraltextures/firept.png)

# Using the Fire procedural texture

Fire procedural texture can be found here: 
- Normal: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.fireProceduralTexture.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.fireProceduralTexture.js)
- Minified : [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.fireProceduralTexture.min.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.fireProceduralTexture.min.js)

A demo can be found here:  https://www.babylonjs-playground.com/#KM3TC

This texture has 4 parameters :
- **time** can be set manually(float) if autoGenerateTime(boolean) is set to false. It is used inside the fire shader to animate it
- **speed** controls the speed of the flames (BABYLON.Vector2)
- **shift** controls the direction of the flames (BABYLON.Vector2)
- **fireColors** is an array of 6 (BABYLON.Color3/4) defining the different color of the fire. You can define them manually of use presets available as static properties of the class (PurpleFireColors, GreenFireColors, RedFireColors, BlueFireColors)

```
    var fireMaterial = new BABYLON.StandardMaterial("fontainSculptur2", scene);
    var fireTexture = new BABYLON.FireProceduralTexture("fire", 256, scene);
    fireMaterial.diffuseTexture = fireTexture;
    fireMaterial.opacityTexture = fireTexture;
```
