# Cloud Procedural texture

![Cloud Procedural texture](/img/extensions/proceduraltextures/cloudpt.png)

# Using the cloud procedural texture

Cloud procedural texture can be found here: 
- Normal: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.cloudProceduralTexture.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.cloudProceduralTexture.js)
- Minified : [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.cloudProceduralTexture.min.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/proceduralTexturesLibrary/babylon.cloudProceduralTexture.min.js)

A demo can be found here:  https://www.babylonjs-playground.com/##NQDNM#0

This texture has 2 parameters :
- **skyColor** : the color for the sky (BABYLON.Color3/4)
- **cloudColor** : the color for the cloud (BABYLON.Color3/4)

Sample to create a cloudy sky

```
var boxCloud = BABYLON.Mesh.CreateSphere("boxCloud", 100, 1000, scene);
boxCloud.position = new BABYLON.Vector3(0, 0, 12);
var cloudMaterial = new BABYLON.StandardMaterial("cloudMat", scene);
var cloudProcText = new BABYLON.CloudProceduralTexture("cloud", 1024, scene);
cloudMaterial.emissiveTexture = cloudProcText;
cloudMaterial.backFaceCulling = false;
cloudMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
boxCloud.material = cloudMaterial;
```



