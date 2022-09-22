---
title: Getting Started - Chapter 7 - Light the Night
image:
description: Learn the how to add spotlights to your scene.
keywords: getting started, start, chapter 7, lighting, lights, spotlight
further-reading:
video-overview:
video-content:
---

# Getting Started - Working With Code

## Street Lights

So far we have just used the hemispheric light for all the scenes. There are a range of lights but for the moment the only new one we will introduce is the spot light. This can be positioned anywhere and given a direction in which to shine. The spread of the light is given by an angle in radians, the larger the angle the wider the spread. The final parameter indicates how fast the light will fall away, the larger the number the less distance the light will shine. The spot light can be given a color.

```javascript
const lampLight = new BABYLON.SpotLight("name", position, direction, angle_of_spread, speed_of_disipation);
lampLight.diffuse = BABYLON.Color3.Yellow();
```

We will add a spot light to a street lamp. In order to create a lamp post we introduce another way of creating a mesh by extruding a shape along a path.

We create the shape outline to extrude with a sequence of vector3s using points in the x, y plane only.

```javascript
const lampShape = [];
for (let i = 0; i < 20; i++) {
  lampShape.push(new BABYLON.Vector3(Math.cos((i * Math.PI) / 10), Math.sin((i * Math.PI) / 10), 0));
}
lampShape.push(lampShape[0]); //close shape
```

We then set a path for the extrusion, again using vector3s. The path does not have to be restricted to the x, y plane it can be described using the full 3D space.

```javascript
const lampPath = [];
lampPath.push(new BABYLON.Vector3(0, 0, 0));
lampPath.push(new BABYLON.Vector3(0, 10, 0));
for (let i = 0; i < 20; i++) {
  lampPath.push(new BABYLON.Vector3(1 + Math.cos(Math.PI - (i * Math.PI) / 40), 10 + Math.sin(Math.PI - (i * Math.PI) / 40), 0));
}
lampPath.push(new BABYLON.Vector3(3, 11, 0));
```

We then form the extrusion.

```javascript
const lamp = BABYLON.MeshBuilder.ExtrudeShape("lamp", { cap: BABYLON.Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5 });
```

To make the lamp light more visible we turn down the intensity of the hemispheric light,

```javascript
light.intensity = 0.5;
```

<Playground id="#4G38H4#6" title="Create a Street Light" description="Create a basic streetlight shape and attach a spotlight." image="/img/playgroundsAndNMEs/gettingStartedStreetLights1.jpg"/>

We export the lamp, of appropriate size, to use it in the village. As we need more than one street light, once the lamp is loaded we will clone it several times. For each street light we will add the lamp light. Lights are normally restricted to four in any scene. Any more and only the last 4 created are active. To extend the number of lights used we set the number needed on any material to be lit.

```javascript
material.maxSimultaneousLights = 5;
```

<Playground id="#KBS9I5#94" title="Add Street Lights" description="Add street lights to the village and adjust the lighting." image="/img/playgroundsAndNMEs/gettingStartedStreetLights2.jpg"/>

It would be good if we could slide daylight into nightlight and vice-versa. We can when we add the Babylon.js GUI.
