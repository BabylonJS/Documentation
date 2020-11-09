---
title: Reflections and Refractions
image: 
description: Learn all about reflection and refraction in Babylon.js.
keywords: welcome, babylon.js, diving deeper, materials, refraction, reflection
further-reading:
video-overview:
video-content:
---

Using reflection textures can simulate mirror like material and refraction textures can simulate looking through glass or water.

## Reflection
Reflections are created using the _relectionTexture_ property  of a material. A first use is in creating a sky using a [skybox](/How_To/Skybox)

This sets the _relectionTexture_ to a _CubeTexture_ and the _coordinatesMode_ of the _relectionTexture_ to SKYBOX_Mode as in

```javascript
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("PATH TO IMAGES FOLDER/COMMON PART OF NAMES", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
```
## CubeTexture
By default six jpeg images are passed to a _CubeTexture_. The images are named in this form, commonPart\_px.jpg, commonPart\_nx.jpg,
commonPart\_py.jpg, commonPart\_ny.jpg, commonPart\_pz.jpg, commonPart\_nz.jpg corresponding to the positions shown below.

![CubeTexture Positions](/img/how_to/Materials/cubetexture1.png)

When doing this for a skybox the box created is given a large size (1000 in the skybox example above) but _CubeTexture_ can be used with any size box and is one
way of applying different textures to each side of a cube. Notice that as we are dealing with a small box and we are viewing it from the outside _backFaceCulling_ can be set to _true_. This is not
possible when the camera is inside the large skybox since in terms of rendering the sky at the back will be still behind the fron portion and will
not be rendered should _backFaceCulling = true_. However we still need to use _reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX\_MODE_.

```javascript
var box = BABYLON.MeshBuilder.CreateBox("Box", {}, scene);
var boxMaterial = new BABYLON.StandardMaterial("mat", scene);
boxMaterial.backFaceCulling = true;
boxMaterial.reflectionTexture = new BABYLON.CubeTexture("http://babylonjsguide.github.io/img/cubeSide", scene);
boxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
boxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
boxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
box.material = boxMaterial;
```

* <Playground id="#UU7RQ#2" title="Different Reflections On Each Face" description="Simple example of different reflections on each face of a mesh." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction1.jpg"/>

From Babylon.js v2.4 it is also possible to use High Dynamic Range Cube Textures

### Reflecting on Skybox and a shape
Using different _coordinatesMode_ with different shapes will reflect the skybox in the shape

* <Playground id="#UU7RQ#3" title="Box and CUBIC_MODE Reflection" description="Simple example of a box and CUBIC_MODE Reflection." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction2.jpg"/>
* <Playground id="#UU7RQ#5" title="Ground and PLANAR_MODE Reflection" description="Simple example of a ground and PLANAR_MODE Reflection." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction3.jpg"/>
* <Playground id="#UU7RQ#4" title="Sphere and PLANAR_MODE Reflection" description="Simple example of a sphere and PLANAR_MODE Reflection." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction4.jpg"/>

### Using local cubemap mode

