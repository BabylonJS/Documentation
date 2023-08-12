---
title: Visualizing Mesh Data
image: 
description: Overview of using the MeshDebugPluginMaterial to visually debug model data.
keywords: babylon.js, tools, resources, utilities, debug, material, plugin, mesh
further-reading:
video-overview:
video-content:
---

## The MeshDebugPluginMaterial
Visualizing certain properties of a mesh can often be tricky.
The MeshDebugPluginMaterial, one of the [material plugins](features/featuresDeepDive/materials/using/materialPlugins) available in the Babylon library, can be used to aid in debugging these properties.

The plugin currently offers 7 modes, which are detailed below.

## Triangles Mode
The `TRIANGLES` visualization of the MeshDebugPluginMaterial allows you to see the underlying mesh's wireframe. 
![TRIANGLES mode](/img/extensions/materials/mdpmTriangles.png)

### How To Use
Before applying the plugin, first call the static function `PrepareMeshForTrianglesAndVerticesMode` on the mesh. Then create the MeshDebugPluginMaterial with the `mode` option set to `MeshDebugMode.TRIANGLES`

You can customize the wireframe's thickness and color with the options below
* `wireframeTrianglesColor`: _(Color3)_ the color of the wireframe
* `wireframeThickness`: _(number)_ the thickness of the wireframe's edges

#### Example
```javascript
BABYLON.MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(mesh);

new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.TRIANGLES,
    wireframeTrianglesColor: new BABYLON.Color3(0, 0, 0),
    wireframeThickness: 0.7
});
```

