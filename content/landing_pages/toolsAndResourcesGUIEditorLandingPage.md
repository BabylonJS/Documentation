---
title: The GUI Editor
image: 
description: Learn all about the simple and easy GUI Editor in Babylon.js.
keywords: babylon.js, tools, resources, gui, gui editor
further-reading:
video-overview: 
    - title: Welcome to the GUI Editor
    url: https://youtu.be/9VXgZ_af-nE
video-content:
---

<img src="/img/tools/guiEditor/overview.jpg" title="Babylon.js GUI Editor"/>

## Creating GUIs With Ease

Introduced in Babylon.js 5.0, the GUI Editor is an incredibly handy tool that helps you create complex and beautiful graphical user interfaces with a simple, user-friendly tool. The GUI Editor was created with one simple goal in mind, to make it faster and easier to create fantastic GUIs for your Babylon.js experiences.

You can access the GUI Editor here: https://gui.babylonjs.com/

This document will walk you through the editor and its capabilities and should help you quickly start creating your own GUIs. If you're not familiar with the GUI system in Babylon.js and would like to learn more, you can read all about it here: [Babylon GUI Documentation](/divingDeeper/gui/gui)

## Getting Familiar With The Layout

Let's start by familiarizing ourselves with different parts of the editor.

### ToolBar

<img src="/img/tools/guiEditor/commandBar.jpg" title="GUI Editor Command Bar"/>

The Command Bar provides a bunch of handy items to help you navigate and manage your GUI creations.

#### Hamburger Menu

<img src="/img/tools/guiEditor/hamburgerMenu.jpg" title="GUI Editor Hamburger Menu"/>

The hamburger menu provies some basic helpful scene management options, including saving and loading your progress locally, saving and loading your progress to the snippet server, and a quick 'help' link to access the Babylon.js GUI documentation.

#### Select

<img src="/img/tools/guiEditor/select.jpg" title="GUI Editor Select"/>

The select button allows you to select different GUI controls within your scene.

#### Move

<img src="/img/tools/guiEditor/move.jpg" title="GUI Editor Move"/>

The move button allows you to move a currently selected GUI with the mouse.

#### Pan

<img src="/img/tools/guiEditor/pan.jpg" title="GUI Editor Pan"/>

The pan button allows you to click on the canvas and drag to move it around.

#### Zoom

<img src="/img/tools/guiEditor/zoom.jpg" title="GUI Editor Zoom"/>

The zoom button allows you to click on the canvas and drag to zoom in. You can also hold ALT+click to zoom out.

#### Fit To Window

<img src="/img/tools/guiEditor/fitToWindow.jpg" title="GUI Editor Fit To Window"/>

When pressed, the Fit To Window button will snap the zoom and panning back to the starting position, where the entire canvas can be seen.

#### Toggle Guides

<img src="/img/tools/guiEditor/toggleGuides.jpg" title="GUI Editor Toggle Guides"/>

The Toggle Guides button will display boundary lines for all of the GUI elements in your scene.

<img src="/img/tools/guiEditor/toggleGuidesVisual.jpg" title="GUI Editor Toggle Guides Example"/>

### Layers Panel

<img src="/img/tools/guiEditor/layersPanel.jpg" title="GUI Editor Layers Panel"/>

The Layers Panel is an organized list of all of the GUI controls that you've added to the canvas. You can select controls from this list as well as click and drag to parent and unparent them.

<img src="/img/tools/guiEditor/parenting.jpg" title="GUI Editor Parenting"/>

The order of controls listed in the Layers Panel reflects the z-order of the scene with the elments at the top of the list having a z-order that will render them on top of elements towards the bottom of the list.

The 'eye' icon will show/hide controls on the canvas.

<img src="/img/tools/guiEditor/showHide.jpg" title="GUI Editor Show Hide"/>

### Controls Bar

<img src="/img/tools/guiEditor/toolsBar.jpg" title="GUI Editor Tools Bar"/>

The Controls Bar is where you'll find access to individual Babylon.js GUI controls, such as a text box, rectangle, grid, etc. Each icon in this bar can be clicked on to add a specific GUI control to your canvas.

If you'd like to see a full list of supported GUI controls in the editor, [click here.](#supported-controls)

### Canvas

<img src="/img/tools/guiEditor/canvas.jpg" title="GUI Editor Canvas"/>

The Canvas is the main play area of the tool. The canvas contains artboards where you can add gui controls, select controls, and click and drag controls to move them around. This panel represents a WYSIWYG (what you see is what you get) experience to how GUIs will show up in Babylon Scenes.

### Handy Keyboard Keys

Here are a few handy keyboard keys and shortcuts that you can utilize in the GUI Editor.

#### General Navigation:
S = Select Mode
M = Move Mode
P = Pan Mode
Z = Zoom Mode
F = Fit to Window
G = Toggle Outlines
CTRL+A = Select All

