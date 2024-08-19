---
title: Managing Solid Particles
image:
description: Learn how to manage solid particles in Babylon.js.
keywords: diving deeper, particles, solid particle system, solid particles
further-reading:
video-overview:
video-content:
---

# Managing SPS Particles

## Properties

There are many properties you can set on a particle

| Property           | Type       | Default      |
| ------------------ | ---------- | ------------ |
| position           | Vector3    | (0, 0, 0)    |
| rotation           | Vector3    | (0, 0, 0)    |
| rotationQuaternion | Quaternion | undefined    |
| velocity           | Vector3    | (0, 0, 0)    |
| color              | Color4     | (1, 1, 1, 1) |
| scaling            | Vector3    | (1, 1, 1)    |
| pivot              | Vector3    | (0, 0, 0)    |
| uvs                | Vector4    | (0, 0, 1, 1) |
| isVisible          | boolean    | true         |
| alive              | boolean    | true         |
| translateFromPivot | boolean    | false        |
| parentId           | integer,   | null         |
| props              | any        | null         |

and three you can read:

- _idx_ - which allows you to read the index of the particle in the SPS particles array;
- _idxInShape_ - which allows you to read the index of the particle relative to the shape (model mesh) added to the SPS;
- _shapeId_ - a number reference to the model added

For example, after

```javascript
SPS.addShape(model1, 1000);
SPS.addShape(model2, 500);

particle = SPS.particles[1200];
```

In the above example

1. the particle with _particle.idx = 745_ will have _particle.idxInShape = 745_ and _particle.shapeId = 0_.
2. the particle with _particle.idx = 1200_ will have _particle.idxInShape = 200_ and _particle.shapeId = 1_.

These can be useful for applying different properties to different shapes.

When you set a particle rotation quaternion, its rotation property will then be ignored.

All positions are expressed in the SPS mesh's _local space_.

Please note also that, even a particle is invisible (_isVisible_ set to _false_), its other property values can be updated and _updateParticle()_ is called for every particle whether it is visible or not.

### Pivot

Setting the _pivot_ vector value to a particle applies it as a translation to the particle in its local space. Any rotation is always computed around the local space origin. By default, the particle is translated, then rotated, then translated back to its original location unless you set the particle property _translateFromPivot_ to _true_ (default _false_). In this case, it's simply translated, then rotated and left at the translated location.

In the simple case of 1 dimension let a particle be at positionX with a pivot at pivotX. The center of transformation depends whether _translateFromPivot_ is true or not. When false it is at the point = positionX + pivotX, and when true it is the point = positionX. The distance of the point from the pivot is then pivotX.

<Playground id="#GLZ1PX#11" title="Solid Particle Pivot Example" description="Simple example of adjusting the pivot of a solid particle"/>

Illustration of pivot particle, 1D pivot placement; change data on lines 23 - 25 to see effect.

<Playground id="#LXXL6Y#1" title="Scaled Pivot Example" description="Simple example of scaling a pivot on a solid particle"/>

Pivot particle set in 3D, rotation and scaling applied - 1000 tetrahedron satellites orbiting around 1000 rotating boxes.

### Billboard

When you set your SPS in billboard mode, you should only set a _rotation.z_ value. Putting _SPS.billboard = true_ makes all the particles face the camera and their _x_ and _y_ rotation values will be ignored. This is rather useful if you display only plane particles. However, if you deal only with 2D particles you should consider to use the particle system or one of the various sprite managers which are more performant in 2D computation. In order to display the SPS in billboard mode, you need to call _SPS.setParticles()_ within the scene render loop.

<Playground id="#WCDZS#523" title="Solid Particle Plane Billboard Mode" description="Simple example of solid plane particles in billboard mode."/>

Here is an example with plane particles in billboard mode.

<Playground id="#WCDZS#521" title="Solid Plane Particles Rotating" description="Simple example of solid plane particles rotating"/>

The same but with plane particle rotations and no billboard mode.

<Playground id="#WCDZS#522" title="Solid Box and Tetrahedron Particles Rotating" description="Simple example of solid box and tetrahedron particles rotating"/>

The same with solid particles, boxes and tetrahedrons.

