---
title: Getting Started - Chapter 2 - Texture
image: 
description: Continue your Babylon.js learning by adding materials to the objects in your scene.
keywords: getting started, start, chapter 2, material, materials
further-reading:
    - title: More on Materials
      url: /features/featuresDeepDive/materials
video-overview:
video-content:
---

# Getting Started - Texture

## Add Texture
In order to add color and texture to our meshes we apply a material to them. The basic material is the standard material created like this

```javascript
const material = new BABYLON.StandardMaterial("name", scene);
```
Let's make the ground color green for grass

```javascript
const groundMat = new BABYLON.StandardMaterial("groundMat");
groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
ground.material = groundMat; //Place the material property of the ground
```
Since there is only one scene we can drop that parameter and let it default to the current scene.

Setting a color requires three parameters, red, green, blue (r, g, b) each 0 - 1 inclusive (0, 0, 0) is black and (1, 1, 1) is white.  
For these colors you can use
```javascript
new BABYLON.Color3.Red();
new BABYLON.Color3.Green();
new BABYLON.Color3.Blue();
new BABYLON.Color3.Black();
new BABYLON.Color3.White();
new BABYLON.Color3.Purple();
new BABYLON.Color3.Magenta();
new BABYLON.Color3.Yellow();
new BABYLON.Color3.Gray(),
new BABYLON.Color3.Teal();
```
Now some texture for the box and roof
```javascript
const roofMat = new BABYLON.StandardMaterial("roofMat");
roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
const boxMat = new BABYLON.StandardMaterial("boxMat");
boxMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png");
```
The first parameter for a texture is a relative or absolute url to the image to be used. As usual the scene parameter is optional and will default to the current scene.

Finally of course set their material properties
```
roof.material = roofMat;
box.material = boxMat;
```

<Playground id="#KBS9I5#71" title="Adding Materials To Your Objects'" description="A playground demonstrating how to add materials to the objects in your scene." image="/img/playgroundsAndNMEs/gettingStartedMaterials.jpg"/>

![house 2](/img/getstarted/house2.png)

Having stone walls with no doors or windows is not an interesting look for a house. Also when you look closely you can see that each side uses the same image and on some sides it is rotated. 
