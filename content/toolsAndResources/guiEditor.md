---
title: The GUI Editor
image:
description: Learn all about the simple and easy GUI Editor in Babylon.js.
keywords: babylon.js, tools, resources, gui, gui editor
further-reading:
video-overview:
video-content:
---

<img src="/img/tools/guiEditor/overview.jpg" title="Babylon.js GUI Editor"/>

## Creating GUIs With Ease

Introduced in Babylon.js 5.0, the GUI Editor is a visual editor for building complex and beautiful graphical user interfaces. Traditionally, Babylon GUIs has to be constructed using code, which could be a tedious and confusing process. The GUI Editor lets you see the interface as you're assembling it, and makes it easy to manipulate all the parameters of each control.

You can access the GUI Editor here: https://gui.babylonjs.com/. The GUI editor can also be opened in a pop-up window from the inspector, allowing you to edit a GUI inside a scene and see your changes propagate back instantly!

This document will walk you through the editor and its capabilities and should help you quickly start creating your own GUIs. If you're not familiar with the GUI system in Babylon.js and would like to learn more, you can read all about it here: [Babylon GUI Documentation](/features/featuresDeepDive/gui/gui)

<Youtube id="9VXgZ_af-nE"/>

## Getting Familiar With The Layout

Let's start by familiarizing ourselves with different parts of the editor.

### Header Bar

<img src="/img/tools/guiEditor/commandBar.jpg" title="GUI Editor Command Bar"/>

The Header Bar provides several handy items to help you navigate and manage your GUI creations.

#### Hamburger Menu

<img src="/img/tools/guiEditor/hamburgerMenu.jpg" title="GUI Editor Hamburger Menu"/>

The hamburger menu provies some basic helpful scene management options, including saving and loading your progress locally, saving and loading your progress to the snippet server, and a quick 'help' link to access the Babylon.js GUI documentation.

#### Select (S)

<img src="/img/tools/guiEditor/select.jpg" title="GUI Editor Select"/>

The select button allows you to select different GUI controls within your scene.

#### Pan (P)

<img src="/img/tools/guiEditor/pan.jpg" title="GUI Editor Move"/>

The move button allows you to pan around the GUI by clicking and dragging. You can also use the middle mouse button, or hold space and drag, to pan around your GUI.

#### Zoom (Z)

<img src="/img/tools/guiEditor/zoom.jpg" title="GUI Editor Zoom"/>

The zoom button allows you to click on the canvas and drag to zoom in. You can also hold ALT+click to zoom out.

#### Fit To Window (F)

<img src="/img/tools/guiEditor/fitToWindow.jpg" title="GUI Editor Fit To Window"/>

When pressed, the Fit To Window button will snap the zoom and panning back to the starting position, where the entire canvas can be seen. If you have any controls selected, Fit To Window will crop the viewport around those controls.

#### Toggle Guides

<img src="/img/tools/guiEditor/toggleGuides.jpg" title="GUI Editor Toggle Guides"/>

The Toggle Guides button will display boundary lines for all of the GUI elements in your scene.

<img src="/img/tools/guiEditor/toggleGuidesVisual.jpg" title="GUI Editor Toggle Guides Example"/>

#### Artboard Color

Allows you to change the background color in the region outside of the canvas.

#### Responsiveness and Resolution

You can either specify a specific resolution for your canvas in pixels, or you can turn on responsive mode, which lets you easily swap between common resolutions such as mobile and desktop. Responsiveness is an editor-only concept, it does not affect the exported GUI.

<img src="/img/tools/guiEditor/resolutionResponsive.jpg" title="GUI Editor Responsive Resolution"/>

####

### Hierarchy Panel

<img src="/img/tools/guiEditor/layersPanel.jpg" title="GUI Editor Layers Panel"/>

The Hierarchy Panel is an organized list of all of the GUI controls that you've added to the canvas. You can select controls from this list as well as click and drag to parent and unparent them.

