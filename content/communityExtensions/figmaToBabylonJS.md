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

## Introduction

![Screenshot showing the figma right click menu on the Plugins option](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS.png)

FigmaToBabylonJS is a Figma plugin which allows you to export Figma designs to BabylonJS GUI .json files. These can be parsed into a fullscreen UI [Advanced Dynamic Texture](/features/featuresDeepDive/gui/gui#advanceddynamictexture).

## Get the Plugin
The plugin is available via the [Figma community](https://www.figma.com/community/plugin/1186201881571137432) page.

After adding the plugin to Figma, you need to highlight the frame/artboard that you want to export and right click on it.

On the rightclick menu, select Plugins > Saved Plugins > FigmaToBabylonJS
![Screenshot showing the figma right click menu on the Plugins option](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS-Step1.png)

## How to Use
You should see a screen like this 
![Screenshot showing the Figma to BabylonJS plugins first screen. Two checkboxes for background and images, with two large buttons for exporting](/img/extensions/FigmaToBabylonJS/FigmaToBabylonJS-Step2.png)


Each tab controls are part of the plug-in in regards to what it will and will not be included in the export.

At the bottom there are two large buttons. The Blue primary button called **"Export Fullscreen ADT"** Will export the entire frame as an [advanced dynamic texture](/features/featuresDeepDive/gui/gui#advanceddynamictexture) which can then be passed into Babylon JS's advanced dynamic texture function.
For **Export Fullscreen ADT** outputed json, you and use the "Load" menu option on gui.babylonjs.com or load it in your project using; 
 ```ts
const  guiData  =  require("../figmaToBabylonJS.json")
let  advancedTexture  =  AdvancedDynamicTexture.CreateFullscreenUI("UI")
advancedTexture.parseSerializedObject(guiData, true)
 ```

The secondary grey button called **"Export Control Only"** is for exporting a single control that you would like to be passed into BabylonJS using the ```parse()``` command.
For **Single Components** in json, use the following code; 
  ```ts
 const  guiData  =  require("../figmaToBabylonJS.json")
 let  advancedTexture  =  AdvancedDynamicTexture.CreateFullscreenUI("UI")
 const  guiRect  =  Rectangle.Parse(guiData, null)
advancedTexture.addControl(guiRect)
  ```

After clicking either export button, after a short wait you will see your file explorer. Choose where you want the JSON or ZIP file to go. For best results, place it directly into your project with the correct file name your code uses (by default the filename is the same as the name of the parent frame).


### Includes Tab
Basic "What should be in the outputted file" options, nether are mandatory to have. Please note that if you want to **Include Images** that the outputted file will be a .zip file and the .json will be inside of it.

+ The first checkbox is **Background Color**. This will decide if the JSON export should have its background set to the same fill as the Figma frame.
+ The second checkbox is **Include Images**. This will enable if the plug-in should also package all the images in a predefined folder and add them to a .zip file.

### Identifiers Tab
Identifiers means what strings are you going to put in the layer names to identify specific BJS GUI controls. The controls that can be identified and converted to BabylonJS GUI controls are;

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

+ By default, the scale is set x2. This means that any images exported from Figma will be 2 times its set size in Figma. This can go all the way up to times four. Please be aware that if you export a very large design with lots of images and at times for you may have memory usage issues within Figma. If the plug-in becomes unresponsive please restart Figma and try again.
+ The image folder will define what the parent folder for the exported images should be. 
  + This will also affect the image "source" URL as used in the BabylonJS .JSON format.
+ It is recommended to make this image URL match what is on your project so that when you import images into your project you won't need to manually change the image sources in the .JSON format.



It helps to preview the UI by loading it into either gui.babylonjs.com or your local project using the inspector, to make sure that the export is correct [(see inconsistencies and polyfills)](/communityExtensions/figmaToBabylonJS#inconsistencies--polyfills)  

## How it Works

The plugin recursively loops through the selected Figma frame and pulls out all the "nodes" in the design. It will take each node and find a correct [BabylonJS GUI control](http://localhost:3000/features/featuresDeepDive/gui/gui#controls) to map to it.

All the new BabylonJS GUI mapped controls are then added to an empty root container object as children. When the plugin is finished adding all these children, it simply outputs it as a JSON string, writes it to a file and makes it available to download from Figma directly.
The image export works by using a built in Figma API to convert the image to a uInt8 Array, send the data to the plugins web frontend and rebuild + zip images.

### Video Demo
Below is a short Youtube video of the plugins creator demonstrating how to use the plugin.
<Youtube  id="hFlrMNi671E" />

## Inconsistencies & Polyfills
Figma has features that are beyond the scope of BabylonJS GUI system. Below is a list of some of the areas which the plug-in has to make a determination on how to interpret things that Figma is asking for that BabylonJS GUI cannot replicate 1:1.

### Misc Inconsistencies

+ Borders
  + All borders are treated as "Inner" when porting to BabylonJS (BabylonJS does not differentiate between different types of positions).
+ Colors not 1:1
  + By default Figma uses an "unmanaged" color space, to make Figma closer represent what will actually be outputted when viewed on the web browser, go to ```Figma > Preferences > Color Profile...``` and set the ColorSpace to sRGB.
+ Polygons
	+ Polygons are not supported by BabylonJS GUI, the plug-in will simply skip over polygons when encountered. If you need to use complex shapes and polygons like this it's recommended that you export it as its own PNG and import it into the BabylonJS project as an image.
	+ A "polygon" of Lines/Vector is supported, its an array of lines with a master empty rect as a parent.
+ Blending/Multi Fills
	+ Figma allows you to layer fills one on top of the other and use special blending options. Right now the plugin will only use the top most fill.
+ Stack Panels + Scrollviews. 
  + The plugin supports both of these BJS GUI controls, however, BabylonJS cannot have a control that is both a ScrollView AND Stackpanel. Where as Figma will allow you to mark an Autolayout (Stackpanel) as a ScrollView.
  + If you need (for example) a list that is also scrollable, please place the Autolayout list of items inside of an empty group/frame that is marked as the ```-scroll``` (can customize this in the Identifiers Tab). 

## Help & Support

+ If the file output name is “undefined” that means that you are selecting a single item on the design and not the whole frame/artboard.
+ The plugin export buttons are disabled after clicking them
  + This could be due to a memory usage error. Please restart Figma
  + Also check for union shapes, they can cause issues. 
+ Very large designs may cause the plugin to "hang." Please be patient. If the plugin takes too much time, Figma will abort it for you.
  + If you have this issue, make the design frame less complex or simplify Components which reference other Components.
+ For any help and support please go to the dedicated thread for this plug-in on the [BabylonJS forums](https://forum.babylonjs.com/t/figma-to-babyonjs-plugin/37187).