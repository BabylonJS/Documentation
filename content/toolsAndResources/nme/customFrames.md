---
title: Node Material Editor Custom Frames
image-url: /img/defaultImage.png
description: Learn all about how to create custom frames in the super handy Node Material Editor.
keywords: shaders, glsl, node editor, graphics, GPU program, material, NME, Node Material, Node Material Editor
further-reading:
video-overview:
video-content:
---

## Custom Frames

<Youtube id="_bxAQM0pnzs"/>

<Youtube id="9wL777qGpiI"/>

![NME](/img/how_to/Materials/custom_frames_1.jpg)

When using the node material editor we can create frames by holding shift and dragging the mouse across nodes within the graph.

A frame is an easy way to group several nodes together and collapse them into a smaller group to declutter the graph and allow you to reuse certain node branches. We can rename the frame, change its color, and even make a note/comment about it.

When we collapse the node, input and output ports that are linked to other nodes outside of the frame, will be exposed on the frame edges. (You can manually set a port to be exposed as well). Here we can edit the exposed ports by renaming them or even changing the order.

![NME](/img/how_to/Materials/custom_frames_2.jpg)

We can export a frame by using the “Export” button.

Once exported, we can load it back into our project for future use by clicking the “+” symbol on the “Custom Frames” tab of the node menu, in the left panel. 

![NME](/img/how_to/Materials/custom_frames_3.jpg)

By loading a custom frame, we can reuse it quickly just like any other node block. Custom frames will stay in this menu any time you open the node material editor. 

![NME](/img/how_to/Materials/custom_frames_4.jpg)

We also have a library of custom frames available for you to leverage here: https://github.com/BabylonJS/Assets/tree/master/nme/customFrames

### Tile and Offset

This custom frame is primarily used to tile and/or offset `UV`s, but you can use it to modify any `Vector2`.

Example setup (you have to set your texture to generate some visible output):

![Tile and Offset](/img/resources/nme-custom-frames/tile-offset-setup.png)

Some example values and the results are provided in the following table:

 tileX | tileY | offsetX | offsetY | result                                                                       
 ----- | ----- | ------- | ------- | ---------------------------------------------------------------------------- 
 1     | 1     | 0       | 0       | ![Tile and Offset](/img/resources/nme-custom-frames/tile-offset-1-1-0-0.jpg)  
 2     | 4     | 0       | 0       | ![Tile and Offset](/img/resources/nme-custom-frames/tile-offset-2-4-0-0.jpg)  
 3     | 1     | 0       | 0       | ![Tile and Offset](/img/resources/nme-custom-frames/tile-offset-3-1-0-0.jpg)  
 1     | 1     | 0       | 0.5     | ![Tile and Offset](/img/resources/nme-custom-frames/tile-offset-1-1-0-05.jpg) 

### UV Twirl

You can use this custom frame to twirl the UV's and create twirled textures.

Connect the custom frame:

![UV Twirl](/img/resources/nme-custom-frames/uv-twirl-setup.png)

The output is the original texture:

![UV Twirl](/img/resources/nme-custom-frames/uv-twirl-start.png)

By changing the `strength` value the image gets twirled around the `center`:

![UV Twirl](/img/resources/nme-custom-frames/uv-twirl-twirled.png)

### Screen Position

A normalized screen position from 0,0 (bottom left) to 1,1 (top, right)

![Screen Position](/img/resources/nme-custom-frames/screen-position-setup.png)

produces this output:

![Screen Position](/img/resources/nme-custom-frames/screen-position-output.png)
