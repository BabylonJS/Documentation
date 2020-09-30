# Ribbon in Detail
Lets take a closer look at a ribbon
 
It is formed using paths. A path is simply an array of a minimum of two vector3 points.  

Below shows the construction of a ribbon using two paths A and B each having five points. 

![Ribbon](/img/how_to/ribbon/ribbon.png)

You can have as many paths as you wish, including just one, you can close all the paths and/or close the paths array itself. Imagine a long ribbon of narrow width in the real world with wire running down its length. Closing the paths forms a loop of ribbon while closing the array would form a tube.

## Single Path Ribbon

First construct the single path, for example
```javascript
pathHelix = [];
let v;
for (let i = 0; i <= 60; i++) {
	v = 2.0 * Math.PI * i / 20;
	pathHelix.push( new BABYLON.Vector3(3 * Math.cos(v), i/4, 3 * Math.sin(v)) );
}
```

Showing the path https://www.babylonjs-playground.com/#F6JW5W#12

The ribbon is formed by joining each point on the path to a later point where one exists. The *offset* property governs how many points ahead the current point with be joined to. The triangular facets for the mesh are formed from the current point, the next point and the offset point.

For point *p* and offset *f* the triangle is *p*, *p + 1*, *p + f*, provided of course that *p + f &lt; number of points in the path array*

Create the ribbon with a variety of offsets and show in wireframe
default offset, half the path length (60 / 2 = 30) https://www.babylonjs-playground.com/#F6JW5W#13
offset 10 https://www.babylonjs-playground.com/#F6JW5W#14
offset 5 https://www.babylonjs-playground.com/#F6JW5W#15
offset 20 https://www.babylonjs-playground.com/#F6JW5W#16


So playing with _offset_, _closeArray_, or other parameters, you can easily get volumes, even with a single path https://www.babylonjs-playground.com/#F6JW5W#17

## Length of Paths
It's not mandatory that all the ribbon paths have the same length, but it is not recommended.  
The best way to emulate different lengths for some parts of your mesh is then to simply use many ribbons.
  
In this [example](https://www.babylonjs-playground.com/#88AZQ#16)
_path2_ and _path3_ are longer than _path1_ and _path4_.

As you can see, the final ribbon adjusts to different lengths. The rule is they all start from first path points and each intermediate ribbon then stops at first of its both constituting paths end. However, while you can add color using a material, as done [here](https://www.babylonjs-playground.com/#88AZQ#17) 

There is no incidence on light reflection for ribbon with different length paths. 
Therefore you **can't add a texture**  to a ribbon constructed with different length paths.  
This is due to the fact that the nested ribbon texturing algorithm only knows how to deal with a unique length for all paths. 
When applying a texture the algorithm assumes that the ribbon can be unfolded into a rectangle that can stretched to fit on top of the image used for the texture. 
This is only possible when paths are of equal length.

## Closed shapes : normals or textures ?

The ribbon mesh provides two ways to automatically close an unclosed shape.
  
* _closeArray_ parameter : this will add an extra unit ribbon between the last path and the first path of your _pathArray_.  
* _closePath_ parameter : this will join the last and first points of each _path_ in your _pathArray_.  

[Start with an unclosed ribbon](https://www.babylonjs-playground.com/#3XMWZ#44)
```javascript
var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: paths },  scene );
```  

[The same closed ribbon with _closeArray_ set to _true_](https://www.babylonjs-playground.com/#3XMWZ#45)
```javascript
var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: paths, closeArray: true },  scene );
```
[Now with a texture](https://www.babylonjs-playground.com/#3XMWZ#49)

Notice that the texture isn't stretched on the surface added by the automatic closing but applied independently. 
The reason for this behavior is that, with ribbon _closeXXX_ parameters, priority is given to the normals (the tools that compute light reflection) over textures. 
If you don't care about continuous light reflection but you do want your texture to be stretched along the whole surface, 
you just have to forget automatic closing and close the ribbon by yourself. A simple way to do this is just to re-push the first _path_ at the end of the _pathArray_

[Manual close with texture](https://www.babylonjs-playground.com/#3XMWZ#50)
```javascript
paths.push(paths[0]);
var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: paths },  scene );
``` 

The same rules and workarounds apply to the _closePath_ parameter.  
[Example with _closePath_ set to true](https://www.babylonjs-playground.com/#3XMWZ#52)
[As above with Texture](https://www.babylonjs-playground.com/#3XMWZ#51)