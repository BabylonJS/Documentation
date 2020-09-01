# Getting Started - Working With Code
## Building the Car
The car is going to be a very simple one. The body will be built using the *extrudePolygon* method. This is another shape that can be built using *MeshBuilder*. The outline of the shape is drawn in the XZ plane, with points in counter-clockwise order and the extrusion is in the Y direction. The origin for the polygon is the zero point on the bottom plane.

The outline for the car consists of an array of vector3 points forming a horizontal base line, a quarter circle for the front, followed by a horizontal base line. The vertical back with be formed by the *extrudePolygon* method as it automatically joins the first and last point.

```javascript
//base
const outline = [
    new BABYLON.Vector3(-0.3, 0, -0.1),
    new BABYLON.Vector3(0.2, 0, -0.1),
]

//curved front
for (let i = 0; i < 20; i++) {
    outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
}

//top
outline.push(new BABYLON.Vector3(0, 0, 0.1));
outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));
```

These and the depth to extrude along Y, give the shape for the car
```javascript
const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {shape: outline, depth: 0.2});
```

PG MARKER bab.chap3.anim.1

We form the wheel for the right back position from a cylinder and add it as a child to the car. When we copy this wheel its parent is made the parent of the copy. Then make copies for the right front, left back and left front wheels. This time using *clone* rather than *createInstance* since we can clone a clone.

```javascript
const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05})
wheelRB.parent = car;
wheelRB.position.z = -0.1;
wheelRB.position.x = -0.2;
wheelRB.position.y = 0.035;

wheelRF = wheelRB.clone("wheelRF");
wheelRF.position.x = 0.1;

wheelLB = wheelRB.clone("wheelLB");
wheelLB.position.y = -0.2 - 0.035;

wheelLF = wheelRF.clone("wheelLF");
wheelLF.position.y = -0.2 - 0.035;
```

PG MARKER bab.chap3.anim.2

Now we will make the car look a bit more like a car using some textures.

LINK TO MESH SHAPES?