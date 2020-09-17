# Extruded Shapes
## MeshBuilder
You must set at least the _shape_ and _path_ options.
On update, you must set the _shape_, _path_ and _instance_ options and you can set the _scale_ and _rotation_ options.

In whatever direction you want to extrude the shape the design of the shape should be based on coordinates 
in the XOY plane, ie the z component should be 0. Some twisting to this base shape can be applied by leaving the x and y components unchanged but allowing the z component to be non zero but not taking the shape too far from generally lying in th XOY plane. Otherwise results will not be as you might expect.

Example :
```javascript
// creates an extended shape
var extruded = BABYLON.MeshBuilder.ExtrudeShape("ext", {shape: myShape, path: myPath}, scene);

// updates the existing instance of extruded : no need for the parameter scene
extruded = BABYLON.MeshBuilder.ExtrudeShape("ext", {shape: myShape, path: myPath, scale: newScale, rotation: newRotation instance: extruded});

```

option|value|default value
--------|-----|-------------
shape|_(Vector3[])_  array of Vector3, the shape you want to extrude **REQUIRED** |
path|_(Vector3[])_  array of Vector3, the extrusion axis **REQUIRED** |
scale|_(number)_  the value to scale the shape|1
rotation|_(number)_  the value to rotate the shape each step along the path|0
cap|_(number)_ extrusion cap : NO_CAP, CAP_START, CAP_END, CAP_ALL|NO_CAP
updatable|_(boolean)_ true if the mesh is updatable|false
sideOrientation|_(number)_ side orientation|DEFAULTSIDE
frontUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
backUVs|_(Vector4)_  **ONLY WHEN sideOrientation:BABYLON.Mesh.DOUBLESIDE is an option** | Vector4(0,0, 1,1) 
instance|_(LineMesh)_ an instance of an extruded shape to be updated|null
invertUV|_(boolean)_ to swap the U and V coordinates at geometry construction time (texture rotation of 90°)|false

* [Playground Example of an Extrusion in Z direction](https://www.babylonjs-playground.com/#165IV6#69)
* [Playground Update of the Extrusion Changing Scale and Rotation](https://www.babylonjs-playground.com/#165IV6#16)

* [Playground Example of an Extrusion in Y direction](https://www.babylonjs-playground.com/#165IV6#70)
* [Playground Update of the Extrusion Changing Scale and Rotation](https://www.babylonjs-playground.com/#165IV6#18)

When you need sharp mitred corners there is a utility function available [Extruded Shape with Mitred Corners](/snippets/Mitred)

## Mesh
What is extrusion ?  
Extrusion is the way to transform a 2D shape into a volumic shape.  
Let's imagine that you define a star shape by filling an array with successive _Vector3_. In order to have a 2D shape, you only set these points in the xOy plane, so every z coordinate is zero.  
ex : https://www.babylonjs-playground.com/#RF9W9  
Let's show the World axis so it is clearer : https://www.babylonjs-playground.com/#RF9W9#1  
Let's now imagine you could stretch this 2D shape along the Z-axis to give it some volume... this is extrusion :  https://www.babylonjs-playground.com/#RF9W9#30    

Let's now imagine you can extrude your star along a 3D path in space, a sinus curve for example, and not only along the z-axis.  
https://www.babylonjs-playground.com/#RF9W9#31    

 
```javascript
BABYLON.Mesh.ExtrudeShape(name, shape, path, scale, rotation, cap, scene, updatable?, sideOrientation)
```
* name : the extruded mesh name.
* shape : the shape to be extruded, an array of successive Vector3.
* path : the path to extrude the shape along, an array of successive Vector3.
* scale : _default 1_, the value to scale the initial shape.
* rotation : _default 0_, the step value to rotate the shape at each path point.
*  cap : BABYLON.Mesh.NO_CAP, BABYLON.Mesh.CAP_START, BABYLON.Mesh.CAP_END, BABYLON.Mesh.CAP_ALL.  
* scene : the current scene.
* updatable? : if the mesh is updatable.
* sideOrientation : the side orientation - _front, back_ or _double_.  

If we change the _scale_ value from 1 to 3 for example (line 84), the initial star is scaled to 3 along the curve : https://www.babylonjs-playground.com/#RF9W9#526 
If we now change the _rotation_ step value from 0 to _PI / 24_ for example, the curve is twisted this angle at each curve point : https://www.babylonjs-playground.com/#RF9W9#218  

Of course, even if you define your 2D shape in the xOy plane as described, the extrusion still works along any path direction : https://www.babylonjs-playground.com/#RF9W9#32    

Moreover, the shape doesn't need to be closed. You can have a simple (or complex) open shape : https://www.babylonjs-playground.com/#RF9W9#7  
Extrusion : https://www.babylonjs-playground.com/#RF9W9#33      
Extrusion with rotation : https://www.babylonjs-playground.com/#RF9W9#34    

Remember that your shape doesn't need to be centered on the coordinate system either. Here is an offset simple shape : https://www.babylonjs-playground.com/#RF9W9#10  
Extrusion (the extrusion path is shown in magenta so the offset is visible) : https://www.babylonjs-playground.com/#RF9W9#35    
Now rotation... around the path axis : https://www.babylonjs-playground.com/#RF9W9#36    
As you can see, this is a way to build complex curved helix meshes without handling maths or simpler ones : https://www.babylonjs-playground.com/#RF9W9#37    
As the shape to be extruded is unpredictable, it is assumed that the cap, if want to add it one or two to your extruded mesh, is computed with its center set to the shape barycenter.