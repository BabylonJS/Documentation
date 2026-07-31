---
title: Adding Objects to a Dynamic Terrain
image:
description: Adding Solid Particle System (SPS) objects to the terrain
keywords: dynamic terrain, terrain, dynamic, sps, objects
further-reading:
video-overview:
video-content:
---

Having a relief map is sometimes not enough.  
We may want to render repetitive objects referenced in the map into the landscape, such as buildings, trees, etc.  
Dynamic Terrain can manage these objects when used with a dedicated Solid Particle System (SPS).  
The objects are defined in a specific map, besides the ground map, called the Solid Particle Map or SPMap.

How does it work?  
As we now know, the terrain renders only the currently visible part of the map, which can be much larger and can contain millions of coordinates.  
The dedicated SPS works the same way: it renders only the visible objects from the SPMap in the current terrain by automatically recycling a fixed pool of solid particles.

Both the SPMap and the SPS are then passed to the terrain constructor as parameters.

# The SPMap

The SPMap is simply an array of arrays.  
Each object type in the map (example: house, tree) is given an array.

```javascript
const SPMap = [];
SPMap[0] = [dataHouse1, dataHouse2, ..., dataHouseN];
SPMap[1] = [dataTree1, dataTree2, ..., dataTreeN];
...
SPMap[t] = [dataObject1, dataObject2, ..., dataObjectN];
```

There can be as many object types as we need, but at least one `SPMap[0]` is required.  
There can also be as many objects in each type array as we need, and their number can differ from one type to another. When a type is declared, there must be at least one object in that type.  
So when passing a SPMap, there's at least one type and one object in this type.

The data defining each object is a set of nine successive floats: the object position (x, y, z), the object rotation (x, y, z), and the object scaling (x, y, z).  
This means that the type array simply contains a long series of successive floats:

```javascript
SPMap[0] = [
    house1Posx, house1Posy, house1Posz, house1Rotx, house1Roty, house1Rotz, house1Sclx, house1Scly, house1Sclz,
    house2Posx, house2Posy, house2Posz, house2Rotx, house2Roty, house2Rotz, house2Sclx, house2Scly, house2Sclz,
    ...
]
```

The same applies to every other object type.  
So, at a minimum, a SPMap is an array containing one array of 9 floats.

The only rule is to keep every object within the map range.  
Assuming that _(Xmin, Zmin)_ and _(Xmax, Zmax)_ are respectively the minimum and maximum x and z coordinates of the map, every object must be set at its (x, z) coordinates this way:  
 `Xmin <= x <= Xmax and Zmin <= z <= Zmax`

Note: the object coordinates can be different from the map vertex coordinates: the objects do not need to be on map vertex locations. They do not even need to be on the ground; they can be in the air (clouds) or inside or through the ground surface (tunnels).

# The SPS

The SPS passed to the Dynamic Terrain will animate and recycle its solid particles on the terrain according to the SPMap data.  
The SPS does not need to hold as many particles as there are objects in the map. There can be tens of thousands of objects in the SPMap and only hundreds or a few thousand particles in the SPS because it reuses invisible objects to render only the visible ones.  
The required number of particles depends only on the number of objects in the SPMap and on their density on the terrain.  
If the SPS does not have enough particles to render some objects, it will not crash; it simply will not render them (note: objects are rendered from the minimum to the maximum _x,z_ coordinates, or from the southwest to the northeast, not by distance to the camera, for performance reasons).

When building the SPS, each particle type (_shapeId_) will match an object type.  
Let's imagine that we want to depict houses from the map by boxes and trees by cones.  
We could obviously choose any 3D (or 2D) shape to assign to every object type from the map. This is a deliberately loose coupling design: the map knows only about object locations in the landscape and nothing about how they will be rendered on the terrain, while the SPS knows only how to render particles and nothing about how many objects there are or where they are in the map until the terrain tells it.  
So, from the same map, we can easily provide different ways to render the objects and adjust to logic needs or performance constraints.

Back to our boxes and cones :

```javascript
const modelBox = BABYLON.MeshBuilder.CreateBox("mb", {}, scene);
const modelCone = BABYLON.MeshBuilder.CreateCylinder("mc", { diameterTop: 0 }, scene);
const sps = new BABYLON.SolidParticleSystem("sps", scene);

// The declaration order matters from here
// first shape = first object type
// second shape = second object type, etc
sps.addShape(modelBox, 200); // 200 houses maximum visible in the terrain
sps.addShape(modelCone, 300); // 300 trees maximum visible in the terrain
sps.buildMesh();
modelBox.dispose();
modelCone.dispose();
```