<Playground id="#2FPT1A#9" title="Solid Particles With Colors and Rotations" description="Simple example of solid particles with colors and rotations."/>

Another one with colors and rotations.

### Color

When setting a particle color all vertices of the particle are set to that color and will blend nicely with any material colors if applied.

On creation the vertex colors of the particle are the vertex colors of the model added. When the model has vertices using a range of colors, a box with different face colors for example, these colors are preserved by the particle. However setting the color of a particle will result in a single color for that particle. When the model mesh has no colors the particle color is set to white.

In _initParticle_ and _updateParticle_ you can use, for example

```javascript
particle.color.r = red; //number from 0 to 1
particle.color.g = green; //number from 0 to 1
particle.color.b = blue; //number from 0 to 1
particle.color.a = alpha; //number from 0 to 1
```

Note: There is another way of setting the initial state of the particles that you will learn about when you read the next page on immutable SPS. This is done by an option property _positionFunction_ when adding a shape. When this method is used particle colors are null and so a new Color4 object must be created to set _particle.color_, following this form

```javascript
particle.color = new BABYLON.Color4(0.25, 0.333, 0.67, 0.88);
```

When you want to set an alpha value, don't forget to enable the alpha channel for vertex colors

```javascript
SPS.mesh.hasVertexAlpha = true;
```

### UVS

On the next page we will look at how SPS can be configured to use multi-materials. For now we just consider the use of one material with one texture. The image file you use should contain all the textures you want to apply to the particles as a texture atlas.

To apply a texture from a region of the image file you specify its lower left (x, y) and upper right (z, w) coordinates as fractions of the whole image in the form of a UV vector4 (x, y, z, w). Taking the lower left coordinates of (0, 0) and the upper left as (1, 1) will apply the whole image as a material. The _uvs_ property of a particle is a vector4 and for the whole image you would use a uv of (0, 0, 1, 1).

When you want to apply a smaller region given by lower left (0.2, 0.1) and upper right as (0.6, 0.3) you just set the _uvs_ property like this

```javascript
particle.uvs.x = 0.2; //the coordinate of lower left corner given by 20% of image width
particle.uvs.y = 0.1; //the coordinate of lower left corner given by 10% of image height
particle.uvs.z = 0.6; //the coordinate of upper right corner given by 60% of image width
particle.uvs.w = 0.3; //the coordinate of upper right corner given by 30% of image height
```

![sps.particle.uv](/img/how_to/Particles/sps2.png)

This can be used both by all the custom functions the _positionFunction_ and _updateParticle()_, whichever you are using. It is most useful when the image is a texture atlas.

 <Playground id="#GLZ1PX#312" title="Solid Particles With UVs set" description="Simple example of creating solid particles with differing areas of a texture."/>

Each particle has a different area of the texture set

#### Face Material

When the model mesh you are adding to the SPS is one that is using the [material per face technique](/features/featuresDeepDive/materials/using/texturePerBoxFace) then the correct uv values will be applied automatically when the model is added as a shape. Unlike for the colors, the model UVs are saved whether the model had per face UVs or not. This allows to use not only a texture atlas for the particles, but also a texture atlas for the model then inside the particle atlas because you use only one texture in final.

![Sprite Altlas](/img/how_to/apply-material-to-faces/spriteAtlas2.png)

<Playground id="#GLZ1PX#313" title="Solid Particles With Material Per Face" description="Simple example of creating solid particle copies of a mesh with unique materials per face."/>

Model is a box with per face material, scaling the FaceUVs by 2 groups the 24 individual characters into 6 groups of 4. The particles' material are direct copies of those of the model.

<Playground id="#GLZ1PX#314" title="Solid Particles With Material Per Face With UVs Changed" description="Simple example of creating solid particle copies of a mesh with unique materials per face, but changed UVs."/>

Model is a box with per face material applied as before with a group of four per face. An area of the texture for each face is then chosen using the particles _uvs_, in this case by halving in both the width and height for all particles as in image below.

![Sprite Altlas](/img/how_to/apply-material-to-faces/spriteAtlas3.png)

Transparency

Like for any other mesh, you can also enable the texture transparency with :

```javascript
SPS.mesh.material.diffuseTexture.hasAlpha = true;
```

