---
title: Visualizing Mesh Data
image: 
description: Overview of using the MeshDebugPluginMaterial to visually debug model data.
keywords: babylon.js, tools, resources, utilities, debug, material
further-reading:
video-overview:
video-content:
---

## Using the MeshDebugPluginMaterial
Often, visualizing certain properties of a model can be tricky.
The MeshDebugPluginMaterial, one of the Material Plugins available in the Babylon library, can be used to help debug these properties.

The plugin currently offers 7 modes, detailed below.

## Triangles Mode
The `TRIANGLES` visualization of the MeshDebugPluginMaterial allows you to see the underlying mesh's wireframe. 
![TRIANGLES mode](/img/extensions/materials/mdp_triangles.png)

### How To Use
Before applying the plugin, you must first call the static function `PrepareMeshForTrianglesAndVerticesMode` on the mesh. Then create the MeshDebugPluginMaterial with the `mode` option set to `MeshDebugMode.TRIANGLES`

```javascript
BABYLON.MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(mesh);

new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.TRIANGLES
});
```

**NOTE** _Behind-the-scenes, `PrepareMeshForTrianglesAndVerticesMode` is tripling the number of triangles and vertices in the mesh's vertex buffers. This is necessary for the plugin's shaders to work correctly. You can undo these changes to the mesh via the [rollback function](/typedoc/classes/BABYLON.MeshDebugPluginMaterial#PrepareMeshForTrianglesAndVerticesMode) returned by the method._

### Customization Options
You can customize the wireframe's thickness and color with the `wireframeTrianglesColor` and `wireframeThickness` options.

```javascript
new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.TRIANGLES,
    wireframeTrianglesColor: new BABYLON.Color3(0, 0, 0),
    wireframeThickness: 0.7
});
```

## Vertices Mode
The plugin's `VERTICES` mode draws dots over all vertices of the mesh, as shown below.
![VERTICES mode](/img/extensions/materials/mdp_vertices.png)

### How To Use
This mode works similar to `TRIANGLES`. You must call the static function `PrepareMeshForTrianglesAndVerticesMode` on the mesh, then apply the plugin.

```javascript
BABYLON.MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(mesh);

new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.VERTICES
});
```

### Customization Options
You can customize the vertex dots' size and color via the `vertexColor` and `vertexRadius` options.

```javascript
BABYLON.MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(mesh);

new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.TRIANGLES,
    vertexColor: new BABYLON.Color3(0, 0, 0),
    vertexRadius: 1.2
});
```

## Triangles & Vertices Mode
If you'd like to see both the mesh's wireframe and vertex dots, use the `TRIANGLES_VERTICES` mode of the plugin.
![TRIANGLES_VERTICES mode](/img/extensions/materials/mdp_trianglesvertices.png)

### How To Use
Just like both `TRIANGLES` and `VERTICES` modes, you must use `PrepareMeshForTrianglesAndVerticesMode` on the mesh, then apply the plugin.

```javascript
BABYLON.MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(mesh);

new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.TRIANGLES_VERTICES
});
```

### Customization Options
The same options available to `TRIANGLES` and `VERTICES` modes also apply to `TRIANGLES_VERTICES`-- with one exception. Instead of `wireframeTrianglesColor`, you must instead use `wireframeVerticesColor`. 

```javascript
BABYLON.MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(mesh);

new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.TRIANGLES_VERTICES,
    wireframeVerticesColor: new BABYLON.Color3(0.8, 0.8, 0.8),
    wireframeThickness: 0.7,
    vertexColor: new BABYLON.Color3(0, 0, 0),
    vertexRadius: 1.2
});
```

## UV0 and UV1 Modes
These modes can help visualize a mesh's UVs with a basic checkerboard grid.
![UV0 mode](/img/extensions/materials/mdp_uv0.png)

### How To Use
Simply set the plugin mode to `UV0` or `UV1`, depending on which UV set you'd like to see.

```javascript
new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.UV0
});
```

### Customization Options
You can customize the primary and secondary color of the checkerboard grid via the `uvPrimaryColor` and `uvSecondaryColor` options. In addition, you can change the scaling of the grid via `uvScale`.

```javascript
new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.UV0,
    uvPrimaryColor: new BABYLON.Color3(1, 1, 1),
    uvSecondaryColor: new BABYLON.Color3(0.5, 0.5, 0.5),
    uvScale: 20
});
```

## Vertex Colors Mode
The `VERTEXCOLORS` mode can be used to better see a mesh's vertex colors.
![VERTEXCOLORS mode](/img/extensions/materials/mdp_vertexcolors.png)

### How To Use
Set the plugin's mode to `VERTEXCOLORS`. You should also toggle off the `multiply` option for best results.

```javascript
new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.VERTEXCOLORS,
    multiply: false
});
```

**NOTE** _By default, the plugin multiplies the mode's color against the material's final color underneath. We should disable this behavior here to get the real color of each vertex._

**NOTE** _Under-the-hood, disabling `multiply` when on `VERTEXCOLORS` mode will also disable lighting effects on the model._


## Material IDs Mode
The `MATERIALIDS` mode provides a visual way of distinguishing different materials from one another.
![MATERIALIDS mode](/img/extensions/materials/mdp_materialids.png)

### How To Use
Set the plugin's mode to `MATERIALIDS` across all materials. You may also want to toggle off the `multiply` option to better see the ID colors.

If you want ID colors to be consistent across runs, use the static function `Reset` before applying the mode.

```javascript
BABYLON.MeshDebugPluginMaterial.Reset();

new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.MATERIALIDS,
    multiply: false
});
```
**NOTE** _If you'd like ID colors to be consistent across runs, call the static function `MeshDebugPluginMaterial.Reset` before applying the modes. This resets all static variables of the MeshDebugPluginMaterial class, including the counting mechanism for material IDs._

### Customization Options
The MeshDebugPluginMaterial comes with a default color palette for `MATERIALIDS`. To use a custom color palette, you can directly replace the plugin's palette with your own.

```javascript
BABYLON.MeshDebugPluginMaterial.MaterialColors = [
    new BABYLON.Color3(1,0,0),
    new BABYLON.Color3(0,1,0),
    new BABYLON.Color3(0,0,1)
];
```
    



## To multiply or not multiply...


