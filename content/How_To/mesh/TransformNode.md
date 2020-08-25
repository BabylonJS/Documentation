# A TransformNode

A TransformNode is an object that is not rendered but can be used as a center of transformation. This can decrease memory usage and increase rendering speed compared to using an empty mesh as a parent and is less complicated than using a pivot matrix.

The TransformNode can be used as a center of transformation (CoT) for a mesh and some lights and cameras by acting as a parent to them increasing versitility.

Remember that, as with any parent, transformations are relative to the frame of reference of the parent.
In all of the following Playgrounds the purple sphere is created only to show the TransformNode position. 

# As a Center of Rotation

Set a TransformNode as a parent then rotate the TransformNode.

## Mesh

```javascript
//create a Center of Transformation
var CoT = new BABYLON.TransformNode("root"); 
box.parent = CoT;  //apply to Box
```
* [Playground Example - CoT at Box Center](https://www.babylonjs-playground.com/#2JKA91)
* [Playground Example - CoT Offset](https://www.babylonjs-playground.com/#2JKA91#1)
* [Playground Example - Box Rotating about its Local Axes](https://www.babylonjs-playground.com/#2JKA91#2)

### Camera 
The light blue cylinder is an additional stationary object to show that the camera is moving.

For those examples stating a dummy camera a black sphere is used to show the intended path of the camera in the Playground that follows it. The purple ray shows the direction of view of the camera and the tube an indication of the view covered by the camera.

### Arc Rotate Camera
The center of transformation is placed at the target position of the arc rotation camera.  
* [Playground Example - Rotating Dummy Camera](https://www.babylonjs-playground.com/#PP962K#1)
* [Playground Example - Rotating Arc Camera](https://www.babylonjs-playground.com/#2JKA91#4)

Target position moved by moving center of tranformation.  
* [Playground Example - Rotating Dummy Camera](https://www.babylonjs-playground.com/#PP962K#2)
* [Playground Example - Rotating Arc Camera](https://www.babylonjs-playground.com/#2JKA91#5)

Camera position moved relative to center of transformation just changes the distance between the camera and target.  
* [Playground Example - Rotating Dummy Camera](https://www.babylonjs-playground.com/#PP962K#3)
* [Playground Example - Rotating Arc Camera](https://www.babylonjs-playground.com/#2JKA91#6)

### Universal Camera
The arrow keys will allow you to move camera position (reminder to click on canvas area before using keys).  
* [Playground Example - Rotating Universal Camera](https://www.babylonjs-playground.com/#2JKA91#8)

You can also have a universal camera rotating in orbit around a target and move it with keys.  
* [Playground Example - Rotating Universal Camera](https://www.babylonjs-playground.com/#2JKA91#9)

## Lights
Those lights that have a position can use a TransformNode.

### Point Light
* [Playground Example - Rotating Point Light](https://www.babylonjs-playground.com/#2JKA91#10)

## Spot Light
* [Playground Example - Rotating Spot Light](https://www.babylonjs-playground.com/#2JKA91#11)

# As a Center of Translation or Position

When you move a center of transformation anything that is parented to it will move with it.

When you transform an object with a center of transformation as parent then that transformation takes place relative to the frame of reference of the center of transformation. 

In the example below you can see that the simple movement given by

```javascript
box.position.x += 0.01
``` 
takes place along the rotating x axis of the center of transformation.

* [Playground Example - Box Translation](https://www.babylonjs-playground.com/#2JKA91#12)

Moving cameras and lights work in the same way.

# As a Center of Enlargement

Obviously scaling has no effect on lights or cameras. Scaling takes place relative to the frame of reference of the center of enlargement.

* [Playground Example = Box Scaling](https://www.babylonjs-playground.com/#2JKA91#13)

# Further Reading

## More Advanced - L3

[How To Rotate Around an Axis about a Point](/How_To/Pivot)