Or even use the alpha channel of the texture image :

```javascript
SPS.mesh.material.useAlphaFromDiffuseTexture = true;
```

<Playground id="#WCDZS#520" title="Solid Particle Color and UVs Example" description="Simple example of adjusting the color and UVs of a solid particle system."/>

Color and UVs example.

<Playground id="#GLZ1PX#14" title="Solid Particles With Textures and Alpha" description="Simple example of solid particles with textures and alpha."/>

Texture with alpha.

### Parenting

Each particle can be given another particle as a parent. The parent must be created before the current particle, this means the parent has to have a lower index Id (`particle.idx`) than the current particle. So the first particle in the pool (`idx = 0`) cannot have a parent. To give a parent to a particle, just set its property `.parentId` to the parent index Id value.

```javascript
if (particle.idx > 0) {
  particle.parentId = particle.idx - 1; // the previous particle becomes the parent of the current one
}
```

To un-parent a particle, just set `.parentId` back to `null`, the default value.  
When a particle has got a parent, its position and rotation are then expressed in its parent local space.

In the following code the previous particle becomes the parent of the current one. The particle position and rotation are expressed in the previous particle space, this one being already rotated and translated from the yet previous particle. Etc.

```javascript
if (particle.idx > 0) {
  particle.parentId = particle.idx - 1;
  particle.rotation.z = 0.01;
  particle.position.x = 1.0;
}
```

<Playground id="#GLZ1PX#16" title="Box Rotating Around A Parent Box" description="Simple example of a bluish box rotating around its pivot parented to a sliding red box."/>

A bluish box rotating around its pivot parented to a sliding red box.

<Playground id="#GLZ1PX#15" title="Adding A Third Box" description="Simple example of a third box added to the last two, rotating about the previous one"/>

A third box added the last two rotating about the previous one.

<Playground id="#GLZ1PX#17" title="7 Box Parenting Chain" description="Simple example of a chain of 7 boxes each parented to the previous one."/>

A chain of 7 boxes each parented to the previous one.

<Playground id="#V7V1RS" title="Parenting Craziness" description="Simple example of 2000 boxes parented per 20 segment stems."/>  
2000 boxes parented per 20 segment stems.

### Custom Properties

In JavaScript, you can obviously also create your own properties like _acceleration: Vector3_ or _age_, in _initParticles()_ for instance.

```javascript
SPS.initParticles = function () {
  for (let p = 0; p < SPS.nbParticles; p++) {
    particles[p].age = Math.random() * 20;
  }
};
```

Using TypeScript (or JavaScript), you can associate your own properties to each particle with the property _props_ typed _any_ and _null_ by default :

```javascript
particle.props = { myProp1: val1, myProp2: val2 };
```

## Methods

To manage the behavior of particles you use the mandatory method _setParticles_ along with some non mandatory custom functions. The _setParticles_ method is necessary to update and display the mesh built by the SPS.

The non mandatory custom functions

- **_initParticles()_** : lets you set all the initial particle properties. You must iterate over all the particles by using the _SPS.nbParticles_ property.
- **_recycleParticle(particle)_** : lets you set a particle to be recycled. It is called per particle.
- **_updateParticle(particle)_** : lets you set the particle properties. This function is called per particle by _SPS.setParticles()_.
- **_beforeUpdateParticles()_** : lets you make things within the call to _SPS.setParticles()_ just before iterating over all the particles.
- **_afterUpdateParticles()_** : lets you make things within the call to _SPS.setParticles()_ just after the iteration over all the particles is done.

The following pseudo-code schema will show you their application.

```javascript
var particles: SolidParticles[] = [array of SolidParticle objects];
function setParticles() {
    beforeUpdateParticles();
    for (let p = 0; p < nbParticles; p++) {
        updateParticles(particles[p]);
    }
    updateTheWholeMesh();
    afterUpdateParticles();
}
```

When needed you would call _recycleParticle(particle)_ in your own _updateParticle(particle)_ function for instance

```javascript
SPS.updateParticle = function (particle) {
  particle.velocity--;
  if (particle.velocity < 0) {
    particle.alive = false;
    SPS.recycleParticle(particle); // call to your own recycle function
  }
};
```
