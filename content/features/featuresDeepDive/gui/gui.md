---
title: The Babylon GUI
image:
description: Learn all about the Babylon.js 2D GUI system.
keywords: diving deeper, GUI, 2D
further-reading:
  - title: How To Use the Selection Panel Helper
    url: /features/featuresDeepDive/gui/selector
  - title: How To Use Babylon GUI Scroll Viewer
    url: /features/featuresDeepDive/gui/scrollViewer
  - title: How To Use Babylon GUI Xml Loader
    url: /features/featuresDeepDive/gui/xmlLoader
  - title: How To Use Babylon GUI3D
    url: /features/featuresDeepDive/gui/gui3D
video-overview:
video-content:
---

## How To Use Babylon GUI

The Babylon.js GUI library is an extension you can use to generate interactive user interface.
It is build on top of the DynamicTexture.

The latest version can be found on our CDN at https://cdn.babylonjs.com/gui/babylon.gui.js .

And the source code is available on the main Babylon.js repo: https://github.com/BabylonJS/Babylon.js/tree/master/packages/dev/gui.

You can find a complete demo here: https://www.babylonjs.com/demos/gui/

Please note, in addition to the Babylon 2D GUI system described below, with Babylon.js v3.3 and higher, you also have a [3D GUI system](/features/featuresDeepDive/gui/gui3D) available to leverage as well. Both systems can be used for different needs for your project.

## Introduction

Babylon.GUI uses a DynamicTexture to generate a fully functional user interface which is flexible and GPU accelerated.

## AdvancedDynamicTexture

To begin with Babylon.GUI, you first need an AdvancedDynamicTexture object.

Babylon.GUI has two modes:

### Fullscreen mode

In this mode, Babylon.GUI will cover the entire screen and will rescale to always adapt to your rendering resolution. It will also intercept clicks (including touches). To create an AdvancedDynamicTexture in fullscreen mode, just run this code:

```javascript
const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
```

Here is an example of a simple fullscreen mode GUI: <Playground id="#XCPP9Y#1" title="Fullscreen GUI Example" description="Simple example of adding a fullscreen BabylonGUI to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI1.jpg" isMain={true} category="GUI"/>

By default the ratio between rendering resolution and texture size is 1. But you can force it to different values with `advancedTexture.renderScale`. This could be useful if you want crisper texts for instance.

Foreground & background:
The fullscreen mode can be rendered in either the foreground or the background of a scene.
It can be set like this:

```javascript
// true == foreground (default)
// false == background
const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", foreground? : Boolean );
// it can also be changed on the go:
    advancedTexture.isForeground = false;
```

**Please note that only one fullscreen mode GUI is allowed per scene**

The fullscreen mode is not intended to be used with WebVR as it is a pure 2d rendering. For WebVR scenario you will have to use the texture mode below.

### Texture mode

In this mode, BABYLON.GUI will be used as a texture for a given mesh. You will have to define the resolution of your texture. To create an AdvancedDynamicTexture in texture mode, just run this code:

```javascript
const advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(myPlane, 1024, 1024);
```

Here is an example of a simple texture mode GUI: <Playground id="#ZI9AK7#1" title="Texture Mode GUI Example" description="Simple example of adding a texture mode BabylonGUI to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI2.jpg"/>

Here is the same example but now using “billboardMode = all” where the GUI will always face the camera: <Playground id="#ZI9AK7#1214" title="Texture Mode With Camera Facing GUI Example" description="Simple example of adding a texture mode BabylonGUI to your scene with camera facing." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI2.jpg"/>

Please note that handling pointer move events could be costly on complex meshes, so you can turn off supporting pointer move events with a fourth parameter:

```javascript
const advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(myPlane, 1024, 1024, false);
```

Once you have an AdvancedDynamicTexture object, you can start adding controls.

## Loading from Snippet Server

Here is an example of loading an AdvancedDynamicTexture from the Snippet Server: <Playground id="#AJA7KA#50" title="Loading GUI from Snippet Server" description="Simple demo of loading a texture from the Snippet Server and accessing the controls." image="/img/playgroundsAndNMEs/pg-AJA7KA-8.png"/>

## Debugging

Starting with Babylon.js v4.0, the new inspector can help debugging your GUI by displaying bounding infos and letting you dynamically change properties: [Inspector Docs](/toolsAndResources/inspector)

## General properties

### Events

**Please note that controls need to have `control.isPointerBlocker = true` to correctly handle all the pointer events. This property is set by default on obvious controls like buttons for instance but if you want to have it on controls like images you must turn it on.**

All controls have the following observables:

| Observables              | Comments                                                                         |
| ------------------------ | -------------------------------------------------------------------------------- |
| onPointerMoveObservable  | Raised when the cursor moves over the control. Only available on fullscreen mode |
| onPointerEnterObservable | Raised when the cursor enters the control. Only available on fullscreen mode     |
| onPointerOutObservable   | Raised when the cursor leaves the control. Only available on fullscreen mode     |
| onPointerDownObservable  | Raised when pointer is down on the control.                                      |
| onPointerUpObservable    | Raised when pointer is up on the control.                                        |
| onPointerClickObservable | Raised when a control is clicked on.                                             |
| onClipboardObservable    | Raised when a clipboard event is triggered.                                      |

To use the clipboard events, they first need to be enabled by calling `registerClipboardEvents` on the AdvancedDynamicTexture Instance which will register the `cut`, `copy`, `paste` events onto the canvas. Once enabled, they can be triggered via `ctrl/cmd + c` for copy, `ctrl/cmd + v` for paste and `ctrl/cmd + x` for cut and will always be listening to the canvas. If you have any other action having the same key bindings, you can prevent default triggering of these events by calling `unRegisterClipboardEvents` which will unregister them from the canvas.

Here is an example on how to use clipboard observables:

- To create new meshes: <Playground id="#S0IW99#1" title="Clipboard Observable Mesh Creation Example" description="Simple example of creating a mesh using the clipboard observable." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI3.jpg"/>
- To create new textblocks from clipboard data: <Playground id="#AY28VL#4" title="Clipboard Observable Textblock Example" description="Simple example of creating new textblocks from clipboard data." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI4.jpg"/>

You can also define that a control is invisible to events (so you can click through it for instance). To do so, just call `control.isHitTestVisible`.

Please note that `onPointerMoveObservable`, `onPointerDownObservable`, `onPointerUpObservable`, `onPointerClickObservable` will receive a Vector2 parameter containing the pointer coordinates. If you want to get the pointer coordinates in local control space, you have to call `control.getLocalCoordinates(coordinates)`.

