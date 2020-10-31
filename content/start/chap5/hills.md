# Getting Started - Working With Code
# Distant Hills
We want to set the village in a valley. It would be possible to create hills from meshes, however there is another way to add vertical height to a ground mesh. This is achieved using a height map which uses shades of gray to determine the height of the ground. White areas are the highest parts and black the lowest.
This simple height map

![height map](/img/getstarted/villageheightmap.png)  
has a large black area in the middle to host the village, the white areas create the hills and the gray ones ways out of the valley for roads.

![untextured valley](/img/getstarted/valley1.png)  
In this image the camera has been pulled further out and the vertical height exaggerated.

```javascript
const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "url to height map", 
    {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 10});
```

The subdivisions property of *options* splits the ground into 20 x 20 = 400 sections. The more subdivisions the finer gradation for height calculation. The two properties minHeight and maxHeight determine the vertical heights for the black and white areas respectively, gray areas scaled accordingly.

https://www.babylonjs-playground.com/#KBS9I5#39

We can add textures in the usual way.

![textured valley](/img/getstarted/valley2.png)  

https://www.babylonjs-playground.com/#KBS9I5#40

Finally we give the village ground a similar, but clearer texture, to that of the large ground.

```javascript
//Create Village ground
const groundMat = new BABYLON.StandardMaterial("groundMat");
groundMat.diffuseTexture = new BABYLON.Texture("url to ground texture");
groundMat.diffuseTexture.hasAlpha = true;

const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:24, height:24});
ground.material = groundMat;

//large ground
const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
largeGroundMat.diffuseTexture = new BABYLON.Texture("url to large ground texture");

const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "url to heightmap", 
    {width:150, height:150, subdivisions: 20, minHeight:0, maxHeight: 4});
largeGround.material = largeGroundMat;
largeGround.position.y = -0.01;
```

This line
```javascript
largeGround.position.y = -0.01;
```
ensures the two grounds do not fight and cause flickering.

https://www.babylonjs-playground.com/#KBS9I5#85

We add back the dwellings and create a file to import

https://www.babylonjs-playground.com/#KBS9I5#86

Then we can add back the car but this time passing through the village.

https://www.babylonjs-playground.com/#KBS9I5#87

Let's now further improve the environment by adding a sky.

