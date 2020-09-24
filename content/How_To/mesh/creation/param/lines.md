# Lines
## MeshBuilder
Creates a contiguous series of line segments from a list of points.
You must set at least the _points_ option.
On update, you must set the _points_ and _instance_ options. You can also set the _colors_ option if previously set at construction time.  

Example :
```javascript
//creates lines
var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myArray}, scene);

// updates the existing instance of lines : no need for the parameter scene here
lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myArray, instance: lines});
```

option|value|default value
--------|-----|-------------
points|_(Vector3[])_  array of Vector3, the path of the line **REQUIRED**
updatable|_(boolean)_ true if the mesh is updatable|false
instance|_(LineMesh)_ an instance of a line mesh to be updated|null
colors|_(Color4[])_ array of Color4, each point color|null
useVertexAlpha|_(boolean)_ false if the alpha blending is not required (faster)|true

* [Playground Example of a Spiral from Lines](https://www.babylonjs-playground.com/#165IV6#64)
* [Playground Update of the Spiral from Lines](https://www.babylonjs-playground.com/#165IV6#63)

Lines are colored with a color property

```javascript
lines.color = new BABYLON.Color3(1, 0, 0);
```
* [Playground Example of Colored Lines](https://www.babylonjs-playground.com/#165IV6#78)

## Mesh
```javascript
var lines = BABYLON.Mesh.CreateLines("lines", [
    new BABYLON.Vector3(-10, 0, 0),
    new BABYLON.Vector3(10, 0, 0),
    new BABYLON.Vector3(0, 0, -10),
    new BABYLON.Vector3(0, 0, 10)
], scene);
```
Parameters are: name, [array of comma-separated vectors], scene. 

I could explain how the Lines Mesh constructor works, but I think you can see how it works just by looking at the demo code above.  Notice the [ and ].  Those are the enclosing tokens for an array, yet another kind of Javascript value.  The first vector3 of the array is the starting location for drawing lines.  After that, a comma, and then the next vector3 location... indicating where the line is drawing-to next.  Then, another comma, and another vector3 to a new location.  You can add as many vectors as you wish, but notice that the LAST vector3 does not have a comma following it.  Please make your array of vectors be formatted similarly.   