# Transformation Chapter Page 1
## Position
In order to fully understand all the ways to locate a mesh in the scene we need to know about frames of reference. When creating a world in a scene we are using a frame of reference in the **World Space**. In Babylon.js world space there are two horizontal axes, x and z, and a vertical y axis in a left handed system. Most meshes are created with their center at the world space origin.

Each object in the scene also has its own **Local Space** with the local origin at the center of the mesh. Again most meshes are created with their local x, y and z axes aligned with the x, y and z axes of the world space.

Consider a mesh with its local origin in world space at (-1, 2, 1), that is mesh.position is at (-1, 2, 1);
Babylon.js has a number of ways to reset the location a mesh. These are listed in the code below. The comments show the location of the local origin of the mesh in world space after each way has been applied.

The following are true for a mesh whether it has been rotated or not.

```javascript
mesh.position = new Vector3(2, 3, 4);//(2, 3, 4)
mesh.position.addInPlace(new Vector3(2, 3, 4)); //(-1 + 2, 2 + 3, 1 + 4) = (1, 5, 5)
mesh.translate(new BABYLON.Vector3(2, 3, 4), 1, BABYLON.Space.WORLD); //(-1 + 2, 2 + 3, 1 + 4) = (1, 5, 5)
```

```javascript
mesh.position.x = 2; //(2, 2, 1)
mesh.position.y = 3; //(2, 3, 1)
mesh.position.z = 4; //(2, 3, 4)
```

```javascript
mesh.position.x += 2; //(-1 + 2, 2, 1) = (1, 2, 1)
mesh.position.y += 3; //(1, 2 + 3, 1) = (1, 5, 1)
mesh.position.z += 4; //(1, 5, 1 + 4) = (1, 5, 5)
```

The following depend on the orientation of the mesh, so that it is not possible to give a resulting location.

```javascript
mesh.translate(new BABYLON.Vector3(2, 3, 4), 1, BABYLON.Space.LOCAL);
mesh.setPositionWithLocalVector(new BABYLON.Vector3(2, 3, 4));
mesh.locallyTranslate(new BABYLON.Vector3(2, 3. 4));
```
The vectors for *position* and *setPositionWithLocalVector* are position vectors. Those for *translate*, *locallyTranslate* and *addInPlace* are direction vectors.

These images show how, using the last three methods in local space, the orientation of the mesh affects its final position in world space.

![no rotation](/img/getstarted/translate1.png)&nbsp;&nbsp;&nbsp;![with rotation](/img/getstarted/translate2.png)

The given vectors are applied in the local space of the mesh, the axes of which rotate with the mesh.

[Next](/babylon101/rotation) Rotation  

[Getting Started Chapter](/babylon101/placement)