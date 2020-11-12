---
title: Transform Node
image: 
description: Learn about the transform node in Babylon.js.
keywords: welcome, babylon.js, diving deeper, meshes, mesh transformation, transformation, parent, pivot, transform node
further-reading:
    - title: How To Rotate Around an Axis about a Point
      url: /divingDeeper/mesh/creation/param/divingDeeper/mesh/transforms/parent_pivot/pivot
video-overview:
video-content:
---

## A TransformNode

A TransformNode is an object that is not rendered but can be used as a center of transformation. This can decrease memory usage and increase rendering speed compared to using an empty mesh as a parent and is less complicated than using a pivot matrix.

The TransformNode can be used as a center of transformation (CoT) for a mesh and some lights and cameras by acting as a parent to them increasing versitility.

Remember that, as with any parent, transformations are relative to the frame of reference of the parent.
In all of the following Playgrounds the purple sphere is created only to show the TransformNode position. 

## As a Center of Rotation

Set a TransformNode as a parent then rotate the TransformNode.

## Mesh

```javascript
//create a Center of Transformation
var CoT = new BABYLON.TransformNode("root"); 
box.parent = CoT;  //apply to Box
```
<Playground id="#2JKA91" title="Center of Transform At Box Center" description="Simple example of the center of transform at a box center." image=""/>
<Playground id="#2JKA91#1" title="Center of Transform Offset" description="Simple example of a center of transform offset." image=""/>
<Playground id="#2JKA91#2" title="Box Rotating about its Local Axes" description="Simple example of a box rotating about its local axes." image=""/>

### Camera 
The light blue cylinder is an additional stationary object to show that the camera is moving.

For those examples stating a dummy camera a black sphere is used to show the intended path of the camera in the Playground that follows it. The purple ray shows the direction of view of the camera and the tube an indication of the view covered by the camera.

### Arc Rotate Camera
The center of transformation is placed at the target position of the arc rotation camera.  
<Playground id="#PP962K#1" title="Rotating Dummy Camera" description="Simple example of a rotating dummy camera." image=""/>
<Playground id="#2JKA91#4" title="Rotating Arc Camera" description="Simple example of a rotating arc camera." image=""/>

Target position moved by moving center of tranformation.  
<Playground id="#PP962K#2" title="Rotating Dummy Camera" description="Simple example of a rotating dummy camera." image=""/>
<Playground id="#2JKA91#5" title="Rotating Arc Camera" description="Simple example of a rotating arc camera." image=""/>

Camera position moved relative to center of transformation just changes the distance between the camera and target.  
<Playground id="#PP962K#3" title="Rotating Dummy Camera" description="Simple example of a rotating dummy camera." image=""/>
<Playground id="#2JKA91#6" title="Rotating Arc Camera" description="Simple example of a rotating arc camera." image=""/>

### Universal Camera
The arrow keys will allow you to move camera position (reminder to click on canvas area before using keys).  
<Playground id="#2JKA91#8" title="Rotating Universal Camera 1" description="Simple example of a rotating universal camera." image=""/>

You can also have a universal camera rotating in orbit around a target and move it with keys.  
<Playground id="#2JKA91#9" title="Rotating Universal Camera 2" description="Simple example of a rotating universal camera." image=""/>

## Lights
Those lights that have a position can use a TransformNode.

### Point Light
<Playground id="#2JKA91#10" title="Rotating Point Light" description="Simple example of a rotating point light." image=""/>

# Spot Light
<Playground id="#2JKA91#11" title="Rotating Spot Light" description="Simple example of a rotating spot light." image=""/>

## As a Center of Translation or Position

When you move a center of transformation anything that is parented to it will move with it.

When you transform an object with a center of transformation as parent then that transformation takes place relative to the frame of reference of the center of transformation. 

In the example below you can see that the simple movement given by

```javascript
box.position.x += 0.01
``` 
takes place along the rotating x axis of the center of transformation.

<Playground id="#2JKA91#12" title="Box Translation" description="Simple example of a box translation." image=""/>

Moving cameras and lights work in the same way.

## As a Center of Enlargement

Obviously scaling has no effect on lights or cameras. Scaling takes place relative to the frame of reference of the center of enlargement.

<Playground id="#2JKA91#13" title="Box Scaling" description="Simple example of box scaling." image=""/> 