#### With a GUI Control Selected:
CTRL+C = Copy
CTRL+V = Paste
Delete = Delete

#### When in Zoom Mode:
ALT + Click and drag to zoom out

### General Property Panel

<img src="/img/tools/guiEditor/generalPropertiesPanel.jpg" title="GUI Editor General Properties Panel"/>

The Properties Panel controls different properties for controls and the editor. For example you can change your canvas size here as well as toggle between responsive and non-responsive mode.
"Responsive" is typically desired for fullscreen GUI layouts that will be used in multiple screen sizes. In this mode mouse movement and sizes will default to "%" unless manually specified otherwise. 

### Control Properties Panel

<img src="/img/tools/guiEditor/propertiesPanel.jpg" title="GUI Editor Properties Panel"/>

The Properties Panel will change when a control is selected. This is where you'll find all of the properties and can fully customize each individual element of your overall GUI.

For example here is how to change the name of a GUI.

<img src="/img/tools/guiEditor/changeName.jpg" title="GUI Editor Change Name"/>

Note: While using the GUI Editor to create a GUI and modify its properties, these properties can later be changed in the Babylon.js scene code. So you have full control over all of the GUI Control properties at creation time as well as runtime!

The Properties Panel is also where you'll find buttons to copy and delete buttons for selected controls.

<img src="/img/tools/guiEditor/copyDelete.jpg" title="GUI Editor Copy Delete"/>

### Special Properties for Grid Control

One of the most common controls used in creating GUI layouts is Grid. Grids are helpful for setting up the foundation of your deisgn. Just like in code you can define your Grid row and column definitions.
You can add and remove rows and columns, as well as modify the sizes using either pixels or percent.

<img src="/img/tools/guiEditor/grid.jpg" title="GUI Editor Grid Properties"/>

You can then add them to the grid through parenting in the layers panel. Once parented, you can modify a control's grid cell by selecting the control and editing the newly added propety at the bottom of the Properties Panel.

<img src="/img/tools/guiEditor/cell.jpg" title="GUI Editor Changing Control's Grid Cell"/>

Note: zOrder for each GUI will be reflected in the layers panel and can be reordered with normal dragging regardless of the grid cell. 

### Saving GUIs Out Of the Editor

You can save your GUI creations from the Editor in two different ways, locally or on the Babylon.js Snippet Server. 

#### Saving Locally

