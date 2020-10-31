# Road Procedural texture

![Road Procedural texture](/img/extensions/proceduraltextures/roadpt.png)

# Using the Road procedural texture

Road procedural texture can be found here: 
- Normal: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.roadProceduralTexture.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.roadProceduralTexture.js)
- Minified : [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.roadProceduralTexture.min.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.roadProceduralTexture.min.js) 

A demo can be found here:  https://www.babylonjs-playground.com/##FBW4N#0

This texture has 1 parameter :
- **roadColor** is the color for the road (BABYLON.Color3/4)


```
    var roadmaterial = new BABYLON.StandardMaterial("road", scene);
    var roadmaterialpt = new BABYLON.RoadProceduralTexture("customtext", 512, scene);
    roadmaterial.diffuseTexture = roadmaterialpt;
```
