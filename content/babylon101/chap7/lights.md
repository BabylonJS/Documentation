# Getting Started - Working With Code
## Street Lights
So far we have just used the hemispheric light for all the scenes. There are a range of lights but for the moment the only new one we will introduce is the spot light. This can be positioned anywhere and given a direction in which to shine. The spread of the light is given by an angle in radians, the larger the angle the wider the spread. The final parameter indicates how fast the light will fall away, the larger the number the less distance the light will shine. The spot light can be given a color.

```javascript
const lampLight = new BABYLON.SpotLight("name", position, direction, angle of spread, speed of disipation);
lampLight.diffuse = BABYLON.Color3.Yellow();
```
We will add a spot light to a street lamp. In order to create a lamp post we introduce another way of creating a mesh by extruding a shape along a path.

We create the shape outline to extrude with a sequence of vector3s using points in the x, y plane only.
```javascript
const lampShape = [];
    for(let i = 0; i < 20; i++) {
        lampShape.push(new BABYLON.Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
    }
lampShape.push(lampShape[0]); //close shape
```

We then set a path for the extrusion, again using vector3s. The path does not have to be restricted to the x, y plane it can be described using the full 3D space.
```javascript
const lampPath = [];
lampPath.push(new BABYLON.Vector3(0, 0, 0));
lampPath.push(new BABYLON.Vector3(0, 10, 0));
for(let i = 0; i < 20; i++) {
    lampPath.push(new BABYLON.Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0));
}
lampPath.push(new BABYLON.Vector3(3, 11, 0));
```

We then form the extrusion.
```javascript
const lamp = BABYLON.MeshBuilder.ExtrudeShape("lamp", {cap: BABYLON.Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5});   
```


https://www.babylonjs-playground.com/#4G38H4#1

We export the lamp, of appropriate size, to use it in the village.

PG MARKER bab.chap7.1b