Starting with Babylon.js v3.2, you can now use local cubemap mode when using cubemaps (with CUBIC_MODE).
Please read [this article](https://community.arm.com/graphics/b/blog/posts/reflections-based-on-local-cubemaps-in-unity), to get a precise understanding of what local cubemaps are.

CubeTexture and RenderTargetTexture (when in cube mode, like when used with [probes](/how_to/how_to_use_reflection_probes) for instance) can be switched to local mode by setting  property named `boundingBoxSize` (by default cubemaps are in infinite mode):

```
material.reflectionTexture = new BABYLON.CubeTexture("/textures/TropicalSunnyDay", scene);
material.reflectionTexture.boundingBoxSize = new BABYLON.Vector3(100, 100, 100);
```

You can also specify a property named `boundingBoxPosition` if you want to define the center of the bounding box used for the cubemap (The place where the camera was set when generating the cubemap).

You can find an demo of local cubemaps here: <Playground id="#RNASML#37" title="Local Cubemap Example" description="Simple example of using local cubemaps in your scene." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction5.jpg"/>

## HDRCubeTexture
High Dynamic Range (HDR) images are panoramic images that cover an entire field of vision.

Below is an HDR image of a room

![Room](/img/how_to/Materials/room.png)

Replace the following line
```javascript
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("PATH TO IMAGES FOLDER/COMMON PART OF NAMES", scene);
```
with
```javascript
skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("PATH TO HDR IMAGE", scene);
```

* <Playground id="#114YPX#5" title="HDR Skybox" description="Simple example of an HDR Skybox in your scene." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction6.jpg"/>

## EquiRectangularCubeTexture
Equirectangular images are browser-canvas supported images like jpeg, png, and many more. A list of image support on browsers can be found [here](https://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support).

Below is an equirectangular image of a shop

![Shop](/img/resources/textures_thumbs/360photo.jpg)

Replace any of the following lines
```javascript
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("PATH TO IMAGES FOLDER/COMMON PART OF NAMES", scene);
skyboxMaterial.reflectionTexture = new BABYLON.HDRCubeTexture("PATH TO HDR IMAGE", scene);
```
with
```javascript
cubemapDesiredSize = 512; // The cubemap desired size (the more it increases the longer the generation will be)
skyboxMaterial.reflectionTexture = new BABYLON.EquiRectangularCubeTexture("PATH TO EQUIRECTANGULAR IMAGE", scene, cubemapDesiredSize);
```

* <Playground id="#6YN2X1" title="Equirectangular Skybox" description="Simple example of an equirectangular HDR Skybox in your scene." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction7.jpg"/>
* <Playground id="#32H1D4" title="Equirectangular Image On A Sphere" description="Simple example of an equirectangular image on a sphere." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction8.jpg"/>
* <Playground id="#RY8LDL" title="Both Combined" description="Simple example of an equirectangular skybox and equirectangular image on a sphere." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction9.jpg"/>

## Spherical Reflection Texture
Not only can a cube texture can be applied to a sphere so can a plane single image.

![Squares](/img/how_to/Materials/reflectest.png)

The above image was applied to each of four spheres, one as a diffuse texture and the other three with _reflectionTexture_ but different _coordinatesMode_. The resuls are below.

![Reflection on Spheres](/img/how_to/Materials/modes.png)

|   |   |
|-----|-----|
| Diffuse Texture | SPHERICAL_MODE |
| PLANAR\_MODE | PROJECTION\_MODE |

* <Playground id="#20OAV9#26" title="Coordinate Modes Example" description="Simple example of coordinate modes." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction10.jpg"/>

## Mirrors
So far reflections have been of images, using _MirrorTexture_ obects within the scene can be reflected as in a mirror. This is simulated by
by setting the _reflectionTexture_ to a _MirrorTexture_ and applying it to a flat surface.

* <Playground id="#1YAIO7#5" title="Mirrors" description="Simple example of using mirrors in your scene." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction11.jpg"/>

A real mirror is made of two parts glass and a reflected surface applied to the glass and a mirror simulated within
BJS also contains to parts; a flat surface and a reflector. (For a reflective surface such as metal or still water - think metal plus shine and water plus air boundary).

In BJS the flat surface is a ground mesh or a plane mesh and the reflector is a Mathematical Plane which is infinite and
lies on top of the flat mesh and reflects where the two overlap.

With a real mirror it is easy to tell if you are standing in front of it or behind it. For a BJS mirror an object is
in front of the mirror if the normals of the flat surface point towards the object.

### Constructing the Mirror Reflector
The flat surface should be constructed first from a ground or plane mesh. BJS can then construct the reflector using the position and normal of the flat surface. Since the
reflection is on the opposite side of the mirror to the object being reflected the normal for reflection is in the opposite direction to that
of the flat surface. For example a mesh of a plane created in BJS has a normal vector (0, 0, -1) at the time of creation and so the reflected normal will be (0, 0, 1).

The next thing to note is that renderings of meshes take place by applying transformations, the worldMatrix, to the original mesh values. It is
therefore necessary the get this worldMatrix and apply it to the data from the flat surface in order to obtain the current and actual 3D data in world space.

An example of creating a 'glass' flat surface and obtaining the reflector is

```javascript
var glass = BABYLON.MeshBuilder.CreatePlane("glass", {width: 5, height: 5}, scene);

//Position and Rotate flat surface
glass.position = new BABYLON.Vector3(0, 0, 4);
glass.rotation = new BABYLON.Vector3(Math.PI/4, Math.PI/6, Math.PI/8);

//Ensure working with new values for flat surface by computing and obtaining its worldMatrix
glass.computeWorldMatrix(true);
var glass_worldMatrix = glass.getWorldMatrix();

//Obtain normals for plane and assign one of them as the normal
var glass_vertexData = glass.getVerticesData("normal");
var glassNormal = new BABYLON.Vector3(glass_vertexData[0], glass_vertexData[1], glass_vertexData[2]);
//Use worldMatrix to transform normal into its current world value
glassNormal = new BABYLON.Vector3.TransformNormal(glassNormal, glass_worldMatrix)

//Create reflector using the position and reflected normal of the flat surface
var reflector = new BABYLON.Plane.FromPositionAndNormal(glass.position, glassNormal.scale(-1));
```

### Constructing the Mirror
Once the reflector is obtained a _MirrorTexture_ is made that can be applied to the flat surface.

```javascript
var mirrorMaterial = new BABYLON.StandardMaterial("MirrorMat", scene);
mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 512, scene, true);
mirrorMaterial.reflectionTexture.mirrorPlane = reflector;
mirrorMaterial.reflectionTexture.renderList = [sphere1, sphere2];
```
A _MirrorTexture_ has four parameters: name, size of the rendering buffer (should be a power of 2, the larger the number the better image quality but performance deteriorates); scene and
and optional parameter, default value false, that will generate a MIP map when set to true. This increases quality durinng scaling.

The _mirrorPlane_ is set to the constructed reflector. It is possible to directly set the _mirrorPlane_ by directly using a BABYLON.Plane(a, b, c, d) where a, b and c give the plane normal vector (a, b, c) and
d is a scalar displacement from the _mirrorPlane_ to the origin. However in all but the very simplest of situations it is more straight forward to use the method above.

The _renderList_ is an array of the meshes to be reflected in the mirror.

Finally the mirrorMaterial can be applied to the glass.

```javascript
glass.material = mirrorMaterial;
```

### Blurring the Reflection
_MirrorTexture_ can support blurred rendering with either:

* adaptiveBlurKernel: setting this value to something other than 0 will blur the texture with a specified kernel (the bigger the blurrier). The value will be adapted to the viewport size.
* blurKernel: same as adaptiveBlurKernel property but the value is not adapted to viewport size.

* <Playground id="#LVTTQX#1" title="Reflection Blur" description="Simple example of using reflection blur in your scene." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction12.jpg"/>

# Refraction
In this case an object behind glass or under water for example can have its position and size changed by the refraction of light.

* <Playground id="#22KZUW#15" title="Refraction" description="Simple example of using refraction in your scene." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction13.jpg"/>

Refraction is also achieved by taking a flat surface such as a plane or disc and adding, this this case, a refraction material applied to a flat mesh. The difference is that the object
that is to be refracted is placed behind the flat surface, that is the normals of the mesh all point away from the object and the refracted normals are in the same direction.

The method used above to obtain the _reflectionPlane_ could be used if necessary though in this case the normal of the flat surface is not reversed.

```javascript
var refractor = new BABYLON.Plane.FromPositionAndNormal(glass.position, glassNormal);
```

The following example, however, uses a vertical plane for the mesh at the origin and so it is straight forward to obtain the normal (0, 0, -1) and displacement, 0, for the refractor plane.

```javascript
    //Create flat surface
	var surface = BABYLON.MeshBuilder.CreatePlane("surface", {width: 15, height: 15}, scene);

	//Create the refraction material
	var refractionMaterial = new BABYLON.StandardMaterial("refraction", scene);
	refractionMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
	refractionMaterial.refractionTexture = new BABYLON.RefractionTexture("refraction", 1024, scene, true);
	refractionMaterial.refractionTexture.refractionPlane = new BABYLON.Plane(0, 0, -1, 0);
	refractionMaterial.refractionTexture.renderList = [sphere];
	refractionMaterial.refractionTexture.depth = 5;
	refractionMaterial.indexOfRefraction = 0.5;
	surface.material = refractionMaterial;
```

Two new parameters are apparent _depth_ a property of the refractionTexture and _indexOfRefraction_ a property of the refraction material/

The two examples below show the effect of changing these.

*Note* in both examples the surfaces are transparent so that the actual position of the sphere can be identified. It is the refracted
sphere that changes psoition as the parameters are changed.

* <Playground id="#1YAIO7#20" title="Refraction Depth" description="Simple example of using refraction depth in your scene." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction14.jpg"/>
* <Playground id="#1YAIO7#19" title="Index Of Refraction" description="Simple example of changing the index of refraction in your scene." image="/img/playgroundsAndNMEs/divingDeeperReflectionRefraction15.jpg"/>