**NOTE** _Behind-the-scenes, `PrepareMeshForTrianglesAndVerticesMode` is tripling the number of triangles and vertices in the mesh's vertex buffers. This is necessary for the plugin's shaders to work correctly. You can undo these changes to the mesh via the [rollback function](/typedoc/classes/BABYLON.MeshDebugPluginMaterial#PrepareMeshForTrianglesAndVerticesMode) returned by the method._

Playground example: <Playground id="#KPLZWF" title="Triangles" description="Applying TRIANGLES to a model."/>

## Vertices Mode
The plugin's `VERTICES` mode draws dots over all vertices of the mesh, as shown below.
![VERTICES mode](/img/extensions/materials/mdpmVertices.png)

### How To Use
This mode works similar to `TRIANGLES`. Call the static function `PrepareMeshForTrianglesAndVerticesMode` on the mesh first, then apply the plugin.

Customization options include
* `vertexColor`: _(Color3)_ the color of the vertex dots
* `vertexRadius`: _(number)_ the radius of the vertex dots

#### Example
```javascript
BABYLON.MeshDebugPluginMaterial.PrepareMeshForTrianglesAndVerticesMode(mesh);

new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.TRIANGLES,
    vertexColor: new BABYLON.Color3(0, 0, 0),
    vertexRadius: 1.2
});
```

## Triangles-Vertices Mode
If you'd like to see both the mesh's wireframe and vertex dots, use the `TRIANGLES_VERTICES` mode of the plugin.
![TRIANGLES_VERTICES mode](/img/extensions/materials/mdpmTrianglesVertices.png)

### How To Use
Just like both `TRIANGLES` and `VERTICES` modes, use `PrepareMeshForTrianglesAndVerticesMode` on the mesh, then apply the plugin.

The same options available to `TRIANGLES` and `VERTICES` modes also apply to `TRIANGLES_VERTICES`, with one exception. Below, note that `wireframeTrianglesColor` is replaced by `wireframeVerticesColor`. 
* `vertexColor`: _(Color3)_ the color of the vertex dots
* `vertexRadius`: _(number)_ the radius of the vertex dots
* `wireframeVerticesColor`: _(Color3)_ the color of the wireframe
* `wireframeThickness`: _(number)_ the thickness of the wireframe's edges in screen space

#### Example
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
![UV0 mode](/img/extensions/materials/mdpmUV0.png)

### How To Use
Simply set the plugin mode to `UV0` or `UV1`, depending on which UV set you'd like to see.

You can customize the primary and secondary color of the checkerboard grid via
* `uvPrimaryColor`: _(Color3)_ the first color used in the checkerboard grid
* `uvSecondaryColor`: _(Color3)_ the second color used in the checkerboard grid
* `uvScale`: _(number)_ the number of squares along one axis of the grid

#### Example
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
![VERTEXCOLORS mode](/img/extensions/materials/mdpmVertexColors.png)

### How To Use
Set the plugin's mode to `VERTEXCOLORS`. For best results, also set the `multiply` option to `false`.

#### Example
```javascript
new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.VERTEXCOLORS,
    multiply: false
});
```

**NOTE** _By default, the plugin multiplies the mode's color against the material's final color underneath. We should disable this behavior here to get the real color of each vertex._
**NOTE** _Under-the-hood, disabling `multiply` when on `VERTEXCOLORS` mode will also disable lighting effects on the model. See [The multiply option](toolsAndResources/utilities/VisualizeMeshData#the-multiply-option) section for more details._

## Material IDs Mode
The `MATERIALIDS` mode provides a visual way of distinguishing different materials from one another.
![MATERIALIDS mode](/img/extensions/materials/mdpmMaterialIds.png)

### How To Use
Set the plugin's mode to `MATERIALIDS` across all materials. You may also want to toggle off the `multiply` option to better see the ID colors.

The MeshDebugPluginMaterial comes with a default color palette for `MATERIALIDS`. To use a custom color palette, you can directly replace the plugin's [static palette](typedoc/classes/BABYLON.MeshDebugPluginMaterial#MaterialColors) with your own before applying the plugin, like in the following snippet.

#### Example
```javascript
BABYLON.MeshDebugPluginMaterial.Reset();

BABYLON.MeshDebugPluginMaterial.MaterialColors = [
    new BABYLON.Color3(1,0,0),
    new BABYLON.Color3(0,1,0),
    new BABYLON.Color3(0,0,1)
];

new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: BABYLON.MeshDebugMode.MATERIALIDS,
    multiply: false
});
```

**NOTE** _If you'd like ID colors to be consistent across runs, call the static function [`MeshDebugPluginMaterial.Reset()`](/typedoc/classes/BABYLON.MeshDebugPluginMaterial#Reset) before applying the modes. This resets all static variables of the MeshDebugPluginMaterial class, including the counting mechanism for material IDs._

Playground example: <Playground id="#RZPC9Q" title="Material IDs" description="Applying MATERIALIDS to a model."/>

## The Multiply Option
The `MeshDebugPluginMaterial` features an option, `multiply`, that determines if the plugin's visualization colors should be multiplied against the material's final color. This option is set to `true` by default, but what happens if you set it to `false`?

If set to false, the plugin will replace the material's final color with its own, built-in visual (unless the plugin is in `VERTEXCOLORS`). This default shading looks as follows:

![Default Shading](/img/extensions/materials/mdpmNone.png)

The visual is based off a Phong lighting model and treats the active camera the a light source. 
You can customize the default shading's appearance with a few options.
* `shadedDiffuseColor`: _(Color3)_ the diffuse color of the default shading
* `shadedSpecularColor`: _(Color3)_ the specular color of the default shading
* `shadedSpecularPower`: _(number)_ the strength of the default shading's specularity

### Example
```javascript
new BABYLON.MeshDebugPluginMaterial(mesh.material, {
    mode: // any mode
    multiply: false,
    shadedDiffuseColor: new BABYLON.Color3(1, 1, 1),
    shadedSpecularColor: new BABYLON.Color3(.8, .8, .8),
    shadedSpecularPower: 10
});
```

See the difference: <Playground id="#U9UKR8" title="Default Shading" description="Example showcasing the default shading of the plugin material."/>

## Notes on Usage
The mesh must have a material assigned to it in order for the MeshDebugPluginMaterial to work as expected. You might consider adding logic to your program that assigns new PBRMaterials to meshes without any material.

Also, all material plugins must be added to materials _before_ they are used for rendering. There are a few techniques to do this, including
- Importing the mesh asynchronously, then adding the plugin to the materials of the result
- Using an observable like `scene.onNewMaterialAddedObservable`
- Using an `AssetContainer` to modify the materials before adding them to the scene
- Creating a new material, applying the plugin to the new material, then assigning the new material to the mesh

## API
See the full list of available properties, options, methods, and more [here](/typedoc/classes/BABYLON.MeshDebugPluginMaterial).