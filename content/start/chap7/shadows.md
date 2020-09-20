# Getting Started - Working With Code
## Add Shadows
The light we have been using so far, the *HemisphericLight* gives an ambient background light and is not suitable for producing shadows. We could use the lamp spot lights however the shadows they produce can be faint and so we will introduce a directional light.

```javascript
const  light = new BABYLON.DirectionalLight("dir", direction, scene);
```
As usual the direction is a vector3 and the scene parameter is optional.

Setting its position will affect the direction and length of any created shadows.

```javascript
light.position = new BABYLON.Vector3(0, 15, -30);
```

Shadows will only appear when a *ShadowGenerator* object is created, a mesh casting the shadow is given and the mesh on which the shadow will be cast is set to receive shadows. 

```javascript
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
```

The first parameter is the size of a shadow map and the light generating the shadow.

We also need to add a mesh that will cast the shadow.

```javascript
shadowGenerator.addShadowCaster(casting mesh, true);
```

The optional second parameter, which has default value false, will add any children of the mesh to the shadow caster.

Finally we also have to tell the mesh on which the shadow is cast to receive it.

```javascript
receiving_mesh.receiveShadows = true
```

In our case we need, at appropriate positions

```javascript
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

shadowGenerator.addShadowCaster(dude, true);

ground.receiveShadows = true;
```
https://www.babylonjs-playground.com/#4G38H4#3

Putting this, with suitable value adjustments, in our world gives

https://www.babylonjs-playground.com/#KBS9I5#65

So far we have had only one way to view our village world. There are other possibilities with different cameras.

