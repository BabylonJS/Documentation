---
title: ACE - The Animation Curve Editor
image: 
description: Learn all about the powerful Animation Curve Editor.
keywords: babylon.js, tools, resources, animation, editor, curve, curve editor, animation editor
further-reading:
video-overview: 
video-content:
---

<img src="/img/tools/ACE/overview.jpg" title="Babylon.js Animation Curve Editor"/>

## Easily Create Animations

Introduced in Babylon.js 5.0, the Animation Curve Editor (ACE for short) is a powerful tool that allows you to create and modify animations in a simple, fun, and intuitive editor.

This document will walk you through the editor and all of its capabilities. If you're not already familiar with the Animation system in Babylon.js, you might want to brush up on it here: [Babylon Animation Documentation](/features/featuresDeepDive/animation)

To start, check out this awesome video overview of ACE.

<Youtube id="IRP5PVMxth0"/>

## How to access ACE

You can access ACE in 2 different ways:

The first method is to select an existing object in the inspector, find the 'Animations' portion of the properties window, and select the 'Edit' button.

<img src="/img/tools/ACE/object.jpg" title="Loading animation from an object."/>

The second method can happen if an animation exists in the scene separate from an object. This most often happens when loading an asset into the scene that has attached animations to it, such as in this playground:

<Playground id="#C21DGD#2" title="Loaded Animation Example" description="Simple example of animations loaded into a scene from a .glb file."/>

In this method you select an individual animation in the Inspector and then hit the 'Edit' Button in the properties window for that animation.

<img src="/img/tools/ACE/animation.jpg" title="Loading animation from an existing animation."/>

## Getting Familiar With The Layout

Let's start by familiarizing ourselves with different parts of ACE.

### Menu

<img src="/img/tools/ACE/menu.jpg" title="ACE Menu"/>

The Menu offers you the ability to create a new animation, load an animation from the snipper server or from a local file, save animation locally or to the snippet server, edit an animation, and change the playback framerate of an animation.

#### Creating a new animation

<img src="/img/tools/ACE/create.jpg" title="Create Button"/>

Pressing the create tab will display a menu that allows you to create a new animation. 

<img src="/img/tools/ACE/createMenu.jpg" title="Create Menu"/>

- Display Name: You can enter a name for your new animation.
- Mode: This allows you to choose between a `List` of animatable properties OR specify a `Custom` attribute.
- Property: The list of available animatable properties if Mode is set to `List`, or a text field if Mode is set to `Custom`.
- Type: The type of underlying Babylon Property that will be animated.
- Loop Mode: The desired loop mode for the new animation, `Cylce`, `Relative`, or `Constant`.

#### Loading An Animation

<img src="/img/tools/ACE/load.jpg" title="Load Button"/>

Pressing the load tab will display a menu that allows you to load an animation from the Babylon.js snippet server or from a local file.

<img src="/img/tools/ACE/loadMenu.jpg" title="Load Menu"/>

#### Saving An Animation

<img src="/img/tools/ACE/save.jpg" title="Save Button"/>

Pressing the save tab will display a menu that allows you to save an animation to the Babylon.js snippet server or to a local file.

After saving to the snippet server, the assigned Snippet ID for your animation will be listed at the bottom of this menu.

<img src="/img/tools/ACE/saveMenu.jpg" title="Save Menu"/>

