# Common 3D Shapes
These common shapes cover 2D shapes such as horizontal planes (ground), vertical planes and regular polygons along with 3D shapes such as cuboids, spheres, ellipsoids and toruses. 

To create these meshes you use
```javascript
const mesh = BABYLON.MeshBuilder.Create<MeshType>(name, options, scene);
```
where the *options* object properties vary according to the type of mesh. Using an empty object, {}, the meshes will default to given sizes, usually unit ones. The scene parameter is optional and defaults to the current scene.

Two useful properties are *updatable* and *instance*. When a parametric mesh is created with its options property *updatable* set to true then you can change the values within the shape defining properties and re-render the mesh with these new values by using the *instance* property as the following line drawing example indicates.


```javascript
//creates lines using the vector3 myPoints array
const myLines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints});
// update some or all values in myPoints array
myPoints[1] = new BABYLON.Vector3(1, 2, 3);
// updates the existing instance of myLines by pointing the instance property to it
myLines = BABYLON.MeshBuilder.CreateLines("lines", {points: myArray, instance: myLines});
```

Whilst you can change values within a property you cannot the number of elements of the property. All the parametric meshes, except for the Lathe,  CreatePolygon and ExtendPolygon can have their shape updated in this way.

It is still possible to use the form

```javascript
const mesh = BABYLON.Mesh.Create<MeshType>(name, required_param1, required_param2, ..., scene, optional_parameter1, ........);
```
The scene parameter is compulsory when used with optional parameters. You will still find this method in playgrounds.
 
