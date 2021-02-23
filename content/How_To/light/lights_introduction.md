---
title: Introduction To Lights
image: 
description: Learn the basics of lights in Babylon.js
keywords: welcome, babylon.js, diving deeper, lights, lighting
further-reading:
video-overview:
video-content:
---

## Lights
Lights are used, as you would expect, to affect how meshes are seen, in terms of both illumination and colour.
All meshes allow light to pass through them unless shadow generation is activated. The default number of lights allowed is
four but this can be increased.

![Elements](/img/testlight.jpg)

_A pretty sphere with multiple lights_


## Types of Lights
There are four types of lights that can be used with a range of lighting properties.

### The Point Light
A point light is a light defined by an unique point in world space. The light is emitted in every direction from this point. A good example of a point light is a standard light bulb.

```javascript
var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, 10, 1), scene);
```

### The Directional Light
A directional light is defined by a direction (what a surprise!). The light is emitted from everywhere in the specified direction, and has an infinite range.
An example of a directional light is when a distant planet is lit by the apparently parallel lines of light from its sun. Light in a downward direction will light
the top of an object.

```javascript
var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);
```

### The Spot Light
A spot light is defined by a position, a direction, an angle, and an exponent. These values define a cone of light starting from the position, emitting toward the direction.

The angle, in radians, defines the size (field of illumination) of the spotlight's conical beam , and the exponent defines the speed of the decay of the light with distance (reach).

_A simple use of a spot light_

```javascript
var light = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);
```

### The Hemispheric Light
A hemispheric light is an easy way to simulate an ambient environment light. A hemispheric light is defined by a direction, usually 'up' towards the sky. However it is by setting the color properties
that the full effect is achieved.

```javascript
var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
```

## Color Properties
There are three properties of lights that affect color. Two of these _diffuse_ and _specular_ apply to all four types of light, the third, _groundColor_, only applies to an Hemispheric Light.

1. Diffuse gives the basic color to an object;
2. Specular produces a highlight color on an object.

In these playgrounds see how the specular color (green) is combined with the diffuse color (red) to produce a yellow highlight.

<Playground id="#20OAV9" title="Point Light Example" description="Simple Example of adding a Point Light to your scene." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro1.jpg" isMain={true} category="Lights"/>

<Playground id="#20OAV9#1" title="Directional Light Example" description="Simple Example of adding a Directional Light to your scene." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro2.jpg" isMain={true} category="Lights"/>

<Playground id="#20OAV9#3" title="Spot Light Example" description="Simple Example of adding a Spot Light to your scene." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro3.jpg" isMain={true} category="Lights"/>

<Playground id="#20OAV9#5" title="Hemispheric Light Example" description="Simple Example of adding a Hemispheric Light to your scene." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro4.jpg" isMain={true} category="Lights"/>

For a hemispheric light the _groundColor_ is the light in the opposite direction to the one specified during creation.
You can think of the _diffuse_ and _specular_ light as coming from the centre of the object in the given direction and the _groundColor_ light in the opposite direction.

<Playground id="#20OAV9#5" title="Hemispheric Light On 2 Spheres" description="Simple Example of a Hemispheric Light on 2 spheres." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro5.jpg"/>

White hemispheric light with a black groundColor is a useful lighting method.

### Intersecting Lights Colors
<Playground id="#20OAV9#9" title="Intersecting Spot Lights" description="Simple Example of a intersecting spot light colors." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro6.jpg"/>

