# Lava material

![Screenshot](/img/extensions/materials/lava.jpg)

# * [Playground example](https://www.babylonjs-playground.com/#1BLVWO#25)


Lava material can be found here: [https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/materialsLibrary/babylon.lavaMaterial.js](https://github.com/BabylonJS/Babylon.js/blob/master/dist/preview release/materialsLibrary/babylon.lavaMaterial.js)

# Using the lava material

The lava material needs at least a noise texture and a diffuse texture to render properly.
Just create a new reference of the material and assign it two textures:

```
var ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, scene);

var lavaMaterial = new BABYLON.LavaMaterial("lava", scene);
lavaMaterial.noiseTexture = new BABYLON.Texture("cloud.png", scene); // Set the bump texture
lavaMaterial.diffuseTexture = new BABYLON.Texture("lavatile.jpg", scene); // Set the diffuse texture

ground.material = lavaMaterial;
```

The diffuse texture will be the color of your lava, the noise texture will represent the lava deformation.
Notice that this material will update each vertex position of your object. If there are not enough vertices, 
some artefacts may appears.

# Lights
By default, the material is subject to lights. If you wish, you can cancel this by relying on the unlit property.
```
material.unlit = true;
```

[Online Demo](https://www.babylonjs-playground.com/#1BLVWO#22)

# Customize the lava material

You can customize two properties of the material:

```
lavaMaterial.speed = 2.0; // Default 1. Represents speed of perturbations of the lava
lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0); // Default to (0,0,0) black. Represents the color of the fog displayed on the lava ground.
```

