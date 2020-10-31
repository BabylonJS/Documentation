# Polygon Mesh Builder
*CreatePolygon* and *ExtrudePolygon* which follow the same form as other mesh creations call *PolygonMeshBuilder* which can be used directly. It has some advantages but cannot be used with *faceUVs*. The data used in describing the polygon is given in 2D vectors, (x, y) rather than (x 0, z). As well as an array of vector2s the polygon data can be passed as a
*CreatePolygon* and *ExtrudePolygon* which follow the same form as other mesh creations call *PolygonMeshBuilder* which can be used directly. It has some advantages but cannot be used with *faceUVs*. The data used in describing the polygon is given in 2D vectors, (x, y) rather than (x 0, z). As well as an array of vector2s the polygon data can be passed as Path2 object. The advantage of using Path2 is that curves can be described using simple methods rather than your own functions. The data used to describe the polygon shape must be in counter clockwise order.

The way *PolygonMeshBuilder* works is to construct and return the triangulation of the polygon and then create the mesh from this triangulation using its *build* method. The triangulation requires an Earcut script. Whilst an Earcut script is pre-loaded in the Playground you will have to add a reference to such a script in your own projects. One is available at [cdn](https://unpkg.com/earcut@2.1.1/dist/earcut.min.js) or via a [npm package](https://github.com/mapbox/earcut#install).

The build function takes two optional parameters: the first is a Boolean and is true if the mesh is to be updatable and the seconds is the depth of the extrusion when required.


# Constraints
The polygon and any holes inside it must be [simple](https://en.wikipedia.org/wiki/Simple_polygon), that is no overlapping sides. Holes should be wholly inside the polygon and should not be too close to the sides of the polygon or to each other otherwise the mesh will be malformed. This [algorithm](http://geomalgorithms.com/a09-_intersect-3.html#Simple-Polygons) is one you can use to check if a polygon is simple.

![Safe Construction](/img/how_to/PolyMeshBuild/pmberr1.jpg)

![Unsafe Construction](/img/how_to/PolyMeshBuild/pmberr2.jpg)

![Unsafe Construction](/img/how_to/PolyMeshBuild/pmberr3.jpg)

# Usage
```javascript
const polygon_triangulation = new BABYLON.PolygonMeshBuilder("name", vector2 array, scene);
const polygon = polygon_triangulation.build();
```


```javascript
var polygon_triangulation = new BABYLON.PolygonMeshBuilder("name", Path2, scene);
var polygon = polygon_triangulation.build(false, 3);
```

## Holes
A hole can only be given as an array of vector2, representing the corners of the hole in consecutive counter clockwise order around the hole.

Holes are added to the polygon triangulation using the addHole function.

```javascript
polygon_triangulation.addHole(hole1);
polygon_triangulation.addHole(hole2);
polygon_triangulation.addHole(hole3);
var polygon = polygon_triangulation.build(true, 1.4);
```
# Examples
Each example contains polygons described with vector2s and with Path2
Simple Polygons Using  https://www.babylonjs-playground.com/#2NJYI5  
Simple Extruded Polygons https://www.babylonjs-playground.com/#2NJYI5#1  
Polygons with holes https://www.babylonjs-playground.com/#2NJYI5#2
Extruded Polygons with holes https://www.babylonjs-playground.com/#2NJYI5#3
