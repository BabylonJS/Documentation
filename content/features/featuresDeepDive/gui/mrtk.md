---
title: MRTK 2.X For Babylon.js
image:
description: Learn about the various features and controls shared with MRTK
keywords: diving deeper, GUI, 3D GUI, 3D, MRTK
further-reading:
  - title: How To Use Babylon GUI
    url: /features/featuresDeepDive/gui/gui
  - title: How To Use Babylon 3D GUI
    url: /features/featuresDeepDive/gui/gui3D
  - title: How To Use Babylon Gizmos
    url: /features/featuresDeepDive/mesh/gizmo
  - title: How To Use Babylon Behaviors
    url: /features/featuresDeepDive/behaviors/meshBehaviors
  - title: How To Use Babylon XR Features
    url: /features/featuresDeepDive/webXR/WebXRSelectedFeatures
  - title: How To Use Babylon AR Features
    url: /features/featuresDeepDive/webXR/webXRARFeatures
video-overview:
video-content:
---

## What is MRTK for Babylon.js

MRTK stands for the Mixed Reality Toolkit, a set of features, controls, and components designed to ease and accelerate development for VR and AR applications.

There currently only exists documentation for MRTK's [Unity](https://docs.microsoft.com/en-us/windows/mixed-reality/mrtk-unity/) and [Unreal](https://docs.microsoft.com/en-us/windows/mixed-reality/develop/unreal/unreal-mrtk-introduction) implementations, and so when we talk about matching what MRTK offers, we are comparing to what these offer.

This page will go over each of the MRTK-relevant controls and features present in BabylonJS, showing how each can be used. Many of the controls can also be viewed on the [3D GUI page here](/features/featuresDeepDive/gui/gui3D), and if a section has a relevant page, that will also be linked.

## GUI Controls

The following BabylonJS controls have roots as MRTK features. As they extend the `Control3D` class, they all support the basic capabilities that `Control3D` objects have.

More on the `Control3D` class, and GUI elements in general, can be found [here](/features/featuresDeepDive/gui/gui).

The following is an example that showcases several of the controls listed, including `TouchHolographicButtons` , `TouchMeshButtons`, and the `NearMenu`. This scene is designed for use in XR, and supports use of `WebXRNearInteraction`:
<Playground id="#24DLJ4#7" title="Near Interaction Button Scene Demo" description="Demo showcasing different Control3D objects with Near Interaction support."/>

#### Holographic Button

The `HolographicButton` class is the standard, familiar button that can be placed and pressed in a 3D environment. It is based off of the MRTK `ButtonHoloLens1`, and supports a title, image, and tooltip.

#### Touch Holographic Button

The `TouchHolographicButton` is akin to MRTK's `PressableButtonHoloLens2`. It supports everything that the `HolographicButton` supports, but has more depth to it, allowing for visual feedback as it is being interacted with. As part of this added depth, it now responds to near interactions by having the button surface depress as the user's hand/motion controller presses it.

#### Touch Mesh Button

While the `TouchMeshButton` doesn't have a direct representation within MRTK, it is a button that offers custom visuals and support for near interactions. This allows for any object to react to near interaction, if desired, which aligns with MRTK's experimental `Hand Physics Service`.

Aside from the customization of its visuals, this button behaves in the same way as the `TouchHolographicButton`.

#### Holographic Slate

The `HolographicSlate` is a flat panel that can float in a 3D environment, used to display 2D content in XR experiences.

It consists of a titlebar and content pane. The titlebar has room for a custom title, plus a follow button and close button. The follow button will toggle whether the slate follows the user around or not, and the close button will destroy the slate. The content pane hosts an `AdvancedDynamicTexture`, which is [explained in more detail here](/features/featuresDeepDive/gui/gui).

See it in action here:
<Playground id="#43YQHC#2" title="Slate Scene w/ Label" description="A showcase of different uses for HolographicSlates."/>

#### Near Menu

The `NearMenu` is a `HolographicMenu` with an attached `FollowBehavior` that tries to stay tethered a set distance from the user at all times.

It is a menu designed for use in XR experiences, and by default stays about half an arm's length away. It also rotates to try and stay in the user's field of view.

The `NearMenu` also has a pin button, that when pressed, will freeze the menu in space. The menu can also be grabbed around the edges to move it (it comes with an attached `SixDofDragBehavior`), at which point it becomes pinned in order to maintain its new position.

#### Hand Menu

The `HandMenu` is a `HolographicMenu` that is anchored to the user's hand using a `HandConstraintBehavior`.

Its default position lies on the outside of the user's left hand, such that when their palm is up, the menu is facing them and easily accessible by their right hand.

The menu can be customized to appear by default on the right hand or either hand, and can also be anchored to a different quadrant of the hand. Only one menu will be visible at a time though, even if both hands are up. More information on this can be found in the `HandConstraintBehavior`'s section [here](/features/featuresDeepDive/gui/mrtk#hand-constraint-behavior).

#### Slider 3D

The `Slider3D` is a customizable slider with a 3D presence. The default range of the slider is from `0` to `1`, though that can be customized, along with the step count and precision.

The `Slider3D` can be created with a backplate, which is determined on creation. After creation, the `minimum` and `maximum` values can be adjusted, as well as the `step` size.

