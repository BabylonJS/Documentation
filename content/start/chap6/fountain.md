# Getting Started - Working With Code
## A Lathe Turned Fountain

Time to introduce another of the many ways to create a mesh, the *CreateLathe* method. We start with a profile for the fountain.

![profile](/img/getstarted/profile.png)

The profile is described, in an array, using the x and y components of a 3D vector.

```javascript
const fountainProfile = [
	new BABYLON.Vector3(0, 0, 0),
	new BABYLON.Vector3(10, 0, 0),
    new BABYLON.Vector3(10, 4, 0),
	new BABYLON.Vector3(8, 4, 0),
    new BABYLON.Vector3(8, 1, 0),
    new BABYLON.Vector3(1, 2, 0),
	new BABYLON.Vector3(1, 15, 0),
	new BABYLON.Vector3(3, 17, 0)
];
```

The array is used in shape property of the options parameter in the *CreateLathe* method.

```javascript
const fountain = BABYLON.MeshBuilder.CreateLathe("fountain", {shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
```

As before the scene parameter is optional. In this case the mesh is set to double sided because the inside is visible because of the slope at the top and the hollow middle.

https://www.babylonjs-playground.com/#TC31NV

With appropriate change of scale and positioning this is added to the village.

https://www.babylonjs-playground.com/#KBS9I5#52


A fountain without a spray of water is a little boring so we simulate the spray with partices.