<img src="/img/tools/guiEditor/parenting.jpg" title="GUI Editor Parenting"/>

The order of controls listed in the Layers Panel reflects the z-order of the scene with the elments at the top of the list having a z-order that will render them on top of elements towards the bottom of the list.

If a control is placed behind another control in the scene, and it has a lower z-order, the only way to select it is from the hierarchy.

The 'eye' icon will show/hide controls on the canvas.

<img src="/img/tools/guiEditor/showHide.jpg" title="GUI Editor Show Hide"/>

### Controls Bar

<img src="/img/tools/guiEditor/toolsBar.jpg" title="GUI Editor Tools Bar"/>

The Controls Bar allows you to create GUI controls, such as a text box, rectangle, grid, etc. Each icon in this bar can be clicked on to add a specific GUI control to your canvas. You can also drag and drop these icons into either the canvas or the hierarchy tree to add it to the scene.

If you'd like to see a full list of supported GUI controls in the editor, [click here.](#supported-controls)

### Canvas

<img src="/img/tools/guiEditor/canvas.jpg" title="GUI Editor Canvas"/>

The Canvas is the main play area of the tool. The canvas contains the artboard where you can add controls, select controls, and click and drag controls to move them around. This panel represents a WYSIWYG (what you see is what you get) experience to how GUIs will show up in Babylon Scenes.

The checkerboard area reflects the content that will actually be visible in your scene when you load the GUI in. Note that controls can be moved outside of that region, which may be helpful if, for example, your UI has components that animate on and off-screen.

### Handy Keyboard Shortcuts

There are several handy keyboard shortcuts that you can utilize in the GUI Editor.

#### General Navigation:

- S = Select Mode
- P = Pan Mode
- Z = Zoom Mode
- F = Fit to Window
- G = Toggle Outlines
- CTRL+A = Select All

#### With a GUI Control Selected:

- CTRL+C = Copy
- CTRL+V = Paste
- CTRL+X = Cut
- Delete/Backspace = Delete

### Control Properties Panel

<img src="/img/tools/guiEditor/propertiesPanel.jpg" title="GUI Editor Properties Panel"/>

The Properties Panel will change based on which controls are selected selected to reflect the properties specific to those controls. This is where you'll find all of the properties and can fully customize each individual element of your overall GUI.

For example here is how to change the name of a GUI.

<img src="/img/tools/guiEditor/changeName.jpg" title="GUI Editor Change Name"/>

For properties which can be expressed in either pixels or percentage values, you can click on the unit button next to the input to toggle between unit types. The existing value will be converted into the equivalent value in the other unit.

<img src="/img/tools/guiEditor/changeUnits.jpg" title="GUI Editor Change Units"/>

Note: While using the GUI Editor to create a GUI and modify its properties, these properties can later be changed in the Babylon.js scene code. So you have full control over all of the GUI Control properties at creation time as well as runtime!

### Special Properties for Grid Control

Grids are a powerful tool for building complex UI layouts. Grids are helpful for setting up the foundation of your design. Just like in code, in the GUI Editor you can define your grid's row and column definitions.
You can add and remove rows and columns, as well as modify the sizes using either pixels or percent.

<img src="/img/tools/guiEditor/grid.jpg" title="GUI Editor Grid Properties"/>

You can then add them to the grid through parenting in the layers panel. Once parented, you can modify a control's grid cell by selecting the control and editing the newly added property at the bottom of the Properties Panel.

<img src="/img/tools/guiEditor/cell.jpg" title="GUI Editor Changing Control's Grid Cell"/>

Note: the zOrder of each control is determined by it's position in the hierarchy tree, and can be reordered with normal dragging regardless of which grid cell it belongs to.

### Saving GUIs Out Of the Editor

You can save your GUI creations from the Editor in two different ways, locally or on the Babylon.js Snippet Server.

#### Saving Locally

