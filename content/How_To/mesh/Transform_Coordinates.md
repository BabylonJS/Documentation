# How To Use Coordinate Transformation

This method for these examples can be directly compared to [the use of a parent](/How_To/Parenting) 

## Satellite

Take a box that is rotating and translating from the top of which emerges a smaller box and travels in a direction always perpendicular to the top face of the box. 

In the local coordinate system of the box the up direction is (0, 1, 0) and so locally the position of anything travelling in that direction will be (0, y, 0).

Knowing the world matrix of the box, for any frame, it can then be applied to the vector (0, y, 0) position of the smaller box to determine the world position of the smaller box for that frame.

Obtaining the world matrix for the box inside a _registerAfterRender_ loop means that the world matrix will already have been obtained for the box and you can get it directly.

To match the orientation of the smaller box to the box whatever rotation has been applied to the box has to be re-applied to the smaller box. The easiest way to do this is to re-use the _rotate_methods applied to the box to the small box.

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

* [Playground Animation - TransformCoordinates](https://www.babylonjs-playground.com/#TRAIXW#2)

## Disc World

Imagine a disc flying around space with building on it. In fact the following example uses a thin cylinder as the disc since the top circular face is horizontal whilst the face of a disc in Babylon.js is vertical. (OK it does make any real difference but it more natural to start with a horizontal ground).

The building will be an array of boxes. Leaving the boxes as separate meshes would mean applying the _TransformCoordinates_ function to each of them, so instead they will be merged into one mesh. As in the example above the rotation of the disc and the boxes are matched and the coordinate position of the boxes transformed.

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
* [Playground Animation - Disc World](https://www.babylonjs-playground.com/#TRAIXW#5)

# Further Reading

[How To Use a Parent](/How_To/Parenting)  
[Frame of Reference](/resources/Frame_Of_Reference)
