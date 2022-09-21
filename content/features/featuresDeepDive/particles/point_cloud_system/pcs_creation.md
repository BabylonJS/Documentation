---
title: Creating A Point Cloud System
image: 
description: Learn how to create a point cloud system in Babylon.js.
keywords: diving deeper, point cloud, point cloud system
further-reading:
video-overview:
video-content:
---

# PCS Creation

To create an empty PCS requires three parameters; its name, the size for every particle and the scene, for example

```javascript
var pcs = new BABYLON.PointsCloudSystem("pcs", 5, scene);
```

After creating the PCS there are a number of options for adding particles

## Add Points

By default point particles are randomly added within a unit cube.

```javascript
pcs.addPoints(10000);
```

will add 10000 points.

-   <Playground id="#UI95UC" title="Adding Point Cloud Points" description="Simple example of adding point cloud points."/>

You can use your own function as a second parameter to set particle properties such as position and color. This function must have this kind of signature:

```javascript
var myFunc = function (particle, i, s) {
    // particle is the current particle, the i-th one in the PCS and the s-th one in its group
};
```

For example using i;

```javascript
var myfunc = function (particle, i, s) {
    particle.position = new BABYLON.Vector3(0.5 + 0.25 * Math.random(), i / 5000, 0.25 * Math.random());
    particle.color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), Math.random());
};
pcs.addPoints(10000, myfunc);
pcs.addPoints(10000, myfunc);
```

will produce a tall block of points whose heights cover the full range of 20000 points. Whereas using s,

```javascript
var myfunc = function (particle, i, s) {
    particle.position = new BABYLON.Vector3(0.5 + 0.25 * Math.random(), s / 5000, 0.25 * Math.random());
    particle.color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), Math.random());
};
pcs.addPoints(10000, myfunc);
pcs.addPoints(10000, myfunc);
```

will produce a denser block of points whose heights only cover a range of 10000 points, as you can see in the picture below.

![use of i or s](/img/how_to/particles/points1.jpg)

In addition the use of `particle.groupId` can have an effect on all particles within a group. For example

```javascript
var myfunc = function (particle, i, s) {
    particle.position = new BABYLON.Vector3(particle.groupId * 0.5 + 0.25 * Math.random(), i / 5000, 0.25 * Math.random());
    particle.color = new BABYLON.Color4(Math.random(), Math.random(), Math.random(), Math.random());
};
pcs.addPoints(10000, myfunc);
pcs.addPoints(10000, myfunc);
```

will displace the second group of points along the x axis.

![use groupId](/img/how_to/particles/points2.jpg)

-   <Playground id="#UI95UC#1" title="Pass A Function" description="Simple example of passing a function to add point cloud points."/>

## Add Surface / Volume Points

You are able to take a mesh such as this one as a model

![Points 3](/img/how_to/particles/points3.jpg)

and convert it to particle points on its surface or within its volume

![Points 4](/img/how_to/particles/points4.jpg)

The points are evenly randomly distributed based on the size of the individual triangular facets of the mesh model. The density of points is the same for all facets.

For both the surface and the volume the default is that the points are randomly colored. For example the following are equivalents for the two surface and two volume additions.

```javascript
pcs.addSurfacePoints(model, 10000);
pcs.addSurfacePoints(model, 10000, BABYLON.PointColor.Random);

pcs.addVolumePoints(model, 10000);
pcs.addVolumePoints(model, 10000, BABYLON.PointColor.Random);
```

**Note:** additional calculations in `addVolumePoint` means that it takes longer than `addSurfacePoints` for the same number of points. For a large number of points this can be noticeable.

There are four available methods for coloring the points.

| Method                    | Effect                                                                                                                                                                                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BABYLON.PointColor.Random | Colors are assigned randomly to each point, default method .                                                                                                                                                                                                                              |
| BABYLON.PointColor.Stated | This method requires two extra parameters, the base color to use, default white, plus a range from 0 to 1 to randomize both the shade and tone of the stated color. A value of 0, default, gives no variation and 1 the largest variation.                                                |
| BABYLON.PointColor.Color  | When the model has a texture material applied the color of each point is determined by the texture color of a matching point on a facet. When the material used has color but no texture then the material color is used. When the model has no material applied random coloring is used. |
| BABYLON.PointColor.UV     | The model uv values for each facet corner are used to determine the uv values for the points. An emissive texture can be applied to the pcs.mesh.material to color the PCS mesh                                                                                                           |

For example:

```javascript
pcs.addSurfacePoints(box, 1000, BABYLON.PointColor.Stated, new BABYLON.Color3(1, 0, 0), 0.5);
pcs.addVolumePoints(box, 10000, BABYLON.PointColor.Color);
pcs.addSurfacePoints(box, 100000, BABYLON.PointColor.UV);
```

**Note:** Using `BABYLON.PointColor.UV` can be limiting. Several models can be added to the PCS. These models may all have different textures. However only one emissive texture can be applied to a PCS mesh. In this case a separate PCS mesh is needed for each model. This is not a restriction when using `BABYLON.PointColor.Color`.

**Imported Models and Multiple Textures**
In some cases (for example PBRMaterial) more than one texture can be applied to a model. In which case adding surface or volume points with `BABYLON.PointColor.Color` will, by default, use the first in the model's texture array. Though often it is, the first texture may not be the color map, for example it may be a normal map. To specify which texture to use its position in the texture array can be added as a second parameter.

```javascript
pcs.addSurfacePoints(model, 10000, BABYLON.PointColor.Color, 1);

pcs.addVolumePoints(model, 10000, BABYLON.PointColor.Color, 3);
```

Of course when you import a model you may not know how many child meshes the model is made up off nor the order of textures for each mesh. Using the [inspector](/toolsAndResources/tools/inspector) you can check the loaded textures and see if their names give you a clue. If not then use trial and error from 0 to the number of textures. Alternatively you can check out meshes and textures once loaded along the lines of

```javascript
BABYLON.SceneLoader.ImportMesh("", "location", "file", scene, function (meshes) {
    var n = meshes.length;
    var p;
    var t;
    for (var i = 0; i < n; i++) {
        if (meshes[i].material !== null) {
            console.log("Mesh", i);
            t = meshes[i].material.getActiveTextures();
            p = t.length;
            for (var j = 0; j < p; j++) {
                console.log("Texture", j, "Name", t[j].name);
            }
        }
    }
});
```

**Examples**

-   <Playground id="#UI95UC#2" title="Random Surface" description="Simple example of a point cloud system with random surfaces."/>
-   <Playground id="#UI95UC#3" title="Stated Surface" description="Simple example of a point cloud system with stated surfaces"/>
-   <Playground id="#UI95UC#4" title="Surface Color from Mesh Color" description="Simple example of a point cloud system with surface color from mesh color."/>
-   <Playground id="#UI95UC#5" title="Surface Color from Mesh Texture" description="Simple example of a point cloud system with surface color from mesh texture."/>
-   <Playground id="#UI95UC#6" title="Surface UV from Mesh Texture" description="Simple example of a point cloud system with surface UV from mesh texture."/>
-   <Playground id="#UI95UC#28" title="Surface Color from Imported Mesh Texture" description="Simple example of a point cloud system with surface color from an imported mesh texture."/>
-   <Playground id="#UI95UC#7" title="Random Volume" description="Simple example of a point cloud system with random volume."/>
-   <Playground id="#UI95UC#8" title="Stated Volume" description="Simple example of a point cloud system with stated volume."/>
-   <Playground id="#UI95UC#9" title="Volume Color from Mesh Color" description="Simple example of a point cloud system with volume color from mesh color."/>
-   <Playground id="#UI95UC#10" title="Volume Color From Mesh Texture" description="Simple example of a point cloud system with volume color from a mesh texture."/>
-   <Playground id="#UI95UC#11" title="Volume UV from Mesh Texture" description="Simple example of a point cloud system with volume UV from a mesh texture."/>
-   <Playground id="#UI95UC#28" title="Volume Color From Imported Mesh Texture" description="Simple example of a point cloud system with volume color from an imported mesh texture."/>

## Building the Mesh

The PCS mesh cannot be built until all relevant data is collected. Since this can involve ensuring that the material, applied to a model used in adding surface or volume points, is fully loaded, building the mesh is an asynchronous process.

For example when a mesh model is used in determining the points the model cannot be disposed of until the process of PCS construction is completed. This is achieved by, for example

```javascript
pcs.addSurfacePoints(box, 10000, BABYLON.PointColor.Color);
pcs.addPoints(10000, myFunc);
pcs.buildMeshAsync().then(() => box.dispose());
```

If you never want the particle properties of your PCS to change, ie you want it to be immutable then you need do no more. Alternatively you can set the PCS as immutable on creation by setting the updatable option. (Currently updatable is the only item in the option list that is available but the option list is open for future expansions)

```javascript
var pcs = new BABYLON.PointsCloudSystem("pcs", 5, scene, { updatable: false });
```

After making updatable false the following methods will no longer have any effect, `initParticles()`, `updateParticle(particle)` and `setParticles()`.