Saving locally will download a .JSON object of your GUI, locally. This can then be either loaded back into the editor later for future use, OR can be hosted somewhere of your choosing and then loaded directly into your Babylon scene. [See Loading GUIs Into The Playground](#loading-locally)

You can save locally by selecting the 'save' button in the hamburger menu:
<img src="/img/tools/guiEditor/saveLocal1.jpg" title="GUI Editor Save Local 1"/>

Or by selecting the 'save' button in the Properties Panel when nothing is selected.
<img src="/img/tools/guiEditor/saveLocal2.jpg" title="GUI Editor Save Local 2"/>

#### Saving To The Snippet Server

Just like all Babylon tools, you have the option of saving your GUI creation directly to the Babylon.js snippet server. Saving in this manner saves the .json object to a Babylon.js server and provides a simple url hash back for you to reference in the future. You can then load your GUI back into the editor by using this unique hash, OR you can use the hash to load your GUI directly into the Babylon scene. [See Loading GUIs Into The Playground](#load-from-snippet-server)

You can save to the snippet server by selecting the 'save to snippet' button in the hamburger menu:
<img src="/img/tools/guiEditor/saveSnippet1.jpg" title="GUI Editor Save Snippet 1"/>

Or by selecting the 'save to snippet server' button in the Properties Panel when nothing is selected.
<img src="/img/tools/guiEditor/saveSnippet2.jpg" title="GUI Editor Save Snippet 2"/>

### Loading GUIs Into the Editor

You can load your GUI creations into the Editor in two different ways, locally or from the Babylon.js Snippet Server. 

#### Loading locally

Loading locally will prompt you to upload a .JSON object of your GUI into the Editor. 

You can load locally by selecting the 'load' button in the hamburger menu:
<img src="/img/tools/guiEditor/loadLocal1.jpg" title="GUI Editor Load Local 1"/>

Or by selecting the 'load' button in the Properties Panel when nothing is selected.
<img src="/img/tools/guiEditor/loadLocal2.jpg" title="GUI Editor Load Local 2"/>

#### Loading From The Snippet Server

Loading from the snippet server will take a unique hash of a previously saved GUI and load it into the the Editor. 

You can load from the snippet server by selecting the 'load from snippet server' button in the hamburger menu:
<img src="/img/tools/guiEditor/loadSnippet1.jpg" title="GUI Editor Load Snippet 1"/>

Or by selecting the 'load from snippet server' button in the Properties Panel when nothing is selected.
<img src="/img/tools/guiEditor/loadSnippet2.jpg" title="GUI Editor Load Snippet 2"/>

### Using GUIs From The Editor In Your Scene
It is very easy to load your saved GUIs into your Babylon.js Scene and modify them. Here are a few handy examples:

#### Load From .JSON Object
You can load a GUI into your Babylon scene from a saved .JSON object like this:

```javascript
let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);
let loadedGUI = await advancedTexture.parseFromURLAsync("https://doc.babylonjs.com/examples/ColorPickerGui.json");
```

<Playground id="#SWI883" title="Load a GUI from a .json Object" description="Simple example that shows how to load a GUI into your scene from a .json object."/>

#### Load From Snippet Server
You can also load a GUI into your Babylon scene from the Snipper Server like this:

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

Further Information about fullscreen GUIs can be found here: [Fullscreen GUIs](/divingDeeper/gui/gui#fullscreen-mode)

#### Load in Texture Mode
You can also load a saved GUI as a texture that can be used like any other texture in your scene. Here's an example of using a loaded GUI as a texture for the material of a mesh:

```javascript
let screenUI = BABYLON.GUI.AdvancedDynamicTexture.CreateForMeshTexture(device.screen, 2048, 2048, true, false);
screenUI.parseFromSnippetAsync("#WFL50L");
```

<Playground id="#H896c7#13" title="Load a GUI Into Texture Mode" description="Simple example that shows how to load a GUI into texture mode and project it onto a mesh."/>

Further Information about GUIs as in-scene textures can be found here: [GUIs as a Texture](/divingDeeper/gui/gui#texture-mode)

#### Changing GUI Control Properties In Your Scene
After loading a saved GUI into your scene, you can easily access the properties of your GUI Controls.

You can access an individual control by name  like this:

```javascript
let backgroundBox = advancedTexture.getControlByName("BackgroundBox");
backgroundBox.background = "blue";
```

<Playground id="#JSF3QM" title="Load a GUI And Modify GUI Control Properties" description="Simple example that shows how to load a GUI and modify GUI controls."/>

#### Playground Templates
You can also find quick access to the common lines of code needed to load GUIs into your scene, through the [playground templates.](/toolsAndResources/tools/playground/pgTemplates)

### Supported Controls
Here is a list of supported GUI controls available in the GUI Editor:

Icon | Control Name | Further Information
---|---|---|
![rectangle](/img/tools/guiEditor/rectangleIcon.jpg) | Rectangle | [Rectangle Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#rectangle)
![ellipse](/img/tools/guiEditor/ellipseIcon.jpg) | Ellipse | [Ellipse Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#ellipse)
![stackpanel](/img/tools/guiEditor/stackPanelIcon.jpg) | Stack Panel | [Stack Panel Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#stackpanel)
![grid](/img/tools/guiEditor/gridIcon.jpg) | Grid | [Grid Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#grid)
![scrollviewer](/img/tools/guiEditor/scrollViewerIcon.jpg) | Scroll Viewer | [Scroll Viewer Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#scrollviewer)
![line](/img/tools/guiEditor/lineIcon.jpg) | Line | [Line Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#line)
![textblock](/img/tools/guiEditor/textIcon.jpg) | Text Block | [Text Block Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#textblock)
![inputText](/img/tools/guiEditor/inputTextIcon.jpg) | Input Text | [Input Text Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#inputtext)
![inputPassword](/img/tools/guiEditor/inputPasswordIcon.jpg) | Input Password | [Input Password Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#inputpassword)
![image](/img/tools/guiEditor/imageIcon.jpg) | Image | [Image Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#image)
![displayGrid](/img/tools/guiEditor/displayGridIcon.jpg) | Display Grid | [Display Grid Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#displaygrid)
![textButton](/img/tools/guiEditor/textButtonIcon.jpg) | Text Button | [A Button with a Text Block as a Child] (https://doc.babylonjs.com/divingDeeper/gui/gui#button)
![checkbox](/img/tools/guiEditor/checkBoxIcon.jpg) | Checkbox | [Checkbox Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#checkbox)
![radioButton](/img/tools/guiEditor/radioIcon.jpg) | Radio Button | [Radio Button Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#radiobutton)
![slider](/img/tools/guiEditor/sliderIcon.jpg) | Slider | [Slider Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#slider)
![virtualkeyboard](/img/tools/guiEditor/virtualKeyboardIcon.jpg) | Virtual Keyboard | [Virtual Keyboard Documentation](https://doc.babylonjs.com/divingDeeper/gui/gui#virtualkeyboard)
![colorpicker](/img/tools/guiEditor/colorPickerIcon.jpg) | Color Picker | [Color Picker](https://doc.babylonjs.com/divingDeeper/gui/gui#colorpicker)


### Demos
Check out additional demos here:
<Playground id="#5JEP1H" title="Full Color Picker Demo" description="More advance example that shows how to load a GUI and modify GUI controls."/>