Also see [Using Saved Animations in the Playground](#using-saved-animations-in-the-playground)

#### Editing An Animation

<img src="/img/tools/ACE/edit.jpg" title="Edit Button"/>

Pressing the edit tab will display a list of all properties with animations applied to them. Note that if you have entered ACE by selecting the edit button of Babylon Object (Method 1 listed above), then this menu will display ALL properties of the selected object that have animations attached to them.

<img src="/img/tools/ACE/editMenu.jpg" title="Edit Menu"/>

#### Changing the Playback Framerate

<img src="/img/tools/ACE/fps.jpg" title="FPS Field"/>

The fps (frames per second) field allows you to specify the playback rate of the animations.

### Key Controls

<img src="/img/tools/ACE/keyControls.jpg" title="ACE Key Controls"/>

The Key Controls offer the ability to change the frame of a key, the value of a key, set a new key(s), reframe the keys, flatten the key's tangents, create linear tangents for a key, break a key's tangents, unify a key's tangents, and create a step tangent for a key.

#### Changing the Frame of a Key

<img src="/img/tools/ACE/keyFrame.jpg" title="Key Frame Field"/>

With a single key selected, this input box allows you to enter a new frame number for the selected key to occupy.

#### Changing the Value of a Key

<img src="/img/tools/ACE/keyValue.jpg" title="Key Value Field"/>

With a single key selected, this input box allows you to enter a new value for the selected key.

#### Create a New Key

<img src="/img/tools/ACE/newKey.jpg" title="New Key"/>

This button creates a new key at the location of the play head. If the animations being edited are connected to an object (entered ACE through method 1 above), the new key button will grab the existing value for that property from the object in the scene. For example, if you have loaded a sphere and are editing the Position Vector3 property of that object, when selecting the new key button, the x, y, and z values for the newly created keys will come from the sphere's current position in the connected Babylon scene. Otherwise if there is no connected object to the current animation, the value of the newly created key(s) will be zero.

#### Framing the Canvas

<img src="/img/tools/ACE/frameCanvas.jpg" title="Frame Cavnas"/>

The Frame Canvas button will resize the canvas to neatly fit all keys in the animation into the canvas size. This makes it much easier to see the animation in its entirety.

#### Flattening a Key's Tangents

<img src="/img/tools/ACE/flattenTangents.jpg" title="Flatten Tangents"/>

With a key(s) selected, the flatten tangents button will flatten the tangents coming into and going out of the key.

#### Creating Linear Key Tangents

<img src="/img/tools/ACE/linearTangents.jpg" title="Linear Tangents"/>

With a key(s) selected, the linear tangents button will create linear tangents coming into and going out of the key.

#### Breaking a Key's Tangents

<img src="/img/tools/ACE/brokenTangents.jpg" title="Broken Tangents"/>

With a key(s) selected, the break tangents button will separate the incoming and outgoing tangents of a key so they can be individually manipulated.

#### Unifying a Key's Tangents

<img src="/img/tools/ACE/unifyTangents.jpg" title="Unified Tangents"/>

With a key(s) selected, the unify tangents button will unite the incoming and outgoing tangents of a key so they can be manipulated together.

#### Stepping a Key's Tangents

<img src="/img/tools/ACE/stepTangents.jpg" title="Step Tangents"/>

With a key(s) selected, the step tangents button will create a flat incoming and outgoing tangent relative to the previous and following key. This is useful when blocking out positions or poses common in the animation process. You can think of stepped tangents as a series of static positions with no computer interpolation between them.

### Canvas

<img src="/img/tools/ACE/canvas.jpg" title="ACE Canvas"/>

The Canvas is the main `play` area in ACE. This is where you manipulate curves and keys to create the perfect animations.

Let's go over some handy things to know about how to work in the Canvas.

#### Working with Keys

The Canvas will display all curves for any property that is selected in the Edit Menu. In other words, selecting specific properties in the Edit Menu will isolate the canvas to showing only those selected properties.

You can select a key by either left clicking on a key or by clicking and dragging over a key.

You can also select multiple keys at one time by clicking and dragging across as many keys as you like.

All keys can be selected by using CTRL + A.

Once a key is selected, you can manipulate the tangent handles of the key by left clicking on one of the handles.

If you hold down the SHIFT key and left click on a key and drag your mouse vertically up and down, the key will be locked from moving horizontally. This allows you to easily change the value of a key without changing the frame the key occupies.

Similarly, if you hold down the SHIFT key and left click on a key and drag your mouse horizontally left and right, the key will be locked from moving vertically. This allows you to easily change the frame number that a key occupies without changing the value of the key.

#### Navigation

Holding down the ALT key and left clicking and dragging on the canvas will pan the canvas around. A middle mouse button can also be used to accomplish the same thing.

You can use the scroll wheel on your mouse to zoom in and out.

The Play Head hovers above the active frame number of the animation. New keys will be inserted in the animation curve at the location of the Play Head. The Play Head can be changed in a number of different ways, by left clicking and dragging it left or right, by manually typing a number in the playhead box, or by using the Play Controls.

### Play Controls

<img src="/img/tools/ACE/playControls.jpg" title="ACE Play Controls"/>

The play controls offer easy options to navigate through the timeline.

#### First and Last Frames

<img src="/img/tools/ACE/firstLast.jpg" title="First Last Frames"/>

The first and last frame buttons will move the Play Head to the first and last frames respectively.

#### Previous and Next Frames

<img src="/img/tools/ACE/previousNext.jpg" title="Previous Next Frames"/>

The previous and next frame buttons will move the Play Head to the previous or next frame respectively. You can also use the `left` and `right` arrow keys to advance forward or back one frame as well.

#### Previous and Next Keys

<img src="/img/tools/ACE/prevKeyNextKey.jpg" title="Previous Next Key"/>

The previous and next Key buttons will move the Play Head to the previous or next key respectively. You can also use the `up` and `down` arrow keys to advance forward or back one key as well.

#### Playing an Animation

<img src="/img/tools/ACE/playButtons.jpg" title="Play Buttons"/>

The play forward and backwards buttons will play the animation forward or backward respectively, at the specified framerate (fps) in the Edit Menu. The play buttons will play from the starting frame of the play range to the ending frame of the play range. You can also use the `spacebar` key to play the animation in the forward direction. There is no hotkey to play the animation in the reverse direction, because we are not animals.

### Play Range

<img src="/img/tools/ACE/playRange.jpg" title="ACE Play Range"/>

The Play Range represents the starting and ending frames when you use one of the play buttons. These buttons allow you to play a subset of an entire animation.

## Using Saved Animations in the Playground

It is very easy to load your saved GUIs into your Babylon.js Scene and modify them. Here are a few handy examples:

### Load From The Snippet Server
You can load an animation into your Babylon scene from the snippet server like this:

```javascript
let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
let animations = await BABYLON.Animation.CreateFromSnippetAsync('YOUR SNIPPET ID');
sphere.animations = animations;
scene.beginAnimation(sphere, 0, 100, true);
```

<Playground id="#YAWBMY" title="Loaded Animation From Snippet" description="Simple example of loading an animation from the snippet server."/>

### Load From .JSON Object
You can load an Animation into your Babylon scene from a saved .JSON object like this:

```javascript
let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
let animations = await BABYLON.Animation.ParseFromFileAsync(null, "https://doc.babylonjs.com/examples/animations.json");
sphere.animations = animations;
scene.beginAnimation(sphere, 0, 100, true);
```

<Playground id="#YAWBMY#7" title="Loaded Animation From .JSON" description="Simple example of loading an animation from a saved .JSON object."/>

### The Magic Loop
As with all Babylon tools, if you've loaded an animation from the snippet server into your scene and then use the GUI Editor to edit that animation. Once you save a new version of that animation, the tool will automatically change the snippet server load line to use your newly created Snippet ID! If you haven't tried this out, you need to, it's awesome!

## Creating Animations With ACE

Now that you've learned all about ACE, let's take a quick minute to go over the most common flow of how to use this awesome tool to create animations for an object in your Babylon.js scene.

Let's start with the basic [playground.](https://playground.babylonjs.com/)

- Step 1 - Open the Inspector
- Step 2 - Select an object in the Inspector that you'd like to animate. Let's use the sphere for this example.
- Step 3 - Scroll down in the properties window of the Inspector until you find the Animation group. Click the `Edit` button.
- Step 4 - With ACE loaded, press the `Add New Animation` button.
- Step 5 - Fill out the Display Name and choose what property you'd like to animate. Set the loop mode to your preference.
- Step 6 - Make an animation.
- Step 7 - Save your animation to the Snippet Server.
- Step 8 - Copy your snippet ID number.
- Step 9 - Go back to the playground and write the code to [load your snippet-saved animation](#load-from-the-snippet-server) when the scene starts.
- Step 10 - Select the sphere from the Inspector, open your animation in ACE, edit or change your animation, save to the snippet server. The line of code that loads the animation is automatically updated for you!

So there you have it, the 10 quick steps for the common way to animate an object in Babylon.js using ACE. One final important note: the Animation system in Babylon.js is very advanced. An animation can exist attached to an object, attached to an animation group, or just exist by itself. If you want to create a new animation using ACE, you have to create an animation that is attached to an object. In other words, you cannot create a standalone animation, or an animation attached to an animation group through ACE.