Saving locally will download a .JSON object of your GUI to your local machine. This can then be either loaded back into the editor later for future use, or can be hosted somewhere of your choosing and then loaded directly into your Babylon scene. [See Loading GUIs Into The Playground](#loading-locally)

You can save locally by selecting the 'Save' button in the hamburger menu:
<img src="/img/tools/guiEditor/saveLocal1.jpg" title="GUI Editor Save Local 1"/>

#### Saving To The Snippet Server

Just like all Babylon tools, you have the option of saving your GUI creation directly to the Babylon.js snippet server. Saving in this manner saves the .json object to a Babylon.js server and provides a simple URL hash back for you to reference in the future. You can then load your GUI back into the editor by using this unique hash, or you can use the hash to load your GUI directly into the Babylon scene. [See Loading GUIs Into The Playground](#load-from-snippet-server). Saving to the snippet server will also update the browser's URL to point to that snippet (e.g., gui.babylonjs.com/#aaaaaa)

You can save to the snippet server by selecting the 'Save To Snippet' button in the hamburger menu:
<img src="/img/tools/guiEditor/saveSnippet1.jpg" title="GUI Editor Save Snippet 1"/>

### Loading GUIs Into the Editor

You can load your GUI creations into the Editor in two different ways, locally or from the Babylon.js Snippet Server.

#### Loading locally

Loading locally will prompt you to upload a .JSON object of your GUI into the Editor.

You can load locally by selecting the 'Load' button in the hamburger menu:
<img src="/img/tools/guiEditor/loadLocal1.jpg" title="GUI Editor Load Local 1"/>

#### Loading From The Snippet Server

Loading from the snippet server will take a unique hash of a previously saved GUI and load it into the the Editor.

You can load from the snippet server by selecting the 'Load From Snippet Server' button in the hamburger menu:
<img src="/img/tools/guiEditor/loadSnippet1.jpg" title="GUI Editor Load Snippet 1"/>

### Using GUIs From The Editor In Your Scene

It is very easy to load your saved GUIs into your Babylon.js scene and modify them. Here are a few handy examples:

#### Load From .JSON Object

You can load a GUI into your Babylon scene from a saved .JSON file somewhere on the web like this:

```javascript
let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
let loadedGUI = await advancedTexture.parseFromURLAsync("https://doc.babylonjs.com/examples/ColorPickerGui.json");
```

<Playground id="#SWI883" title="Load a GUI from a .json Object" description="Simple example that shows how to load a GUI into your scene from a .json object."/>

#### Load From Snippet Server

You can also load a GUI into your Babylon scene from the Snippet Server like this:

```javascript
let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
let loadedGUI = await advancedTexture.parseFromSnippetAsync("#MMWSUI");
```

<Playground id="#4RTUCB#1" title="Load a GUI From The Snippet Server" description="Simple example that shows how to load a GUI into your scene from the snippet server."/>

#### Load in Fullscreen Mode

You can load your saved GUI as a fullscreen GUI that's overlayed on top of your entire scene like this:

```javascript
let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
let loadedGUI = await advancedTexture.parseFromSnippetAsync("#MMWSUI");
```

<Playground id="#4RTUCB#1" title="Load a GUI Into Fullscreen Mode" description="Simple example that shows how to load a GUI into fullscreen mode."/>

Further Information about fullscreen GUIs can be found here: [Fullscreen GUIs](/features/featuresDeepDive/gui/gui#fullscreen-mode)

#### Load in Texture Mode

You can also load a saved GUI as a texture that can be used like any other texture in your scene. Here's an example of using a loaded GUI as a texture for the material of a mesh:

```javascript
let screenUI = BABYLON.GUI.AdvancedDynamicTexture.CreateForMeshTexture(device.screen, 2048, 2048, true, false);
screenUI.parseFromSnippetAsync("#WFL50L");
```

<Playground id="#H896c7#13" title="Load a GUI Into Texture Mode" description="Simple example that shows how to load a GUI into texture mode and project it onto a mesh."/>

Further information about GUIs as in-scene textures can be found here: [GUIs as a Texture](/features/featuresDeepDive/gui/gui#texture-mode)

#### Changing GUI Control Properties In Your Scene

After loading a saved GUI into your scene, you can easily access the properties of your GUI Controls.

You can access an individual control by name like this:

```javascript
let backgroundBox = advancedTexture.getControlByName("BackgroundBox");
backgroundBox.background = "blue";
```

<Playground id="#JSF3QM" title="Load a GUI And Modify GUI Control Properties" description="Simple example that shows how to load a GUI and modify GUI controls."/>

A more sophisticated example can be found here:

<Playground id="#0CRLP8#13" title="Game Menu Demo" description="A game menu built using the GUI editor which demonstrates how tab navigation can be implemented." />

#### Playground Templates

You can also find quick access to the common lines of code needed to load GUIs into your scene, through the [playground templates.](/toolsAndResources/thePlayground/pgTemplates)

### Supported Controls

Here is a list of supported GUI controls available in the GUI Editor:

| Icon                                                             | Control Name     | Further Information                                                                              |
| ---------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| ![rectangle](/img/tools/guiEditor/rectangleIcon.jpg)             | Rectangle        | [Rectangle Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#rectangle)              |
| ![ellipse](/img/tools/guiEditor/ellipseIcon.jpg)                 | Ellipse          | [Ellipse Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#ellipse)                  |
| ![stackpanel](/img/tools/guiEditor/stackPanelIcon.jpg)           | Stack Panel      | [Stack Panel Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#stackpanel)           |
| ![grid](/img/tools/guiEditor/gridIcon.jpg)                       | Grid             | [Grid Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#grid)                        |
| ![scrollviewer](/img/tools/guiEditor/scrollViewerIcon.jpg)       | Scroll Viewer    | [Scroll Viewer Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#scrollviewer)       |
| ![line](/img/tools/guiEditor/lineIcon.jpg)                       | Line             | [Line Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#line)                        |
| ![textblock](/img/tools/guiEditor/textIcon.jpg)                  | Text Block       | [Text Block Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#textblock)             |
| ![inputText](/img/tools/guiEditor/inputTextIcon.jpg)             | Input Text       | [Input Text Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#inputtext)             |
| ![inputPassword](/img/tools/guiEditor/inputPasswordIcon.jpg)     | Input Password   | [Input Password Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#inputpassword)     |
| ![image](/img/tools/guiEditor/imageIcon.jpg)                     | Image            | [Image Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#image)                      |
| ![displayGrid](/img/tools/guiEditor/displayGridIcon.jpg)         | Display Grid     | [Display Grid Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#displaygrid)         |
| ![textButton](/img/tools/guiEditor/textButtonIcon.jpg)           | Text Button      | [A Button with a Text Block as a Child] (https://doc.babylonjs.com/divingDeeper/gui/gui#button)  |
| ![checkbox](/img/tools/guiEditor/checkBoxIcon.jpg)               | Checkbox         | [Checkbox Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#checkbox)                |
| ![radioButton](/img/tools/guiEditor/radioIcon.jpg)               | Radio Button     | [Radio Button Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#radiobutton)         |
| ![slider](/img/tools/guiEditor/sliderIcon.jpg)                   | Slider           | [Slider Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#slider)                    |
| ![virtualkeyboard](/img/tools/guiEditor/virtualKeyboardIcon.jpg) | Virtual Keyboard | [Virtual Keyboard Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#virtualkeyboard) |
| ![colorpicker](/img/tools/guiEditor/colorPickerIcon.jpg)         | Color Picker     | [Color Picker](https://doc.babylonjs.com/divingDeeper/gui/gui#colorpicker)                       |

### Demos

Check out additional demos here:
<Playground id="#5JEP1H" title="Full Color Picker Demo" description="More advance example that shows how to load a GUI and modify GUI controls."/>
