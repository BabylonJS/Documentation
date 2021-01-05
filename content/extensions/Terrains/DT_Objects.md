---
title: Adding Objects to a Dynamic Terrain
image: 
description: Adding Solid Particle System (SPS) objects to the terrain
keywords: welcome, babylon.js, dynamic terrain, terrain, dynamic, sps, objects
further-reading:
video-overview:
video-content:
---

Having a map depicting the relief is sometimes not enough.  
We may want to render repetitive objects referenced in the map into the landscape like buildings, trees, etc.  
The Dynamic Terrain can manage these objects when used with a dedicated Solid Particle System (SPS).  
The objects are defined in a specific map, besides the ground map, called the Solid Particle Map or SPMap.  

How does it work ?  
As we know now, the terrain renders only the current visible part of the map what can be much bigger and what can have millions coordinates.  
The dedicated SPS works the same way : it renders the only visible objects from the SPMap in the current terrain by recycling automatically a set pool of solid particles.  

Both the SPMap and the SPS are then passed to the terrain constructor as parameters.  

# The SPMap

The SPMap is simply an array of arrays.  
Each object type in the map (example: house, tree) is given an array.  
```javascript
var SPMap = [];
SPMap[0] = [dataHouse1, dataHouse2, ..., dataHouseN];
SPMap[1] = [dataTree1, dataTree2, ..., dataTreeN];
...
SPMap[t] = [dataObject1, dataObject2, ..., dataObjectN];
```
There can be as many object types as we need, but it's required there is at least one `SPMap[0]`.  
There can be as many objects in each type array as we need too and their number can be different from a type to another. When a type is declared, then there must be at least one object in this type.  
So when passing a SPMap, there's at least one type and one object in this type.  

The data defining each object is a set of nine successive floats : the object position (x, y, z), the object rotation (x, y, z) and the object scaling (x, y, z).  
This means that the type array contains simply a long series of successive floats :  
```javascript
SPMap[0] = [
    house1Posx, house1Posy, house1Posz, house1Rotx, house1Roty, house1Rotz, house1Sclx, house1Scly, house1Sclz,
    house2Posx, house2Posy, house2Posz, house2Rotx, house2Roty, house2Rotz, house2Sclx, house2Scly, house2Sclz,
    ...
]
```
Then the same thing for every other object type.  
So at least a SPMap is an array containing an array of 9 floats.  

The single rule to meet is to set every object within the map range.  
Assuming that _(Xmin, Zmin)_ and _(Xmax, Zmax)_ are respectively the minimum and maximum x and z coordinates of the map, then every object must be set at its (x, z) coordinates this way :  
                      `Xmin <= x <= Xmax and Zmin <= z <= Zmax`   

Note : the object coordinates can be different from the map vertex coordinates : the objects don't need to be on map vertex locations. They even don't need to be on the ground, they can be in the air (clouds) or inside or through the ground surface (tunnels).  

# The SPS

The SPS passed to the Dynamic Terrain will animate and recycle its solid particles on the terrain according to the SPMap data.  
The SPS doesn't need to hold as many particles as the object number in the map. There can be dozens thousands objects in the SPMap and only hundreds or few thousands particles in the SPS because it re-uses the invisible objects in order to render only the visible ones.  
The needed particle number then only depends on the object number in the SPMap and on their density on the terrain.  
If the SPS has not enough particles to render some objects, it won't crash, but won't just render them (note : objects are rendered from the minimum to the maximum _x,z_ coordinates, or from the western South to the eastern North, not from the distance to the camera for performance reasons).  

When building the SPS, each particle type (_shapeId_) will match an object type.  
Let's imagine that we want to depict houses from the map by boxes and trees by cones.  
We could obviously choose any 3D (or 2D) shape to assign to every object type from the map. This a voluntary loose coupling design : the map knows only about object locations in the landscape and nothing about how they will be rendered in the terrain, the SPS knows only about the way to render particles and nothing about how many objects and where they are in the map until the terrain tells it.  
So from the same map, we can easily provide different ways to render the objects and we can adjust to the logic needs or the performance constraints.  

Back to our boxes and cones :  

```javascript
var modelBox = BABYLON.MeshBuilder.CreateBox("mb", {}, scene);
var modelCone = BABYLON.MeshBuilder.CreateCylinder("mc", {diameterTop: 0}, scene);
var sps = new BABYLON.SolidParticleSystem("sps", scene);

// The declaration order matters from here
// first shape = first object type
// second shape = second object type, etc
sps.addShape(modelBox, 200);    // 200 houses maximum visible in the terrain
sps.addShape(modelCone, 300);   // 300 trees maximum visible in the terrain
sps.buildMesh();
modelBox.dispose();
modelCone.dispose();
```
And that's all.  

