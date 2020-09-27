# Getting Started - Working With Code
## Car Material

Just as we used different images on different faces of a box something similar is available for extruded polygons and cylinders.

For the car body we use this image

![car](/img/getstarted/car.png)

and this one for the wheels

![wheel](/img/getstarted/wheel.png)

For both the extruded polygon and the cylinder face 0, is the bottom, face 2 the top and face 1 the edge joining the bottom and top. Remember that currently the car body and its wheels are built lying down

The top and bottom of the car body use the image in the top left (almost) quarter. The edge part goes across the bottom, round the front, across the top and down the back of the body uses the lower half of the image.

The bottom of the car body is as you would expect and is given by the bottom left co-ordinates (0, 0.5) to the top right ones (0.38, 1);

```javascript
faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
```

The top of the car body uses the same image but it needs flipping over to fit the other side of the car.
```javascript
faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);
```

The edge runs from (0, 0) to (1, 0.5)
```javascript
faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
```

https://www.babylonjs-playground.com/#KDPAQ9#12

A wheel is more straight forward because of its symmetry and it uses the whole image for the top and bottom and just picks up a black pixel for the edges.

```javascript
wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);
```
Putting these together and rotating the finished car upright gives

![car model](/img/getstarted/carmodel.png)

https://www.babylonjs-playground.com/#KDPAQ9#13

At last we are ready to think about animating the wheels.