Here is an example of how to use observables: <Playground id="#XCPP9Y#121" title="Observables Example" description="Simple example demonstrating observables." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI5.jpg"/>
Here is an example of how to use the onPointerClickObservable: <Playground id="#7RH606" title="onPointerClickObservable Example" description="Simple example demonstrating the onPointerClickObservable." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI6.jpg"/>

### Alignments

You can define the alignments used by your control with the following properties:

| Property            | Default | Comments                              |
| ------------------- | ------- | ------------------------------------- |
| horizontalAlignment | 2       | Can be set to left, right or center.  |
| verticalAlignment   | 2       | Can be set to top, bottom and center. |

Values can be taken from `BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_*` and `BABYLON.GUI.Control.VERTICAL_ALIGNMENT_*`.

Here is an example of how to use alignments: <Playground id="#XCPP9Y#13" title="Alignments Example" description="Simple example demonstrating how to use gui alignments." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI7.jpg" isMain={true} category="GUI"/>

### Position and size

You can set controls' position with the following properties:

| Property | Type         | Default | Default unit |
| -------- | ------------ | ------- | ------------ |
| left     | valueAndUnit | 0       | Pixel        |
| top      | valueAndUnit | 0       | Pixel        |

Size can be set with:

| Property | Type         | Default | Default unit |
| -------- | ------------ | ------- | ------------ |
| width    | valueAndUnit | 100%    | Percentage   |
| height   | valueAndUnit | 100%    | Percentage   |

Paddings can be set with:

| Property      | Type         | Default | Default unit |
| ------------- | ------------ | ------- | ------------ |
| paddingTop    | valueAndUnit | 0px     | Pixel        |
| paddingBottom | valueAndUnit | 0px     | Pixel        |
| paddingLeft   | valueAndUnit | 0px     | Pixel        |
| paddingRight  | valueAndUnit | 0px     | Pixel        |

The padding is the space around the control (on the outside) between it and its parent or sibling controls (like CSS margin when box-sizing is set to border-box). This means that the usableWidth = width - paddingLeft - paddingRight. Same for usableHeight = height - paddingTop - paddingBottom.

All these properties can be defined using pixel or percentage as unit.
To set value as pixel, use this construct: `control.left = "50px"`
To set value as percentage, use this construct: `control.left = "50%"`

You can also not define the unit (In this case the default unit will be used): `control.width = 0.5` (which is equivalent to `control.width = "50%"`)

Here is an example of how to use and update positions and sizes: <Playground id="#KKA6L4" title="Positions and Sizes Example" description="Simple example demonstrating how to set and update GUI positions and sizes." isMain={true} category="GUI"/>

### Tracking positions

All controls can be moved to track position of a mesh.
To do this, just call `control.linkWithMesh(mesh)`. You can then offset the position with `control.linkOffsetX` and `control.linkOffsetY`.

Here is an example of a trackable label: <Playground id="#XCPP9Y#16" title="Trackable Label Example" description="Simple example of a trackable gui label." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI9.jpg"/>

Please note that controls that want to track position of a mesh must be at root level (at AdvancedDynamicTexture level).

You can also move a control to a specific coordinates in your scene with `control.moveToVector3(position)`. Please note that the control will not stick with the vector if you change it afterwards.

For Line control, you can also attach the second point to a control with `line.connectedControl = control`. In this case the `x2` and `y2` properties are used to offset the second point from the connected control.

With these 2 options, you can create a complete trackable label: <Playground id="#XCPP9Y#20" title="Complete Trackable Label Example" description="Complete example of a trackable gui label." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI10.jpg"/>

**Tracking positions features only work when the AdvancedDynamicTexture is in fullscreen mode**

### Adaptive scaling

When in fullscreen UI, you can decide to define your UI with a fixed resolution.
To define this resolution, just set `myAdvancedDynamicTexture.idealWidth = 600` **or** `myAdvancedDynamicTexture.idealHeight = 400`.

If both are set, the idealWidth will be used.

If neither is set, you will be responsible for resizing the UI controls yourself.

When ideal resolution is set, all values expressed **in pixels** are considered relatively to this resolution and scaled accordingly to match the current resolution.

Even when ideal size is set, the fullscreen UI will be rendered at the same resolution of your canvas, but you can decide (mostly for performance reason) to force the texture to use the ideal size for resolution as well. To do so, just call `myAdvancedDynamicTexture.renderAtIdealSize = true`.

In order to use both idealWidth and idealHeight, set both of them, and set `myAdvancedDynamicTexture.useSmallestIdeal = true`.
When window width is smaller than window height - idealWidth will be used, otherwise - idealHeight will be used.
This is a good solution for when your canvas can be resized to varying width : height ratios.

Here is an example of how to use horizontal adaptive scaling: <Playground id="#XCPP9Y#39" title="Horizontal Adaptive Scaling Example" description="Simple example of horizontal adaptive scaling." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI11.jpg" isMain={true} category="GUI"/>

### Rotation and Scaling

Controls can be transformed with the following properties:

| Property         | Type   | Default | Comments                                                                |
| ---------------- | ------ | ------- | ----------------------------------------------------------------------- |
| rotation         | number | 0       | Value is in radians                                                     |
| scaleX           | number | 1       |
| scaleY           | number | 1       |
| transformCenterX | number | 0.5     | Define the center of transformation on X axis. Value is between 0 and 1 |
| transformCenterY | number | 0.5     | Define the center of transformation on Y axis. Value is between 0 and 1 |

**Please be aware that transformations are done at rendering level so after all computations.** This means that alignment or positioning will be done first without taking transform in account.

Here is an example of how to use rotation and scaling: <Playground id="#XCPP9Y#22" title="Rotation and Scaling Example" description="Simple example of rotation and scaling." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI12.jpg"  isMain={true} category="GUI"/>

### Optimization

For complex controls (like the ColorPicker for instance), you can turn on rendering cache by using `control.useBitmapCache = true`. This will store a cached version of the control image in order to reuse it when the GUI is updated.

Starting with Babylon.js v4.0 the GUI system uses the Invalidate Rect optimization which allows the renderer to only update portions of the texture. If you want to turn it off, you can call `adtTexture.useInvalidateRectOptimization = false`

- <Playground id="#GBNTXK" title="GUI Optimization Example" description="Simple example of GUI optimization." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI13.jpg"/>

## Controls

