# Getting Started - Working With Code
## Mesh Types
Adding a roof would make our box more house like. We need a prism like shape. Luckily we can do that using *CreateCylinder*. Well the name might imply a cylinder rather than a prism however in using it you need to state how may points around the circumference of the cylinder and for a prism we can use three points.

```javascript
const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 1.3, height: 1.2, tessellation: 3});
roof.scaling.x = 0.75;
roof.rotation.z = Math.PI / 2;
roof.position.y = 1.22;
```

Since the cylinder is created vertically we needed to rotate it to a horizontal position and scale it down in one direction so that the height of the roof is less than its width.

https://www.babylonjs-playground.com/#KBS9I5#4

![house 1](/img/campus/house1.png)

The world will be improved with a little color and texture.

[Prev](/babylon101/placement) How to set the position, orientation and size of a mesh.  
[Next](/babylon101/material) Adding Color and Texture.

[Mesh Chapter](/how_to/set_shapes) Set Mesh Types