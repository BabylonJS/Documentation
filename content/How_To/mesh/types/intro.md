# Introduction To Types of Meshes

There is a large variety of meshes that you can create with the use of just one function. The range of meshes fall into one of two categories

1. Set Shapes - this category usually have names in everyday use and their forms are well known and recognized. Examples include the box, sphere, cone and plane.

2. Parametric Shapes - these have no everyday names and are formed through data sets and tend to have irregular shapes. Examples include ribbons, extrusions, and irregular convex or concave polygons.

Other than extrusions all meshes are created with a method of the form

```javascript
Create<MeshType>
```

For extrusions it is 
```javascript
Extrude<MeshType>
```

The current way to create a mesh is using *MeshBuilder*
```javascript
const mesh = BABYLON.MeshBuilder.Create<MeshType>(name, options, scene);
```
The options object will have different properties according to the type of mesh and scene is optional and defaults to the current scene.

There is an older method, retained for backwards compatibility, which uses *Mesh* and a string of parameters

```javascript
const mesh = BABYLON.Mesh.Create<MeshType>(name, required_param1, required_param2, ..., scene, optional_parameter1, ........);
```
The scene parameter is compulsory. You will still find this method in playgrounds.

Where it is available this method will also be included on the page for a particular mesh type.

Even though there are many mesh types for you to create from you are not restricted to just those, you can build your own custom meshes.