If we created more object types than the particle types, they will simply be ignored.  
If we create less particle types than the declared object types in the map, they will also be ignored.  

# The Dynamic Terrain with the SPMap
Now we have built a SPS and a SPMap, we can just pass them to the DynamicTerrain constructor besides the usual data map.  
We use the parameter `SPmapData` and `sps` :
```javascript
        var terrainSub = 100;               // 100 terrain subdivisions
        var params = {
            mapData: mapData,               // data map declaration : what data to use ?
            mapSubX: mapSubX,               // how are these data stored by rows and columns
            mapSubZ: mapSubZ,
            terrainSub: terrainSub,         // how many terrain subdivisions wanted
            SPmapData: SPMap,               // the object data in the map
            sps: sps                        // the SPS used to render the objects
        }
        var terrain = new BABYLON.DynamicTerrain("t", params, scene);
```

Now, each time that the terrain is updated and that it covers a part of map containing objects, the SPS is updated and the objects are rendered by solid particles.     

# Playground Example

Using only the solid particle system 3000 particles are used to render dozens of thousands objects from the map. A free camera is used.   
PG: <Playground id="#FJNR5#264" title="Dynamic Terrain" description="Example of Added SPS Objects"/>
# Cautionary Note
The SPMap feature seems to not work correctly with the LOD in some cases.

# Object Colors and Textures

So far, we've declared object settings (positions, rotations, scalings) in the map.  
We can also pass the terrain two other optional maps about objects : the object colors and the object UVs.  

Exactly the same way we used for the SPMap, the object colors and UVs are stored in arrays of arrays : one array per object type.  
Each array for a given type then holds series of successive floats related to the colors (r, g, b, a) of each object of this type, or series of successive floats related to the UVs (x, y, z, w) of each object this type.  
The UVs are simply the bottom left and up right coordinates of the quad to be cropped within the texture as it's used in the SPS for the per particle texture feature.   

The UVs will then be applied to the **SPS material**, not to the terrain one.  

```javascript
// Object Colors
var SPColors = [];
SPColors[0] = [colorHouse1, colorHouse2, ..., colorHouseN];
SPColors[1] = [colorTree1, colorTree2, ..., colorTreeN];
...
SPColors[t] = [colorObject1, colorObject2, ..., colorObjectN];

// Object UVs
var SPUVs = [];
SPUVs[0] = [UVHouse1, UVHouse2, ..., UVHouseN];
SPUVs[1] = [UVTree1, UVTree2, ..., UVTreeN];
...
SPUVs[t] = [UVObject1, UVObject2, ..., UVObjectN];
```
The data defining each object color or UV is a set of four successive floats : the object color (r, g, b, a) or the object UVs (x, y, z, w).   
This means that the type array contains simply a long series of successive floats :  
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
We then pass the object colors and UVs to the DynamicTerrain constructor besides the object map and the sps.  
We use the parameter `SPcolorData` and `SPuvData`.  

```javascript
    var terrainSub = 100;        // terrain subdivisions
    var terrainOptions = {
        terrainSub: terrainSub, 
        mapData: mapData, mapSubX: mapSubX, mapSubZ: mapSubZ, 
        mapColors: mapColors, 
        SPmapData: SPmapData,         // object map
        sps: sps,                     // SPS to render the objects on the terrain
        SPcolorData: SPcolorData,     // object colors
        SPuvData: SPuvData            // object UVs to apply to the SPS material
    };
    var terrain = new BABYLON.DynamicTerrain("dt", terrainOptions, scene);
    terrain.mesh.material = terrainMaterial;    // terrain material
    
    sps.mesh.material = objectMaterial;         // object material !

```
The objects get more green or more red according to the map areas (north, south, east, west) and more blue when in altitude. 
PG: <Playground id="#FJNR5#267" title="" description="Example of colour with SPS objects"/> 

Each object is given a part of the image file.
PG: <Playground id="#FJNR5#268" title="" description="Example using UV with SPS objects"/> 

**Note :**
The object map (SPMap) requires a terrain data map to work.  
The object color map or the object UV map both require an object map (SPMap) to work.  
Both are optional.  
Each one (color or UV) can work independently from the other.  

  