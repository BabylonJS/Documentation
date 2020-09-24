# About Parametric Meshes
The shapes of parametric meshes are determined by sets of data, usually in the form on an array of vector3s giving its outline shape or path to follow. 

## Instance Property
When a parametric mesh is created with its options property *updatable* set to true then you can change the values within some option properties and re-render the mesh with these new values by using the *instance* property as the following line drawing example indicates.


```javascript
//creates lines using the vector3 myPoints array
const myLines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints});
// update some or all values in myPoints array
myPoints[1] = new BABYLON.Vector3(1, 2, 3);
// updates the existing instance of myLines by pointing the instance property to it
myLines = BABYLON.MeshBuilder.CreateLines("lines", {points: myArray, instance: myLines});
```

Whilst you can change values within a property you cannot the number of elements of the property.

In practice all the parametric meshes, except for the Lathe,  CreatePolygon and ExtendPolygon can have their shape updated in this way.

Where possible playgrounds will give two examples; the first creating a mesh and the second updating it with the instance option. Comment out the latter to see the original mesh.