See it in action here:
<Playground id="#2PKNJB#7" title="Slider Color Changer" description="A basic example showing how 3D sliders can affect their surroundings."/>

## Behaviors and Gizmos

Some behaviors and Gizmos are also shared with MRTK components. In MRTK terminology, these are usually referred to as Solvers, Bounds Control, or Object Manipulators. Behaviors and Gizmos are attached to `Nodes`, `TransformNodes`, and `Meshes` in order to provide additional functionality.

More information on `Gizmos` can be found [here](/features/featuresDeepDive/mesh/gizmo), while behaviors are covered in more detail [here](/features/featuresDeepDive/behaviors/meshBehaviors).

#### SixDof Drag Behavior

The `SixDofDragBehavior`, also known as MRTK's `Object Manipulator` component. By creating and attaching it to an object in the scene, users are able to grab, move, and rotate the object. Interacting with a ray-cast input allows the object to be moved in 3-dimensions, while interacting with near interaction adds the ability to rotate the object in-place.

```javascript
const sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
```

To attach a `SixDofDragBehavior` to a mesh in the scene, simply call the mesh's `addBehavior` function:

```javascript
mesh.addBehavior(sixDofDragBehavior);
```

#### Follow Behavior

The `FollowBehavior` tries to maintain a set distance between the `TransformNode` it's attached to, and the `followedCamera` target (defaults to main camera).

There are many aspects to this behavior that can be customized. These are the core properties:

| Property            | Type   | Description                                                                                        |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| followedCamera      | Camera | The camera the behavior will try to follow                                                         |
| defaultDistance     | float  | The starting distance to the camera, in meters                                                     |
| minimumDistance     | float  | The minimum distance before the behavior starts to move the attached `TransformNode` further away  |
| maximumDistance     | float  | The maximum distance before the behavior starts to move the attached `TransformNode` closer        |
| verticalMaxDistance | float  | The maximum height offset allowed between the camera's position and the `TransformNode`'s position |

#### Hand Constraint Behavior

The `HandConstraintBehavior` is a behavior that constrains the attached mesh to a specific location on the user's hand. The visibility of the attached mesh can be toggled based on the rotation of the hand and how centered it is in the user's field of view, by setting the `handConstraintVisibility` property.

This behavior takes advantage of the `WebXREyeTracking` feature, allowing the `handConstraintVisibility` propery to check whether the user is actively looking at their hand/the mesh or not. As a fallback if no eye data is available, it uses the direction the device is facing instead.

The following are the core properties that can be set to customize the behavior:

| Property            | Type                      | Description                                                                                                                                          |
| ------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| targetZone          | HandConstraintSide        | An enum that determines which side/quadrant of the hand the mesh is anchored to and offset from                                                      |
| zoneOrientationMode | HandConstraintOrientation | Determines whether the attached mesh's position should rotate with the hand                                                                          |
| nodeOrientationMode | HandConstraintOrientation | Determines whether the attached mesh should rotate with the hand                                                                                     |
| handedness          | XRHandedness              | Should the attached mesh only stick to the left hand, or right hand? Defaults to none, allowing it to stick to either hand as they become available. |

#### Bounding Box Gizmo

The `BoundingBoxGizmo` is also known as MRTK's `Bounds Control` component. This creates small objects that surround the attached mesh, which can be interacted with to rotate, scale, and translate the attached mesh.

## Background Features

These are features that work in the background to enhance the capabilities available to a user.

General XR features are covered in detail [here](/features/featuresDeepDive/webXR/WebXRSelectedFeatures), while AR-specific features are covered in detail [here](/features/featuresDeepDive/webXR/webXRARFeatures).

#### Hand Tracking and Near Interaction

The Hand Tracking feature, `WebXRHandTracking`, is an enhancement to hand inputs for XR devices that support it.

This feature provides articulated joint tracking, hand meshes, and enables the use of touch interactions using near interaction.

The `WebXRNearInteraction` feature is enabled by default on the Babylon playground, and allows for touch interactions when using hands or motion controllers. Touch-supported objects will be able to dynamically react to 3D input, creating a more immersive experience than what basic buttons can provide.

If the `WebXRHandTracking` feature is not enabled, then the near interaction model used will be a visible orb that floats in front of the hand (or motion controller). This orb will only be visible while near a component that supports Near Interaction.

To provide support for Near Interaction to an arbitrary `AbstractMesh`, simply set the `isNearPickable` and/or `isNearGrabbable` properties. `isNearPickable` will enable near interaction in the form of touch input, whereas `isNearGrabbable` will allow the object to be grabbed. The main difference here is that touch input triggers a press on touch, but grabbing the object requires touch _and_ a trigger of some kind (pulling the trigger on a controller, or performing a pinch gesture with a hand). At most one of these options should be enabled for a given object at any given time, to prevent unintended interactions.

#### Eye Tracking

Disclaimer: The Eye tracking feature is only supported with BabylonNative for now.

The Eye Tracking feature, `WebXREyeTracking`, is an opt-in feature for supported XR devices that captures the direction the user's eyes are facing, and passes that along for developers to use.

To use, simply enable the Eye Tracking feature when setting up a project in BabylonNative.

You then have the option to either listen to an observable, or directly query the component for the latest data. Eye tracking data is always provided as a `Ray`.