## Limitations
Babylon.js allows you to create and register as many lights as you choose, but know that a single StandardMaterial can only handle a defined number simultaneous lights (by default this value is equal to 4 which means the first four enabled lights of the scene's lights list).
You can change this number with this code:

```javascript
var material = new BABYLON.StandardMaterial("mat", scene);
material.maxSimultaneousLights = 6;
```
But beware! Because with more dynamic lights, Babylon.js will generate bigger shaders which may not be compatible with low end devices like mobiles or small tablets. In this case, babylon.js will try to recompile shaders with less lights.

<Playground id="#IRVAX#0" title="6 Intersecting Point Lights" description="Simple Example with 6 intersecting point lights." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro7.jpg"/>

## On, Off or Dimmer
Every light can be switched off using
```javascript
light.setEnabled(false);
```
and switched on with
```javascript
light.setEnabled(true);
```

Want to dim or brighten the light? Then set the _intensity_ property (default values is 1)
```javascript
light0.intensity = 0.5;
light1.intensity = 2.4;
```

For point and spot lights you can set how far the light reaches using the _range_ property
```javascript
light.range = 100;
```

## Choosing Meshes to Light
When a light is created all current meshes will be lit by it. There are two ways to exclude some meshes from being lit.
A mesh can be added to the _excludedMeshes_ array or add the ones not to be excluded to the _includedOnlyMeshes_ array. The number of meshes to be excluded can be one factor in deciding which method to use. In the following example two meshes are to be excluded from _light0_ and twenty three from _light1_. Commenting out lines 26 and 27 in turn will show the individual effect.

<Playground id="#20OAV9#8" title="Example of Excluding Meshes to Light" description="Simple Example of exluding meshes from being lit by a light." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro8.jpg" isMain={true} category="Lights"/>

## Lighting Normals
How lights react to a mesh depend on values set for each mesh vertex termed _normals_, shown in the picture below as arrows giving the direction of the lighting normals. The picture shows two planes and two lights. One light is a spot light, the other is a point light. The front face of each plane is the one you see when the _normals_ are pointing towards you, the back face the opposite side.

![Elements](/img/how_to/Mesh/normals6.jpg)

_A blue back-faced plane and a blue front-faced plane, with a spot light and point light_

As you can see, the lights only affect the front face and not the back face.

## Lightmaps
Complex lighting can be computationally expensive to compute at runtime. To save on computation, lightmaps may be used to store calculated lighting in a texture which will be applied to a given mesh.
```javascript
var lightmap = new BABYLON.Texture("lightmap.png", scene);
var material = new BABYLON.StandardMaterial("material", scene);
material.lightmapTexture = lightmap;
```
Note: To use the texture as a shadowmap instead of lightmap, set the material.useLightmapAsShadowmap field to true.

The way that the scene lights are blended with the lightmap is based on the lightmapMode of the lights in the scene.

```javascript
light.lightmapMode = BABYLON.Light.LIGHTMAP_DEFAULT;
```
This will cause lightmap texture to be blended after the lighting from this light is applied.

```javascript
light.lightmapMode = BABYLON.Light.LIGHTMAP_SPECULAR;
```
This is the same as LIGHTMAP_DEFAULT except only the specular lighting and shadows from the light will be applied.

```javascript
light.lightmapMode = BABYLON.Light.LIGHTMAP_SHADOWSONLY;
```
This is the same as LIGHTMAP_DEFAULT except only the shadows cast from this light will be applied.

<Playground id="#ULACCM#2" title="Lightmaps Example" description="Simple Example of using lightmaps in your scene." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro9.jpg"/>

## Projection Texture
In some cases it would be nice to define the diffuse color of the light (Diffuse gives the basic color to an object) from a texture instead of a constant color. Imagine that you are trying to simulate the light effects inside of a cathedral. The light going through the stained glasses will be projected on the ground. This is also true for the light coming from a projector or the light effects you can see in a disco.

In order to support this feature, you can rely on the `projectionTexture` property of the lights. This is only supported by the **SpotLight** so far.

```javascript
var spotLight = new BABYLON.SpotLight("spot02", new BABYLON.Vector3(30, 40, 30),
		new BABYLON.Vector3(-1, -2, -1), 1.1, 16, scene);
spotLight.projectionTexture = new BABYLON.Texture("textures/stainedGlass.png", scene);
```

<Playground id="#CQNGRK" title="Projection Texture Example" description="Simple Example of using projection textures in your scene." image="/img/playgroundsAndNMEs/divingDeeperLightsIntro10.jpg"/>

<Youtube id="qqMuuSM7GvI"/>

In order to control the projection orientation and range, you can also rely on the following properties:

* ```projectionTextureLightNear``` : near range of the texture projection. If a plane is before the range in light space, there is no texture projection.
* ```projectionTextureLightFar``` : far range of the texture projection. If a plane is before the range in light space, there is no texture projection.
* ```projectionTextureUpDirection``` : helps defining the light space which is oriented towards the light direction and aligned with the up direction.

The projected information is multiplied against the normal light values to better fit in the Babylon JS lighting. It also only impact the diffuse value. So it might be necessary to change the specular color of the light to better fit with the scene.