A control is an abstraction of a piece of UI. There are two kinds of controls:

- Pure controls: A pure control defines an action or an information useful for the user. It could be a TextBlock or a Button.
- Containers: Containers are used to organize your UI. They can contain other controls or containers.

All controls share the following properties:

| Property (Default)       | Type    | Comments                                                                                                                                                                                                                                                                        |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| alpha (1)                | number  | Between 0 and 1. 0 means completely transparent. 1 means fully opaque                                                                                                                                                                                                           |
| color (Black)            | string  | Foreground color                                                                                                                                                                                                                                                                |
| fontFamily (Ariel)       | string  | Font family can be inherited. This means that if you set it on a container, it will be transmitted to all children of the container                                                                                                                                             |
| fontSize (18)            | number  | Can be inherited                                                                                                                                                                                                                                                                |
| fontStyle (unset)        | string  | Can be inherited                                                                                                                                                                                                                                                                |
| fontWeight (unset)       | string  | Can be inherited                                                                                                                                                                                                                                                                |
| zIndex (0)               | number  | the zIndex can be used to reorder controls on the z axis                                                                                                                                                                                                                        |
| shadowBlur (0)           | number  | the amount of blur that is applied to the drop shadow                                                                                                                                                                                                                           |
| shadowOffsetX (0)        | number  | the offset of the shadow on the x axis                                                                                                                                                                                                                                          |
| shadowOffsetY (0)        | number  | the offset of the shadow on the y axis                                                                                                                                                                                                                                          |
| shadowColor (#000)       | string  | the color of the shadow                                                                                                                                                                                                                                                         |
| isPointerBlocker (false) | boolean | make sure gui events are triggered before the scene events                                                                                                                                                                                                                      |
| hoverCursor ("")         | string  | the cursor to use when mouse is over the control, need to have isPointerBlocker set to true <Playground id="#XCPP9Y#888" title="HoverCursor Example" description="Simple example using the hoverCursor control." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI14.jpg"/> |
| overlapGroup             | number  | The overlapGroup which the control belongs to or undefined to exclude from moving the control to a non overlapping poisition.<Playground id="#BMW0VQ#3" title="OverlapGroup example" description="Simple example using the overlapGroup property of the control." />            |
| overlapDeltaMultiplier   | number  | The speed of the movement of the control when used with `AdvancedDynamicTexture`'s `moveToNonOverlappedPosition` method. See the playground above.                                                                                                                              |

Controls can be added directly to the AdvancedDynamicTexture or to a container with:

```javascript
container.addControl(control);
```

They can be removed with:

```javascript
container.removeControl(control);
```

You can also control the control visibility with `control.isVisible = false`. When `isVisible` is true, all children will also be invisible. If you just want to hide the current control but keep its children visible then you can use `control.notRenderable = true`.

### TextBlock

The TextBlock is a simple control used to display text: <Playground id="#XCPP9Y#2" title="Simple TextBlock Example" description="Simple example of adding a textBlock to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI15.jpg" isMain={true} category="GUI"/>

Here are the properties you can define:

| Property                    | Type         | Comments                                                    |
| --------------------------- | ------------ | ----------------------------------------------------------- |
| lineSpacing (0px)           | valueAndUnit | Can be set to configure vertical spacing between text lines |
| text (null)                 | string       | Text to display                                             |
| textWrapping (false)        | boolean      | Can be set to true to enable text wrapping.                 |
| resizeToFit (false)         | boolean      | Can be set to true to enable resize to fit.                 |
| textHorizontalAlignment (2) | number       | Can be set to left, right or center                         |
| textVerticalAlignment (2)   | number       | Can be set to top, bottom or center                         |
| outlineWidth (0)            | number       | Text outline size, in pixels.                               |
| outlineColor ("white")      | string       | Text outline color.                                         |
| wordSplittingFunction       | string       | Function to use to split the text into words                |

The control currently provides 1 observable:

| Observables             | Comments                         |
| ----------------------- | -------------------------------- |
| onTextChangedObservable | Raised when the text has changed |

Please note that to get crisp texts you have to ensure that your rendering resolution is aligned with the screen: <Playground id="#2ARI2W#10" title="Crisp Text Resolution Example" description="Simple example showing how to get crisp text by matching the screen resolution." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI16.jpg"/>

On this example you can see on line #3 that we force the engine to get the same DPI as the screen.
Then on lines #10 and #11 we scale the GUI to align with the screen resolution.

When in wrapping mode, the text is split into words before being displayed, and words are supposed to be separated by at least one space character. In some languages, however, breaking a text into words should follow some other rules.

For those languages, you can use the `wordSplittingFunction` property to provide your own splitting function: this function takes a string as input and must return an array of strings (the input string broken into words).

Here's an example for japanese: https://jsfiddle.net/3ph9m0cx/

### Line spacing

You can configure vertical line spacing between lines in pixels or percentage values.

**lineSpacing should be used with textWrapping set to true.**

You can try it here: <Playground id="#44KYLP" title="Simple Line Spacing Example" description="Simple example of line spacing." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI17.jpg"/>

### Resize to Fit

When resizeToFit is set to true, the width and height of the rendered text will be automatically measured and applied to the TextBlock.

This property allows you to change the text and font of a TextBlock without having to worry about manually setting the estimated rendered width and height.

**Warning** When resizeToFit and textWrapping are both set to true the width of the block will not be resized to fit the text, however the height will be. This means that, depending on the font size, parts of the text on each line may be missing and the width of the block may need to be changed manually.

## InputText

The InputText is a control used to let users insert text in a single line: <Playground id="#UWS0TS" title="InputText Example" description="Simple example of InputText." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI18.jpg"/>

Here are the properties you can define:

| Property (default)           | Type         | Comments                                                                                                                 |
| ---------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| text (null)                  | string       | Text to display                                                                                                          |
| color (white)                | string       | Foreground color                                                                                                         |
| background (black)           | string       | Background color                                                                                                         |
| focusedBackground (black)    | string       | Background color to use when the control is focused                                                                      |
| autoStretchWidth (true)      | boolean      | The control will resize horizontally to adapt to text size                                                               |
| maxWidth (100%)              | valueAndUnit | The maximum width allowed if autoStretchWidth is set to true                                                             |
| margin (10px)                | valueAndUnit | Margin to use on left and right inside the control itself. This margin is used to determine where the text will be drawn |
| thickness (1)                | number       | Thickness of the border                                                                                                  |
| highligherOpacity (0.4)      | number       | Defines the transparency of highlighted text's background                                                                |
| textHighlightColor (#D5E0FF) | string       | Background color of highlighted text                                                                                     |
| onFocusSelectAll (false)     | boolean      | Allows complete selection of text by default when the input is focused.                                                  |

The InputText is a focusable control. This means you can click / touch it in order to give it the focus and control over the keyboard events. You can remove the focus from the control by hitting enter or clicking outside of the control.

The control provides several observables to track its state:

| Observables                        | Comments                                                |
| ---------------------------------- | ------------------------------------------------------- |
| onTextChangedObservable            | Raised when the text has changed                        |
| onBeforeKeyAddObservable           | Raised just before the entered key is added to the text |
| onFocusObservable                  | Raised when the control gets the focus                  |
| onBlurObservable                   | Raised when the control loses the focus                 |
| onTextHighlightObservable          | Raised when the text is highlighted                     |
| onTextCopyObservable               | Raised when the copy event is triggered                 |
| onTextCutObservable                | Raised when the cut event is triggered                  |
| onTextPasteObservable              | Raised when the paste event is triggered                |
| onKeyboardEventProcessedObservable | Raised when a key event was processed                   |

Please note that the InputText has pretty limited edition support. Here are the supported keys:

- Delete
- Backspace
- Home
- End
- Enter
- Left / Right (used to move the cursor)

Furthermore, please note that due to JavaScript platform limitation, the InputText cannot invoke the onscreen keyboard. On mobile, the InputText will use the `prompt()` command to get user input. You can define the title of the prompt by setting `control.promptMessage`.

### Using onBeforeKeyAddObservable for extended keyboard layouts and input masks

The onBeforeKeyAddObservable observable can be used to extend or change how the InputText control accepts text. For example, it's possible to implement support for different keyboard layouts using this feature where some keys act as modifiers for the next entered key or you can implement an input mask which only accepts numerical keys.

The observable is triggered just before a printable key will be added to the text in the control. The attached handler can then use the following methods to get information on the keyboard state and to modify how the key is handled within the control:

| Method     | Description                                                                            |
| ---------- | -------------------------------------------------------------------------------------- |
| currentKey | The key that will be appended to the text                                              |
| addKey     | If true, the key in currentKey will be added to the text, otherwise it will be skipped |
| deadKey    | Set to true if the user hit the dead key on the keyboard. Handler must reset to false  |

For example, if the handler wants to limit the control to only accept numerical keys, then it can set addKey to false if the value of currentKey is not numerical. The key will then not be added to the text. Similarly dead key support can be implemented by checking the deadKey flag and setting currentKey to the appropriate character for the dead key + key combination.

Please note that the observable is only triggered by printable keys, that is, keys that can be added to the text, and not by control keys like backspace and enter.

Here's an example showing two inputs, one which only accepts numerical keys and one which has simple dead key support: <Playground id="#I1Y5YT#1" title="Restricted Input Example" description="Simple example of restricting input for specific character types." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI19.jpg"/>

InputText also supports clipboardObservables, here's an example: <Playground id="#UWS0TS#20" title="InputText With ClipboardObservable" description="Simple example showing InputText with a clipboardObservable." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI20.jpg"/>

## InputTextArea

The InputTextArea is a control used to display editable text across multiple lines:

```javascript
const inputTextArea = new BABYLON.GUI.InputTextArea("input", "Some initial text");
```

You can try it here: <Playground id="#NVAEWD#7" title="InputTextArea Example" description="Simple example of InputTextArea." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI49.jpg"/>

InputTextArea behaves the same as the InputText control but it also has these additional properties:

| Property (default)       | Type         | Comments                                                      |
| ------------------------ | ------------ | ------------------------------------------------------------- |
| autoStretchHeight (true) | boolean      | The control will resize vertically to adapt to text size      |
| maxHeight (100%)         | valueAndUnit | The maximum height allowed if autoStretchWidth is set to true |

Here's an example of an InputTextArea using the additional properties: <Playground id="#NVAEWD#8" title="InputTextArea AutoStretchHeight Example" description="Example of InputTextArea with autoStretchHeight enabled" image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI50.jpg"/>

## InputPassword

The InputPassword is a control that shows the entered characters as bullets and is thus suited for entering passwords: <Playground id="#UB58DY" title="InputPassword Example" description="Simple example showing how to add an InputPassword control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI21.jpg"/>

Otherwise it behaves the same as the InputText control and has the same properties as shown above.

There are no configuration options available that are specific to this control. For example, it is not possible to show the entered plain text.

## Button

A button can be used to interact with your user.
Please see the events chapter to see how to connect your events with your buttons.
The onPointerClickObservable is raised when a button is clicked, meaning both the down and up event happen while the cursor is over the control.

There are three kinds of buttons available out of the box:

- ImageButton: An image button is a button made with an image and a text. You can create one with:

```javascript
const button = BABYLON.GUI.Button.CreateImageButton("but", "Click Me", "textures/grass.png");
```

You can try it here: <Playground id="#XCPP9Y#3" title="Button Example" description="Simple example showing how to add a Button control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI22.jpg"  isMain={true} category="GUI"/>

- ImageWithCenterTextButton: An image button made with a image background and a centered text overlay.

```javascript
const button = BABYLON.GUI.Button.CreateImageWithCenterTextButton("but", "Click Me", "textures/grass.png");
```

You can try it here: <Playground id="#PLTRBV" title="ImageWithCenterTextButton Example" description="Simple example showing how to add an ImageWithCenterTextButton control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI23.jpg"/>

- SimpleButton: A simple button with text only

```javascript
const button = BABYLON.GUI.Button.CreateSimpleButton("but", "Click Me");
```

You can try it here: <Playground id="#XCPP9Y#4" title="SimpleButton Example" description="Simple example showing how to add a SimpleButton control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI24.jpg"/>

- ImageOnlyButton:

```javascript
const button = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/grass.png");
```

You can try it here: <Playground id="#XCPP9Y#28" title="ImageOnlyButton Example" description="Simple example showing how to add an ImageOnlyButton control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI25.jpg"/>

Please also note that by default buttons will handle hit testing based on their bounding info. If you want to have embedded controls to handle the picking you can call `button.delegatePickingToChildren = true`

### Accessing parts

You can use the following properties to get button's parts (if available):

- image: Returns the image part of the button (if any)
- textBlock: Returns text related properties of the button

### Visual animations

By default a button will change its opacity on pointerOver and will change it scale when clicked.
You can define your own animations with the following callbacks:

- pointerEnterAnimation
- pointerOutAnimation
- pointerDownAnimation
- pointerUpAnimation

### Custom button

You can also create a complete custom button by manually adding children to the button. Here is how the ImageButton is built:

```javascript
BABYLON.GUI.Button.CreateMyCustomButton = function (name, text, imageUrl) {
  const result = new BABYLON.GUI.Button(name);

  // Adding text
  const textBlock = new BABYLON.GUI.TextBlock(name + "_button", text);
  textBlock.textWrapping = true;
  textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  textBlock.paddingLeft = "20%";
  result.addControl(textBlock);

  // Adding image
  const iconImage = new BABYLON.GUI.Image(name + "_icon", imageUrl);
  iconImage.width = "20%";
  iconImage.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
  iconImage.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  result.addControl(iconImage);

  return result;
};
```

## Checkbox

The checkbox is used to control a boolean value.
You can specify the value with `checkbox.isChecked`.

Changing the `isChecked` property will raise an observable called `checkbox.onIsCheckedChangedObservable`.

The control is rendered using the following properties:

| Property       | Type   | Default | Comments                                                                                                                                                 |
| -------------- | ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color          | string | white   | Foreground color                                                                                                                                         |
| background     | string | black   | Background color                                                                                                                                         |
| checkSizeRatio | number | 0.8     | Define the ratio used to compute the size of the inner checkbox (0.8 by default, which means the inner check size is equal to 80% of the control itself) |

Here is an example of a checkbox: <Playground id="#U9AC0N#2" title="Checkbox Example" description="Simple example showing how to add a Checkbox control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI26.jpg"/>

## RadioButton

The radio button is used to define a value among a list by using a group of radio buttons where only one can be true.
You can specify the selected value with `radiobutton.isChecked`.

Changing the `isChecked` property will raise an observable called `checkbox.onIsCheckedChangedObservable`. Furthermore, if you select a radio button, all other radio buttons within the same group will turn to false.

The control is rendered using the following properties:

| Property       | Type   | Default      | Comments                                                                                                                                                 |
| -------------- | ------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color          | string | white        | Foreground color                                                                                                                                         |
| background     | string | black        | Background color                                                                                                                                         |
| checkSizeRatio | number | 0.8          | Define the ratio used to compute the size of the inner checkbox (0.8 by default, which means the inner check size is equal to 80% of the control itself) |
| group          | string | empty string | Use the group property to gather radio buttons working on the same value set                                                                             |

Here is an example of a radiobutton: <Playground id="#U9AC0N#13" title="RadioButton Example" description="Simple example showing how to add a RadioButton control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI27.jpg"/>

## Slider

The slider is used to control a value within a range.
You can specify the range with `slider.minimum` and `slider.maximum`.

The value itself is specified with `slider.value` and will raise an observable everytime it is changed (`slider.onValueChangedObservable`).

The control is rendered using the following properties:

| Property       | Type         | Default | Comments                                                                                                                  |
| -------------- | ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| borderColor    | string       | white   | Color used to render the border of the thumb                                                                              |
| color          | string       | white   | Foreground color                                                                                                          |
| background     | string       | black   | Background color                                                                                                          |
| barOffset      | valueAndUnit | 5px     | Offset used vertically to draw the background bar                                                                         |
| thumbWidth     | valueAndUnit | 30px    | Width of the thumb                                                                                                        |
| displayThumb   | boolean      | true    | Indicates if the thumb must be rendered (useful to simulate progress bar)                                                 |
| isThumbCircle  | boolean      | false   | Indicates if the thumb should be a circle (square if false)                                                               |
| isThumbClamped | boolean      | false   | Indicates if the thumb should be clamped                                                                                  |
| isVertical     | boolean      | false   | Indicates that the slider will be rendered vertically instead of horizontally                                             |
| step           | number       | 0       | Indicates the degree of precision required for sldier values (0 means full precision where 0.01 means 2 digits precision) |

When using vertical slider, you have to make sure that height is bigger than width. The opposite has to be true when using `isVertical = false`.

Here is an example of a slider: <Playground id="#U9AC0N#1" title="Slider Example" description="Simple example showing how to add a Slider control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI28.jpg"/>

## ImageBasedSlider

You can use an ImageBasedSlider to customize a slider using pictures. This control can be configured like the Slider)

It is rendered using the following properties:

| Property        | Type         | Default | Comments                                                                      |
| --------------- | ------------ | ------- | ----------------------------------------------------------------------------- |
| backgroundImage | string       | null    | Path to the image to use for the background                                   |
| valueBarImage   | string       | null    | Path to the image to use for the value bar                                    |
| thumbImage      | string       | null    | Path to the image to use for the thumb                                        |
| barOffset       | valueAndUnit | 5px     | Offset used vertically to draw the background bar                             |
| thumbWidth      | valueAndUnit | 30px    | Width of the thumb                                                            |
| displayThumb    | boolean      | true    | Indicates if the thumb must be rendered (useful to simulate progress bar)     |
| isThumbClamped  | boolean      | false   | Indicates if the thumb should be clamped                                      |
| isVertical      | boolean      | false   | Indicates that the slider will be rendered vertically instead of horizontally |

Here is an example of a sliders and image based sliders: <Playground id="#HATGQZ" title="ImageBasedSlider Example" description="Simple example showing how to add a ImageBasedSlider control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI29.jpg"/>

## Line

The line will draw a line (!!) between two points.

Here are the properties you can define:

| Property  | Type             | Default     | Comments                         |
| --------- | ---------------- | ----------- | -------------------------------- |
| x1        | number           | 0           | X coordinate of the first point  |
| y1        | number           | 0           | Y coordinate of the first point  |
| x2        | number           | 0           | X coordinate of the second point |
| y2        | number           | 0           | Y coordinate of the second point |
| dash      | array of numbers | Empty array | Defines the size of the dashes   |
| lineWidth | number           | 1           | Width in pixel                   |

Here is an example of a line: <Playground id="#XCPP9Y#6" title="Line Example" description="Simple example showing how to add a Line control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI30.jpg"/>

## MultiLine

MultiLine will draw lines between any number of meshes, controls and points.

Each item in MultiLine is called MultiLinePoint, and has the following properties:

| Property | Type         | Default | Comments                                  |
| -------- | ------------ | ------- | ----------------------------------------- |
| mesh     | AbstractMesh | null    | Tracks a Mesh                             |
| control  | Control      | null    | Tracks a Control                          |
| x        | number       | null    | x of a point, can be specified in px or % |
| y        | number       | null    | y of a point, can be specified in px or % |

Here are the functions you can use:

- add(): Receives any number of arguments and adds them, each argument can be a mesh, a control, or a point. Returns an array of MultiLinePoint
- push(): Receives 1 argument and adds it, each argument can be a mesh, a control, or a point. Returns a MultiLinePoint
- remove(): Recives an index or an instance of a MultiLinePoint and removes it
- getAt(): Recives an index of a MultiLinePoint and returns its instance. If no MultiLinePoint exists in that index - a new one is created

Here are the properties you can define in MultiLine:

| Property  | Type             | Default     | Comments                       |
| --------- | ---------------- | ----------- | ------------------------------ |
| dash      | array of numbers | Empty array | Defines the size of the dashes |
| lineWidth | number           | 1           | Width in pixel                 |

Here is an example of a MultiLine combining meshes, a control and a point: <Playground id="#H03KNW#2" title="MultiLine Example" description="Simple example showing how to add a MultiLine control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI31.jpg"/>

## Image

Use the image control to display an image in your UI.
You can control the stretch used by the image with `image.stretch` property. You can set it to one of these values:

- BABYLON.GUI.Image.STRETCH_NONE: Use original size
- BABYLON.GUI.Image.STRETCH_FILL: Scale the image to fill the container (This is the default value)
- BABYLON.GUI.Image.STRETCH_UNIFORM: Scale the image to fill the container but maintain aspect ratio
- BABYLON.GUI.Image.STRETCH_EXTEND: Scale the container to adapt to the image size.
- BABYLON.GUI.Image.STRETCH_NINE_PATCH: Scale the image using a [nine patch technique](http://wiresareobsolete.com/2010/06/9-patches/). You have to either define the `sliceLeft`, `sliceRight`, `sliceTop` and `sliceBottom` properties or store data into your image (in the first and last rows and columns) and call `image.populateNinePatchSlicesFromImage = true` to read that data. Demo: <Playground id="#G5H9IN#2" title="Stretch_Nine_Patch Example" description="Simple example showing how to add an Image control with Stretch_Nine_Patch to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI32.jpg"/>

You may want to have the Image control adapt its size to the source image. To do so just call `image.autoScale = true`.

You can change image source at any time with `image.source="myimage.jpg"`.

You can also define which part of the source image you want to use with the following properties:

- sourceLeft: x coordinate in
  the source image (in pixel)
- sourceTop: y coordinate in the source image (in pixel)
- sourceWidth: width of the source image you want to use (in pixel)
- sourceHeight: height of the source image you want to use (in pixel)

Here is an example of an image: <Playground id="#XCPP9Y#7" title="Image Example" description="Simple example showing how to add an Image control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI33.jpg"/>

You can use animation sheet in the image using properties `image.cellId`, `image.cellWidth`, `image.cellHeight`. <Playground id="#K60448#10" title="Image With Sprite Sheet Example" description="Simple example showing how to add an Image with a sprite sheet to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI34.jpg"/>
You can also apply stretch to animation sheet using `image.stretch` property.

<Playground id="#K60448#1" title="Image With Stetched Sprite Sheet Example 1" description="Simple example showing how to add an Image with a stretched sprite sheet to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI35.jpg"/>

<Playground id="#K60448#2" title="Image With Stetched Sprite Sheet Example 2" description="Simple example showing how to add an Image with a stretched sprite sheet to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI36.jpg"/>

Starting with babylon.js v4.0, you can also set `img.detectPointerOnOpaqueOnly = true` to indicate if pointers should only be validated on pixels with alpha > 0.

### Batch loading of SVG images from icon sheet

You can now load multiple SVG icons from a single SVG icon sheet without manually defining multiple sourceLeft, sourceTop, sourceWidth, sourceHeight attributes for each image.

Pre-requisite: a valid single layer SVG document with width, height, viewbox defined and icons grouped via ids. The layer should not have any transform attributes.

`onSVGAttributesComputedObservable` will trigger when the sourceLeft, sourceTop, sourceWidth, sourceHeight attributes are automatically computed. You can create custom SVG buttons that are built from multiple SVG assets (glow, text, images etc) for even cleaner code.

Here is an example that uses SVG assets for images and buttons: <Playground id="#E5CARD" title="SVG Asset GUI Example" description="Simple example using SVG assets for gui elements." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI37.jpg"/>

Known issue: The batch loading process requires the entire SVG icon sheet to be loaded as a HTMLObjectElement in the DOM. On certain browsers, you may notice a quick flash of the icon sheet on the canvas as the assets load. To alleviate this, you may employ [a loading screen](/features/featuresDeepDive/scene/customLoadingScreen).

## ColorPicker

The color picker control allows users to set colors in your scene.

Whenever a user interacts with the color picker an observable is triggered (`colorPicker.onValueChangedObservable`) which returns the current value (Color3) of the color picker.

The control is rendered using the following properties:

| Property | Type             | Default | Comments                                                                                                        |
| -------- | ---------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| size     | string or number | "200px" | The size, width, and height property will always be the same value since the color picker can only be a square. |

Here is an example of a color picker: <Playground id="#91I2RE#1" title="ColorPicker Example" description="Simple example showing how to add a ColorPicker control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI38.jpg"/>

## DisplayGrid

The display grid control is a simple control used to display grids inside your GUI.

The control is rendered using the following properties:

| Property           | Type   | Default    | Comments                                 |
| ------------------ | ------ | ---------- | ---------------------------------------- |
| background         | string | "Black"    | Defines the color of the grid background |
| cellWidth          | number | 20         | Defines the width of each cell           |
| cellHeight         | number | 20         | Defines the height of each cell          |
| minorLineTickness  | number | 1          | Defines the tickness of minor lines      |
| minorLineColor     | string | "DarkGray" | Defines the color of the minor lines     |
| majorLineTickness  | number | 2          | Defines the tickness of major lines      |
| majorLineColor     | string | "White"    | Defines the color of the major lines     |
| majorLineFrequency | number | 5          | Defines the frequency of major lines     |

Here is an example of a display grid: <Playground id="#747U9T" title="DisplayGrid Example" description="Simple example showing how to add a DisplayGrid control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI39.jpg"/>

## VirtualKeyboard

The VirtualKeyboard is a control used to display simple onscreen keyboard. This is mostly useful with WebVR scenarios where the user cannot easily use his keyboard.

### Keys

You can define the keys provided by the keyboard with the following code:

```javascript
const keyboard = new BABYLON.GUI.VirtualKeyboard();
keyboard.addKeysRow(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "\u2190"]);
```

Every key will be created using default values specified by the following properties:

| Property                   | Default |
| -------------------------- | ------- |
| defaultButtonWidth         | 40px    |
| defaultButtonHeight        | 40px    |
| defaultButtonPaddingLeft   | 2px     |
| defaultButtonPaddingRight  | 2px     |
| defaultButtonPaddingTop    | 2px     |
| defaultButtonPaddingBottom | 2px     |
| defaultButtonColor         | #DDD    |
| defaultButtonBackground    | #070707 |

You can also override each property by providing an array containing properties for keys (or null):

```javascript
addKeysRow(["a", "b"], [null, { width: "200px" }]);
```

You can define each default properties based on the following class:

```javascript
class KeyPropertySet {
      width?: string;
      height?: string;
      paddingLeft?: string;
      paddingRight?: string;
      paddingTop?: string;
      paddingBottom?: string;
      color?: string;
      background?: string;
  }
```

### Layouts

The VirtualKeyboard provides a static method to create a default layout:

```javascript
const keyboard = BABYLON.GUI.VirtualKeyboard.CreateDefaultLayout();
```

The default layout is equivalent to:

```javascript
addKeysRow(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "\u2190"]);
addKeysRow(["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
addKeysRow(["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "\u21B5"]);
addKeysRow(["\u21E7", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"]);
addKeysRow([" "], [{ width: "200px" }]);
```

### VirtualKeyboard Events

Every time a key is pressed the `onKeyPressObservable` observable is triggered. But you can also rely on `keyboard.connect(inputText)` to automatically connect a VirtualKeyboard to an InputText. In this case, the keyboard will only appear when the InputText will be focused and all key pressed events will be sent to the InputText.

You can find a complete demo here: <Playground id="#S7L7FE" title="VirtualKeyboard Events Example" description="Simple example showing how to add VirtualKeyboard Events to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI40.jpg"/>

## Containers

The containers are controls used to host other controls. Use them to organize your UI.
Containers has one specific property: `container.background`. Use it to define the background color of your container.

By default containers do not block pointer events (ie. the underlying scene will receive the pointer event even if the pointer is over a container). You can prevent this behavior by calling `container.isPointerBlocker = true`.

Containers are responsible for managing their children's layout. To prevent layout cycles, the system will not let the layout being updated during a cycle more than 3 times. This value can be changed with `container.maxLayoutCycle`. You can also turn on console warnings when layout cycles are detected with `container.logLayoutCycleErrors = true`.

### Adaptative size

You can decide to have your containers to adapt their size to their children by using one of these properties:

- adaptWidthToChildren (false by default)
- adaptHeightToChildren (false by default)

If you set one of these properties to true, the associated dimension (width, height or both) will be computed based on direct children size as long as it is defined in pixel (size cannot be defined in percentage because this will generate an infinite loop as the child will need the parent size and the parent will need the child size)
You can find a demo here: <Playground id="#GL5SIM" title="Adaptative size Example" description="Simple example showing how to use adaptative sizing in your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI41.jpg"/>

### Make your controls non-overlapping

If you link your control with a mesh, the control will follow the mesh and the position of the control will be automatically changed relative to the position of the linked mesh. Sometimes your controls will be overlapped by each other.

To solve this problem you can use the `moveToNonOverlappedPosition` method of the `AdvancedDynamicTexture` class.
First you need to set a value for the `overlapGroup` property on your control. If you leave it `undefined` the control will be not touched during the execution of the `moveToNoveOverlappedPosition` method. Second you need to call the `moveToNonOverlappedPosition` method of the `AdvancedDynamicTexture` class manually each frame, for example in the render loop or using an observer. The `onBeginRenderObservable` of the `AdvancedDynamicTexture` is a good place.

Please refer to this playground with detailed comments in the code on how to use this functionality: <Playground id="#BMW0VQ#3" title="Non-overlapping controls Example" description="Simple example showing how to make your mesh linked controls non-overlapping." />

Forum: https://forum.babylonjs.com/t/non-overlapping-gui-linked-controls/24610

### Clipping

By default containers will clip their children to their bounds. If you want to clip a control's contents and its children, you should set

```javascript
container.clipChildren = false;
container.clipContent = true;
```

Please note that not clipping children may generate issues with `adt.useInvalidateRectOptimization` so it is recommended to turn this optimization off if you want to use unclipped children.

You can find a demo here: <Playground id="#LBF8S2#38" title="Clipping Example" description="Simple example showing how to use clipping in your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI42.jpg"/>

### Rectangle

The Rectangle is a rectangular container with the following properties:

| Property     | Type   | Default | Comments                                                        |
| ------------ | ------ | ------- | --------------------------------------------------------------- |
| thickness    | number | 1       | Thickness of the border                                         |
| cornerRadius | number | 0       | Size in pixel of each corner. Used to create rounded rectangles |

Here is an example of a rectangle control: <Playground id="#XCPP9Y#8" title="Rectangle Example" description="Simple example showing how to add a Rectangle control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI43.jpg"/>

### Ellipse

The Ellipse is a ellipsoidal container with the following properties:

| Property  | Type   | Default | Comments                |
| --------- | ------ | ------- | ----------------------- |
| thickness | number | 1       | Thickness of the border |

Here is an example of an ellipse control: <Playground id="#XCPP9Y#10" title="Ellipse Example" description="Simple example showing how to add an Ellipse control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI44.jpg"/>

### StackPanel

The StackPanel is a control which stacks its children based on its orientation (can be horizontal or vertical).
All children must have a defined width or height (depending on the orientation) in **pixels** (A warning will be written to the console if this is not true. This warning can be turned off with `panel.ignoreLayoutWarnings = true`).

If the panel is vertical, its height will depend on the children, while its width will be 100% of the parent, unless specified. If the panel is horizontal, its width will depend on the children, while its height will be 100% of the parent, unless specified.

| Property   | Type    | Default | Comments                 |
| ---------- | ------- | ------- | ------------------------ |
| isVertical | boolean | true    | Orientation of the panel |

Here is an example of a StackPanel: <Playground id="#XCPP9Y#11" title="StackPanel Example" description="Simple example showing how to add a StackPanel control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI45.jpg"/>

### ScrollViewer

Due to its rich feature set, the ScrollViewer has its own dedicated page right [here](/features/featuresDeepDive/gui/scrollViewer).

### Grid

The Grid is a control which defines a set of rows and columns and allows children to specify which cell they want to belong to:

```javascript
const grid = new BABYLON.GUI.Grid();
grid.addColumnDefinition(100, true);
grid.addColumnDefinition(0.5);
grid.addColumnDefinition(0.5);
grid.addColumnDefinition(100, true);
grid.addRowDefinition(0.5);
grid.addRowDefinition(0.5);

// This rect will be on first row and second column
const rect = new BABYLON.GUI.Rectangle();
rect.background = "green";
rect.thickness = 0;
grid.addControl(rect, 0, 1);

// This rect will be on second row and third column
rect = new BABYLON.GUI.Rectangle();
rect.background = "red";
rect.thickness = 0;
grid.addControl(rect, 1, 2);
```

You can define rows and columns with the following functions:

- addColumnDefinition(width, isPixel): Use this function to create a new column. Width can be between 0 and 1 if isPixel is false (percentage mode then) or contains an actual width if isPixel is true
- addRowDefinition(height, isPixel): Use this function to create a new row. Height can be between 0 and 1 if isPixel is false (percentage mode then) or contains an actual width if isPixel is true

Here is an example of a grid made of 4 columns where the first and the last will have a width of 50px and the second and third will each have 50% of the remaining space:

```javascript
grid.addColumnDefinition(100, true);
grid.addColumnDefinition(0.5);
grid.addColumnDefinition(0.5);
grid.addColumnDefinition(100, true);
```

You can update or delete columns and rows with the following functions:

- setRowDefinition(index, height, isPixel): Update a row definition
- setColumnDefinition(index, width, isPixel): Update a column definition
- removeRowDefinition(index): Remove a row definition at specified index
- removeColumnDefinition(index): Remove a column definition at specified index

Two properties can also help you getting rows and columns count:

- rowCount: Will give you the number of rows
- columnCount: Will give you the number of columns

To add a control in a grid, you have to specify the row and column indexes:

```javascript
grid.addControl(control, 1, 2); // 2nd row, thrid column
```

You can get the list of controls in a specific cell by calling:

```javascript
const controls = grid.getChildrenAt(2, 3);
```

Here is an example of a Grid: <Playground id="#KX33X8#1" title="Grid Example" description="Simple example showing how to add a Grid control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI46.jpg"/>

## Styles

Starting with Babylon.js v3.3, you can create a style object that will be used to share configuration across controls. To do so, you can use this code:

```javascript
const style = advancedTexture.createStyle();
style.fontSize = 24;
style.fontStyle = "italic";
style.fontFamily = "Verdana";
```

Then affect the style to a control:

```javascript
textControl.style = style;
```

Here is the lsit of properties supported by styles so far:

- fontSize
- fontStyle
- fontFamily
- fontWeight

Please note that if a control has a style, then the style values are used instead of values directly defined on the control itself.

You can find a demo here: <Playground id="#5N4JIS" title="Styles Example" description="Simple example showing how to add a Styles control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI47.jpg"/>

## Helpers

To reduce the amount of code required to achieve frequent tasks you can use the following helpers:

- `BABYLON.GUI.Control.AddHeader(control, text, size, options { isHorizontal, controlFirst })`: This function will create a StackPanel (horizontal or vertical based on options) and will add your control plus a TextBlock in it. Options can also be used to specify if the control is inserted first of after the header. Depending on the orientation, size will either specify the widht or the height used for the TextBlock.

- `BABYLON.GUI.Checkbox.AddCheckBoxWithHeader(title, onValueChanged)`: This function will create a horizontal StackPanel and will add a checkbox alongside a text block displaying the `title` property. `onValueChanged` defines the callback to call when checkbox state changes.

- `BABYLON.GUI.RadioButton.AddRadioButtonWithHeader(title, group, isChecked, onValueChanged)`: This function will create a horizontal StackPanel and will add a radio button (set with specified group and isChecked parameters) alongside a text block displaying the `title` property. `onValueChanged` defines the callback to call when radio button state changes.

## Cloning

You can clone individual controls by using the `clone` method. Its argument is an optional AdvancedDynamicTexture that will host the cloned control. This is so you can clone the control to a different ADT. After cloning the control, you still have to add it to the ADT, like this:

```javascript
const cloned = control.clone();
adt.addControl(cloned);
```

An example can be seen here: <Playground id="#1W1JS5" title="Cloning a control" description="Playground showing how to clone a control"/>

You can also clone the entire ADT by using the same method: <Playground id="#XCPP9Y#18083" title="Cloning the entire ADT" description="Playground showing how to clone an ADT"/>

## GUI and postprocesses

### LayerMask

In order to not apply postprocesses to your GUI, you will have to use a multi-cameras approach: one for your main scene and one for your GUI.

You can find an implementation example here: <Playground id="#U9AC0N#58" title="LayerMask Example" description="Simple example showing how to add a LayerMask control to your scene." image="/img/playgroundsAndNMEs/divingDeeperBabylonGUI48.jpg"/>

The key point is to use the camera.layerMask property to isolate your GUI:

```javascript
const camera2 = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
camera2.layerMask = 2;

// GUI - simply set advancedTexture layerMask to 2
const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
advancedTexture.layer.layerMask = 2;
```

Then all meshes of your main scene will have a different layerMask attached to main camera:

```javascript
const camera1 = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
camera1.layerMask = 1;

myMesh.layerMask = 1;
```

### Multi-scenes

The other option will be to use a multi scene approach with a renderloop defined like this:

```javascript
guiScene.autoClear = false;
engine.runRenderLoop(function () {
  mainScene.render();
  guiScene.render();
});
```

In this case the `guiScene` will host your GUI and the `mainScene` will host your scene with your postprocesses.

## GUI and HighDPI Displays

If you are viewing the scene on a high dpi (or "retina") device (such as many mobile devices, or some laptops), you may notice that text on the UI appears "blurry" or "pixelated". This is because, starting in Babylon.js v2.6, the engine no longer defaults to adapting to the device pixel ratio. This was done for performance reasons on mobile devices; turning it on can have a large impact on performance. To improve the rendering of text (at the cost of performance), you will need to enable the `adaptToDeviceRatio` option when constructing your engine.

Please see [Turning AdaptToDeviceRatio Off/On](/features/featuresDeepDive/scene/optimize_your_scene#turning-adapttodeviceratio-offon) for more information on the trade offs.
