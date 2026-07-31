---
title: Sprite Map Example
image: 
description: Check out an in depth sprite map example in Babylon.js.
keywords: babylon.js, diving deeper, sprites, example
further-reading:
video-overview:
video-content:
---

## Sprite Map Multi-Plane Example
We are going to build a scene with far-distance, mid-distance, and near-distance sprite maps. The far- and mid-distance levels will be built by following the methods examined earlier in the section. The near-distance level is loaded from a pre-created sprite map that has already been made and saved. A blank tile is added to the front of the frames array.

## Far Distance Level
Large parts of this background sprite map will be hidden by those in the mid and near distance. It contains all the animations that will be used by this sprite map and the others.

The steps for this are: create and set the background sprite map; the animations; position in the far distance, z = -5; and assign frameIDs to tiles.

Far distance sprite map <Playground id="#YCY2IL#25" title="Far Distance Sprite Map" description="Simple example of a far distance sprite map."/>

## Mid Distance Level
The steps for this are: create and set the levelBase sprite map and assign frameIDs to tiles, including using blank tiles to create a hole through which the far-distance level can be seen. The default is the mid-distance position, with z = 0. In the complete example, this line

```javascript
levelBase.animationMap = background.animationMap
```
will be added to copy the animation map to animate the frames in levelBase.

Mid distance sprite map: <Playground id="#YCY2IL#23" title="Mid Distance Sprite map" description="Simple example of a mid distance sprite map."/>

## Near Distance Level
The near distance map is an example of loading a pre-created and exported sprite map.

The steps for this are: create and set the levelStage sprite map with a structure matching the one to be imported; load the *.tilemap* file; and position in the near distance, z = 5.

Near distance sprite map: <Playground id="#YCY2IL#28" title="Near Distance Sprite Map" description="Simple example of a near distance sprite map." image="/img/playgroundsAndNMEs/pg-YCY2IL-28.webp"/>

## Complete Example
The three distance levels are now combined into one scene. The camera is changed to a universal one and positioned so that the levels fill the screen. The background animation map is also copied over to the levelBase sprite map.

Complete example: <Playground id="#YCY2IL#29" title="Complete Sprite Map Example" description="Complete example of a sprite map."/>
