# Sprite Map Multi-Plane Example
We are going to build a scene with a far distance, mid distance and near distance sprite map. The far and mid distance levels will be built following the methods examined earlier in the section. The near distance level is loaded from a pre-created sprite map that has been made and saved. A blank tile is added to the front of the frames array.

## Far Distance Level
Large parts of this, background, sprite map will be hidden by those in the mid and near distance. It contains all the animations that will be used by this sprite map and the others.

The steps for this are: create and set the background sprite map; the animations; position in the far distance, z = -5; and assign frameIDs to tiles.

Far distance sprite map https://www.babylonjs-playground.com/#YCY2IL#25

## Mid Distance Level
The steps for this are: create and set the levelBase sprite map and assign frameIDs to tiles, includinh using blank tiles to create a hole through which the far distance level can be seen. The default is mid distance with position with z = 0; In the complete example this line

```javascript
levelBase.animationMap = background.animationMap
```
will be added to copy the animation map to animated the frames in levelBase.

Mid distance sprite map https://www.babylonjs-playground.com/#YCY2IL#23

## Near Distance Level
The near distance map is an example of loading a pre-created and exported sprite map.

The steps for this are: create and set the levelStage sprite map with a structure matching the one to be imported; load the *.tilemap* file; and position in the near distance, z = 5.

Near distance sprite map https://www.babylonjs-playground.com/#YCY2IL#24

## Complete Example
The three distance levels are now combined into one, the camera is changed to a universal one and positioned so that the levels fill the screen. The copy of the background animation map is copied over to the levelBase sprite map.

Complete example https://www.babylonjs-playground.com/#YCY2IL#27
