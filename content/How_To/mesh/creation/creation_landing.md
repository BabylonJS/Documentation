# The Creation of Different Types of Mesh
There is a large variety of meshes that you can create. The range falls into four broad categories, the first three of which requiring a single Babylon.js method to build.

1. Set Shapes - which usually have names in everyday use and their forms are well known and recognized. Examples include the box, sphere, cone and plane. These shapes are created with a method having the form *Create&lt;MeshType&gt*

2. Parametric Shapes - these have no everyday names and are formed through data sets and tend to have irregular shapes. Examples include ribbons, extrusions, and irregular convex or concave polygons. They are created mainly with *Create&lt;MeshType&gt* and also with *Extrude&lt;MeshType&gt*

3. Polyhedra - three dimensional regular solids including octahedron, dodecahedron, icosahedron and icosphere. The method of creating these is *createPolyhedron* along with a number for the basic shapes and an array of vertices for a wider range of shapes or *createIcoSphere*.

4. Custom - those you design yourself and build from your own set of vertices connected into triangular facets as you choose.


The current way to create a mesh is using *MeshBuilder*
```javascript
const mesh = BABYLON.MeshBuilder.Create<MeshType>(name, options, scene);
```
The *options* object will have different properties according to the type of mesh and can be empty {}. The scene parameter is optional and defaults to the current scene.

There is an older method, retained for backwards compatibility, which uses *Mesh* and a string of parameters

```javascript
const mesh = BABYLON.Mesh.Create<MeshType>(name, required_param1, required_param2, ..., scene, optional_parameter1, ........);
```
The scene parameter is compulsory when used with optional parameters. You will still find this method in playgrounds.