And that's all.

If we create more particle types than object types, the extra particle types will simply be ignored.  
If we create fewer particle types than the declared object types in the map, the extra object types will also be ignored.

# The Dynamic Terrain with the SPMap

Now that we have built an SPS and a SPMap, we can pass them to the DynamicTerrain constructor along with the usual data map.  
We use the parameter `SPmapData` and `sps` :

```javascript
const terrainSub = 100; // 100 terrain subdivisions
const params = {
  mapData: mapData, // data map declaration : what data to use ?
  mapSubX: mapSubX, // how are these data stored by rows and columns
  mapSubZ: mapSubZ,
  terrainSub: terrainSub, // how many terrain subdivisions wanted
  SPmapData: SPMap, // the object data in the map
  sps: sps, // the SPS used to render the objects
};
const terrain = new BABYLON.DynamicTerrain("t", params, scene);
```

Now, each time the terrain is updated and covers a part of the map containing objects, the SPS is updated and the objects are rendered as solid particles.

# Playground Example

Using only the solid particle system, 3000 particles are used to render tens of thousands of objects from the map. A free camera is used.  
PG: <Playground id="#FJNR5#264" title="Dynamic Terrain" description="Example of Added SPS Objects"/>

# Cautionary Note

The SPMap feature seems to not work correctly with the LOD in some cases.

# Object Colors and Textures

So far, we've declared object settings (positions, rotations, scalings) in the map.  
We can also pass the terrain two other optional maps about objects : the object colors and the object UVs.

In exactly the same way as the SPMap, the object colors and UVs are stored in arrays of arrays: one array per object type.  
Each array for a given type then holds a series of successive floats related to the colors (r, g, b, a) of each object of that type, or a series of successive floats related to the UVs (x, y, z, w) of each object of that type.  
The UVs are simply the bottom-left and upper-right coordinates of the quad to be cropped within the texture, as used in the SPS per-particle texture feature.

The UVs will then be applied to the **SPS material**, not to the terrain material.

```javascript
// Object Colors
const SPColors = [];
SPColors[0] = [colorHouse1, colorHouse2, ..., colorHouseN];
SPColors[1] = [colorTree1, colorTree2, ..., colorTreeN];
...
SPColors[t] = [colorObject1, colorObject2, ..., colorObjectN];

// Object UVs
const SPUVs = [];
SPUVs[0] = [UVHouse1, UVHouse2, ..., UVHouseN];
SPUVs[1] = [UVTree1, UVTree2, ..., UVTreeN];
...
SPUVs[t] = [UVObject1, UVObject2, ..., UVObjectN];
```

The data defining each object color or UV is a set of four successive floats: the object color (r, g, b, a) or the object UVs (x, y, z, w).  
This means that the type array simply contains a long series of successive floats:

```javascript
// Color example, first object type
SPColor[0] = [
    house1Col_r, house1Col_g, house1Col_b, house1Col_a,
    house2Col_r, house2Col_g, house2Col_b, house2Col_a,
    ...
]
// UV example, first object type
SPUV[0] = [
    house1UV_x, house1UV_y, house1UV_z, house1UV_w,
    house2UV_x, house2UV_y, house2UV_z, house2UV_w,
    ...
]
```

We then pass the object colors and UVs to the DynamicTerrain constructor along with the object map and the sps.  
We use the parameter `SPcolorData` and `SPuvData`.

```javascript
const terrainSub = 100; // terrain subdivisions
const terrainOptions = {
  terrainSub: terrainSub,
  mapData: mapData,
  mapSubX: mapSubX,
  mapSubZ: mapSubZ,
  mapColors: mapColors,
  SPmapData: SPmapData, // object map
  sps: sps, // SPS to render the objects on the terrain
  SPcolorData: SPcolorData, // object colors
  SPuvData: SPuvData, // object UVs to apply to the SPS material
};
const terrain = new BABYLON.DynamicTerrain("dt", terrainOptions, scene);
terrain.mesh.material = terrainMaterial; // terrain material

sps.mesh.material = objectMaterial; // object material !
```

The objects get more green or more red according to the map areas (north, south, east, west) and more blue when in altitude.
PG: <Playground id="#FJNR5#267" title="" description="Example of color with SPS objects"/>

Each object is given a part of the image file.
PG: <Playground id="#FJNR5#268" title="" description="Example using UV with SPS objects"/>

**Note :**
The object map (SPMap) requires a terrain data map to work.  
The object color map or the object UV map both require an object map (SPMap) to work.  
Both are optional.  
Each one (color or UV) can work independently from the other.
