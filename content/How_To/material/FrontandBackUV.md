# Different Textures on the Front and Back of a Mesh

Having a front and a back makes most sense when talking about flat meshes such as a plane, a disc or a polygon. All of which have exactly two sides both of which can be seen only when the option _sideOrientation_ is set to **BABYLON.Mesh.DOUBLESIDE**.

However, many meshes have the option _sideOrientation_ and this method applies to them as well. In which case think of the front as outside and the back as inside.

To have different textures front and back the front and back image must be in the same file, like the one below

![front and back images](/img/how_to/different-material-front-back/card.jpg)

This is then split using the _frontUVs_ and _backUVs_ options.


## FrontUVs and BackUVs

Both frontUVs and backUVs have the form Vector4(u0, v0, u1, v1) with 0&lt;=  u0, v0, u1, v1 &lt;= 1 and 
(u0, v0) are the bottom left coordinates and (u1, v1) the top right coordinates of the clipping rectangle 
of the image.

To split the image above you can form two variables

```javascript
var f = new BABYLON.Vector4(0.5,0, 1, 1); // front image = half the whole image along the width 
var b = new BABYLON.Vector4(0,0, 0.5, 1); // back image = second half along the width 
```

and then place in the options

```javascript
var plane = BABYLON.MeshBuilder.CreatePlane("plane", {height:1, width: 0.665, sideOrientation: BABYLON.Mesh.DOUBLESIDE, frontUVs: f, backUVs: b}, scene);
```

taking into account width to height ratio of section of image.

It is then just a case of creating a _StandardMaterial_ and setting the texture to the image.

```javascript
var mat = new BABYLON.StandardMaterial("", scene);
mat.diffuseTexture = new BABYLON.Texture("URL to Image File", scene);
plane.material = mat;
```

## Two Sided Examples

* [Playground Example - Different images on a plane](https://www.babylonjs-playground.com/#LXZPJK#3)
* [Playground Example - Different images on a polygon](https://playground.babylonjs.com/#4G18GY#2)

## Inside and Outside Examples

* [Playground Example - Different images on a tube](https://www.babylonjs-playground.com/#165IV6#74)
* [Playground Example - View image on outside a sphere](https://www.babylonjs-playground.com/#K6M44R#3)
* [Playground Example - View image inside a sphere](https://www.babylonjs-playground.com/#K6M44R#4)



