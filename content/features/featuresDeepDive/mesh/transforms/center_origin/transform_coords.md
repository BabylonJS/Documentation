---
title: Coordinate Transformation Examples
image: 
description: Check out coordinate transformation examples in Babylon.js.
keywords: diving deeper, meshes, mesh transformation, transformation, coordinate transform
further-reading:
video-overview:
video-content:
---

## Examples of Coordinate Transformation

## Satellite

Take a box that is rotating and translating, from whose top a smaller box emerges and travels in a direction that is always perpendicular to the top face of the box. 

In the local coordinate system of the box the up direction is (0, 1, 0) and so locally the position of anything travelling in that direction will be (0, y, 0).

Knowing the world matrix of the box for any frame, you can apply it to the smaller box's local position vector (0, y, 0) to determine the smaller box's world position for that frame.

Obtaining the world matrix for the box inside a _registerAfterRender_ loop means that the world matrix has already been computed for the box, so you can get it directly.

To match the orientation of the smaller box to the larger box, whatever rotation has been applied to the box must also be applied to the smaller box. The easiest way to do this is to reuse the same rotation methods applied to the box for the smaller box.

The following code gives the animation.

```javascript
    scene.registerAfterRender(function () {
        box.rotate(BABYLON.Axis.Y, Math.PI / 150, BABYLON.Space.LOCAL);
        box.rotate(BABYLON.Axis.X, Math.PI / 200, BABYLON.Space.LOCAL);
        box.translate(new BABYLON.Vector3(-1, -1, -1).normalize(), 0.001, BABYLON.Space.WORLD)
        small.rotationQuaternion = box.rotationQuaternion;
        matrix = box.getWorldMatrix();
        y += 0.001;
        local_pos = new BABYLON.Vector3(0, y, 0);
        small.position = BABYLON.Vector3.TransformCoordinates(local_pos, matrix);

    })
```

Small box travels from Large Box: <Playground id="#TRAIXW#2" title="Small Box Travels From Large Box" description="Simple example of a small box traveling from a large box."/>

## Disc World

Imagine a disc flying through space with buildings on it. In fact, the following example uses a thin cylinder as the disc, since the top circular face is horizontal, whereas the face of a disc in Babylon.js is vertical. (OK, it does not make any real difference, but it is more natural to start with a horizontal ground.)

The building will be an array of boxes. Leaving the boxes as separate meshes would mean applying the _TransformCoordinates_ function to each of them, so instead they will be merged into one mesh. As in the example above, the rotations of the disc and the boxes are matched, and the position of the boxes is transformed.

```javascript
    var phi = 0;
    scene.registerAfterRender(function () {
        matrix = disc.getWorldMatrix();
        disc.rotate(BABYLON.Axis.Y, Math.PI / 150, BABYLON.Space.LOCAL);
        disc.rotate(BABYLON.Axis.Z, Math.PI / 200, BABYLON.Space.LOCAL);
        disc.position = new BABYLON.Vector3(15 * Math.cos(phi), 16 * Math.sin(phi), 5)
        boxes.rotationQuaternion = disc.rotationQuaternion;
        boxes.position = BABYLON.Vector3.TransformCoordinates(boxes_position, matrix);
        phi +=0.01;

    });
```
Disc World: <Playground id="#TRAIXW#5" title="Disc World" description="Simple example of a disc world with coordinate transformation."/>

One final step before considering parents and pivots as a way of changing the center of transformation of a mesh is the more drastic step of changing the vertex data describing the mesh itself by baking a transformation into the mesh.
