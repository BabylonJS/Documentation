# Cameras

There are a range of cameras to use with Babylon.js, Probably the two most used are the universal and arcRotate cameras. As the use of virtual reality increase so will the use of cameras for this purpose.

## Universal Camera

The Universal Camera is the one to choose for first person shooter type games, and works with all the keyboard, mouse, touch and gamepads. This replaces the earlier Free Camera, which still works and will still be found in many Playgrounds.

As you move around a world using the Universal Camera you will want to know if the camera (you) is in collision with other objects in the scene. All this is possible with Babylon.js and in addition you can have gravity affecting the camera. 

## Arc Rotate Camera

 This camera acts like a satellite in orbit around a target and always points towards the target position. Its radius and longitudinal and latitudinal rotation can be changed to set its position as well as giving a vector position.

## Follow Camera

A follow camera takes a mesh as a target and follows it as it moves. Both a free camera version _followCamera_ and an arc rotate version _arcFollowCamera_ are available.

## Anaglyph Cameras

These extend the use of the Universal and Arc Rotate Cameras for use with red and cyan 3D glasses. 

## Device Orientation Cameras

This is a camera specifically designed to react to device orientation events such as a modern mobile device being tilted forward or back and left or right. 

## Virtual Joysticks Camera

Virtual Joysticks are on-screen 2D graphics that are used to control the camera or other scene items. 

## Virtual Reality Cameras

A new range of cameras for VR devices including the VR device orientation free and arc rotate cameras and the WebVR free camera

## Customizing Inputs

The cameras rely upon user inputs to move the camera. It is possible to customize one of the existing presets, or use your own input mechanisms. 

## Using More Than One Camera

This can be achieved using the multi-view approach which splits the screen into different views, one for each camera. The alternative way is to use layer masks which superimposes the views from the cameras.

# Further Reading

## Basic - L1
[Cameras 101](/babylon101/Cameras)  
[Camera Mesh Collisions 101](/babylon101/Cameras,_Mesh_Collisions_and_Gravity)  
[Camera Behaviours](/How_To/Camera_Behaviors)

## Mid Level - L2
[Customizing Camera Inputs](/How_To/Customizing_Camera_Inputs) 

## More Advanced - L3    
[Multi-Views](/How_To/How_to_use_Multi-Views)  
[Layermasks and Multi-Camera Textures](/How_To/Layermasks_and_Multi-Cam_Textures)  
[Web Virtual Reality Camera](/How_To/WebVR_Camera) 

