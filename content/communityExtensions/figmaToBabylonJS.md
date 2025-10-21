---
title: Figma to BabylonJS
image: /img/extensions/FigmaToBabylonJS/FigmaToBabylonJS.png
description: FigmaToBabylonJS is a Figma plugin which allows you to export Figma designs to BabylonJS GUI .json files.
keywords: extensions, Figma, GUI, BabylonGUI, Design, UI, plugin
further-reading:
video-overview: hFlrMNi671E
video-content:

---

# Figma to BabylonJS
![Screenshot showing the figma right click menu on the Plugins option](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS.png)

## Introduction

FigmaToBabylonJS is a Figma plugin which allows you to export/serialize your Figma designs to BabylonJS GUI controls using a headerless Babylon-gui environment running inside the plugin to serialize your figma designs into .json files. These can be parsed into a Fullscreen UI advanced dynamic texture (https://doc.babylonjs.com/features/featuresDeepDive/gui/gui#advanceddynamictexture) or as a single gui control.

This plugin goal is to quickly and easily export Figma designs to BabylonJS GUI controls.

## Get the Plugin
The plugin is available via the [Figma community](https://www.figma.com/community/plugin/1186201881571137432) page.

After adding the plugin to Figma, you need to highlight the frame (artboard) that you want to export and right click on it.
On the rightclick menu, select Plugins > Saved Plugins > FigmaToBabylonJS
![Screenshot showing the figma right click menu on the Plugins option](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS-Step1.png)

You will be presented with 5 menu options:

+ **Export & Settings** 
  + This is the main export screen, where you can choose what to export and how.
+ **Quick Export Fullscreen ADT** 
  + This will export the selected frame as a fullscreen advanced dynamic texture with your last settings.
+ **Quick Export Control Only** 
  + This will export the selected frame as a single control with your last settings.
+ **Quick Export Fullscreen ADT with Images** 
  + This will export the selected frame as a fullscreen advanced dynamic texture with images included.
+ **Quick Export Control Only with Images** 
  + This will export the selected frame as a single control with images included.

## How to Use
   
For first time users, its suggested to click the **"Export & Settings"** menu option first to set up how you want the export to work.

After clicking **"Export & Settings"**, you should see this screen:
![Screenshot showing the Figma to BabylonJS plugins first screen. Two checkboxes for background and images, with two large buttons for exporting](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS-Step2.png)
Each tab controls the plug-in in regards to what will and will not be included in the export.

At the bottom there are two large buttons. 
The first primary button called **"Export Fullscreen ADT"** Will export the entire frame as an [advanced dynamic texture](/features/featuresDeepDive/gui/gui#advanceddynamictexture) which can then be passed into Babylon JS's advanced dynamic texture function.
For **Export Fullscreen ADT** outputed json, you and use the "Load" menu option on gui.babylonjs.com or load it in your project using; 
 ```ts
const  guiData  =  require("../figmaToBabylonJS.json")
let  advancedTexture  =  AdvancedDynamicTexture.CreateFullscreenUI("UI")
advancedTexture.parseSerializedObject(guiData, true)
 ```

The secondary button called **"Export Control Only"** is for exporting a single control that you would like to be passed into BabylonJS using the ```parse()``` command.
For **Single Components** in json, use the following code; 
  ```ts
 const  guiData  =  require("../figmaToBabylonJS.json")
 let  advancedTexture  =  AdvancedDynamicTexture.CreateFullscreenUI("UI")
 const  guiRect  =  Rectangle.Parse(guiData, null)
advancedTexture.addControl(guiRect)
  ```

After clicking either export button, after a short wait you will see your file explorer. Choose where you want the JSON or ZIP file to go. For best results, place it directly into your project with the correct file name your code uses (by default the filename is the same as the name of the parent frame).

It's also good practice to load the UI in gui.babylonjs.com or the [GUI Editor](toolsAndResources/guiEditor/) so you can check the outputted UI and tweak it. There may be inconsistencies, for those please check [inconsistencies and polyfills](/communityExtensions/figmaToBabylonJS#inconsistencies--polyfills)

### Includes Tab
Basic "What should be in the outputted file" options, none are mandatory to have. Please note that if you want to **Include Images** that the outputted file will be a .zip file and the .json will be inside of it.
![Screenshot showing the Figma to BabylonJS plugins Includes screen. Two checkboxes for background and images](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS-Step3.png)
+ **Background Color**
  + This will decide if the export should have its background set to the same fill as the Figma frame.
+ **Include Images**
  + This will enable if the plug-in should also package all the images in a predefined folder and add them to a .zip file.

### Identifiers Tab
Identifiers means what strings are you going to put in the layer names to identify specific BJS GUI controls. The controls that can be identified and converted to BabylonJS GUI controls are;
![Screenshot showing the Figma to BabylonJS plugins Identifiers screen. Three input fields for tags, buttons and scrollbars](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS-Step4.png)

+ **Buttons** 
  + Can be a Figma Component/Instantce/Frame with text in it. The buttons link text will be whatever the first text box it finds inside of itself is.
  + Can be a rectangle, the linktext is set to null in this case.

+ **Scroll View** 
  + Can be a Frame or Group. Please note that even though Figma allows you to have auto layouts On items that you define as scroll of use, BabylonJS cannot have something that is a stack panel and a scroll view. So if you wanted to say a stack panel of text you would need to have that and as it's parents an empty frame set as the scroll view.

+ **Checkboxes** 
  + Can be a Frame/Component/Instance or a flat rectangle.
  + There is not a lot of customisation that can be done to BJS checkboxes outside of its size border color and fill color.

### Images Tab
This tab is for additional options that apply to exported images.
![Screenshot showing the Figma to BabylonJS plugins Images screen. Three input fields for image scale and folder, with two large buttons for exporting](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS-Step5.png)
+ **Image Scale**
  + By default, the scale is set x2. This means that any images exported from Figma will be 2 times its set size in Figma. This can go all the way up to times four. Please be aware that if you export a very large design with lots of images and at times for you may have memory usage issues within Figma. If the plug-in becomes unresponsive please restart Figma and try again.
+ **Image Folder**
  + The image folder will define what the parent folder for the exported images should be.
  + This will also affect the image "source" URL as used in the BabylonJS .JSON format by match

### Compatibility warnings screen
![Screenshot showing the Figma to BabylonJS plugins Compatibility warnings screen. A list of warnings about potential issues with the export](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS-Step6.png)
After clicking either export button, if there are any potential compatibility issues with the design you are exporting you will see a list of warnings. These are not errors, just things to be aware of that may not export as expected. 

It helps to preview the UI by loading it into either gui.babylonjs.com or your local project using the inspector, to make sure that the export is correct [(see inconsistencies and polyfills)](/communityExtensions/figmaToBabylonJS#inconsistencies--polyfills)  

## How it Works
The plugin recursively loops through the selected Figma frame and pulls out all the "nodes" in the design. It will take each node and find a correct [BabylonJS GUI control](http://localhost:3000/features/featuresDeepDive/gui/gui#controls) to map to it.
The plugin recursively loops through your selected Figma frame and pulls out all the "nodes" in the design. It will take each node and find a correct BabylonJS GUI control to represent it. For example, a Figma rectangle will be converted to a BabylonJS Rectangle control, a Figma text node will be converted to a BabylonJS TextBlock control, and so on.
When the plugin is finished creating all the new controls, it uses BabylonJS serialize function to convert the controls group as a JSON string, writes it to a file and makes it available to download or "stream" to Figma directly.

### Video Demo
Below is a short Youtube video of the plugins creator demonstrating how to use the plugin.
<Youtube id="hFlrMNi671E" />

## Inconsistencies & Polyfills
Figma has features that are beyond the scope of BabylonJS GUI system. Below is a list of some of the areas which the plug-in has to make a determination on how to interpret things that Figma is asking for that BabylonJS GUI cannot replicate 1:1.

### Misc Inconsistencies
+ **Borders**
  + All borders are treated as "Inner" when porting to BabylonJS 
  + (BabylonJS does not differentiate between different types of positions).
+ **Colors not 1:1**
  + By default Figma uses an "unmanaged" color space, to make Figma closer represent what will actually be outputted when viewed on the web browser, go to ```Figma > Preferences > Color Profile...``` and set the ColorSpace to sRGB.
+ **Polygons**
	+ Polygons are not supported by BabylonJS GUI, the plug-in will simply skip over polygons when encountered. If you need to use complex shapes and polygons like this it's recommended that you export it as its own PNG and import it into the BabylonJS project as an image.
	+ A "polygon" of Lines/Vector is supported, it's an array of lines with a master empty rect as a parent.
+ **Blending/Multi Fills**
	+ Figma allows you to layer fills one on top of the other and use special blending options. Right now the plugin will only use the top most visible fill.
+ **Stack Panels + Scrollviews**
  + The plugin supports both of these BJS GUI controls, however, BabylonJS cannot have a control that is both a ScrollView AND Stackpanel. Whereas Figma will allow you to mark an Autolayout (Stackpanel) as a ScrollView.
  + If you need (for example) a list that is also scrollable, please place the Autolayout list of items inside of an empty group/frame that is marked as the ```-scroll``` (can customize this in the Identifiers Tab). 
  Borders on a parent will render INFRONT of any children in BabylonJS. In Figma, borders will draw on behind any children.
  + StackPanels CAN'T have shadows, border radius or outlines.
+ **Frames/groups** can have shadows and will give all children the same shadow. This doesnt look the same as in Figma but it is the closest approximation.
+ **Text** can't have gradient strokes, it will use the first color stop of the gradient and set it to a solid color.
+ **Images** can't have a stroke, all images are square.
+ **Patterns** and **Video** fills are not supported by BabylonJS GUI, the plugin will simply skip over these when encountered.

## Tips & Tricks
+ Use frames when possible, groups can sometimes cause unexpected issues.
+ StackPanels CAN'T have shadows, border radius or outlines. If you need these features, wrap the Autolayout in a parent Frame with the desired effects.
+ Avoid giving parents effects like shadows and borders as they will apply to all children and may not look as expected.
+ Always use border inner when designing in Figma to get the closest match to BabylonJS GUI.
+ Use single fills, do not rely on blend modes or multiple fills as BabylonJS GUI does not support these features.

## Help & Support
+ If the file output name is “undefined” that means that you are selecting a single item on the design and not the whole frame/artboard.
+ The plugin export buttons are disabled after clicking them
  + This could be due to a memory usage error. Please restart Figma
  + Also check for union shapes, they can cause issues. 
+ Very large designs may cause the plugin to "hang." Please be patient. If the plugin takes too much time, Figma will abort it for you.
  + If you have this issue, make the design frame less complex or simplify Components which reference other Components.
+ For any help and support please go to the dedicated thread for this plug-in on the [BabylonJS forums](https://forum.babylonjs.com/t/figma-to-babyonjs-plugin/37187).
