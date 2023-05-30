---
title: Figma to BabylonJS
image: /img/extensions/FigmaToBabylonJS.png
description: FigmaToBabylonJS is a Figma plugin which allows you to export Figma designs to BabylonJS GUI .json files.
keywords: extensions, Figma, GUI, BabylonGUI, Design, UI, plugin
further-reading:
video-overview: hFlrMNi671E
video-content:

---

# Figma to BabylonJS

## Introduction

![Screenshot showing the figma right click menu on the Plugins option](/img/extensions/FigmaToBabylonJS.png)

FigmaToBabylonJS is a Figma plugin which allows you to export Figma designs to BabylonJS GUI .json files. These can be parsed into a fullscreen UI [Advanced Dynamic Texture](/features/featuresDeepDive/gui/gui#advanceddynamictexture).

## Get the Plugin
The plugin is available via the [Figma community](https://www.figma.com/community/plugin/1186201881571137432) page.

## How to Use
After adding the plugin to Figma, you need to highlight the frame/artboard that you want to export and right click on it.

On the rightclick menu, select Plugins > Saved Plugins > FigmaToBabylonJS
![Screenshot showing the figma right click menu on the Plugins option](/img/extensions/FigmaToBabylonJS-Step1.png)

Choose if you want the output to include the background color (changes the "root" background color to the frames fill color)

Select "Is Component" if the target export should be formatted to be used as a single control or compnent in your GUI. This output will not work with the default ADT but with single controls using the ```parse()``` command

Click the “Convert to BabylonJS JSON” button and after a short wait you will see your file explorer. Choose where you want the file to go. For best results, place it directly into your project with the correct file name your code uses, this way the UI will automatically update.

![Screenshot showing the figma right click menu on the Plugins option](/img/extensions/FigmaToBabylonJS-Step2.png)
 
For **Full Screen UI**, use the output, you and use the "Load" menu option on gui.babylonjs.com or load it in your project using; 
 ```ts
const  guiData  =  require("../figmaToBabylonJS.json")
let  advancedTexture  =  AdvancedDynamicTexture.CreateFullscreenUI("UI")
advancedTexture.parseSerializedObject(guiData, true)
 ```
  For **Single Components** use 
  ```ts
 const  guiData  =  require("../figmaToBabylonJS.json")
 let  advancedTexture  =  AdvancedDynamicTexture.CreateFullscreenUI("UI")
 const  guiRect  =  Rectangle.Parse(guiData, null)
advancedTexture.addControl(guiRect)
  ```

It helps to preview the UI by loading it into either gui.babylonjs.com or your local project using the inspector, to make sure that the export is correct [(see inconsistencies and polyfills)](/communityExtensions/figmaToBabylonJS#inconsistencies--polyfills)  

## How it Works

The plugin recursively loops through the selected Figma frame and pulls out all the "nodes" in the design. It will take each node and find a correct BabylonJS GUI object to map to it.

All the new BabylonJS GUI mapped objects are then added to an empty root container object as children. When the plugin is finished adding all these children, it simply outputs it as a JSON string, writes it to a file and makes it available to download from Figma directly.

### Video Demo
Below is a short Youtube video talking about how to use the plugin.
<Youtube  id="hFlrMNi671E" />

## Inconsistencies & Polyfills
Figma has features that are beyond the scope of BabylonJS GUI system. Below is a list of some of the areas which the plug-in has to make a determination on how to interpret things that Figma is asking for that BabylonJS GUI cannot replicate 1:1.

### Handling Images

Images can’t be represented as binary or BASE64 inside the json file so currently the plugin will just set the image src to `source=“./imageControlDefault.jpg”`. After exporting the json it's recommended you export your images separately and correct the source addresses either in the JSON file or in code.

### Misc Inconsistencies

- Borders
  - All borders are treated as "Inner" when porting to BabylonJS (BabylonJS does not differentiate between different types of positions).
- Colors not 1:1
  - By default Figma uses an "unmanaged" color space, to make Figma closer represent what will actually be outputted when viewed on the web browser, go to Figma preferences > ColorSpace and set the ColorSpace to sRGB.
- Polygons
	- Polygons are not supported by BabylonJS GUI, the plug-in will simply skip over polygons when encountered. If you need to use complex shapes and polygons like this it's recommended that you export it as its own PNG and import it into the BabylonJS project as an image.
	- A "polygon" of Lines/Vector is supported, its an array of lines with a master empty rect as a parent.
- Blending/Multi Fills
	- Figma allows you to layer fills one on top of the other and use special blending options. Right now the plugin will only use the top most fill.

## Help & Support

- If the file output name is “undefined” that means that you are selecting a single item on the design and not the whole frame/artboard.
- Very large designs may cause the plugin to "hang." Please be patient. If the plugin takes too much time, Figma will abort it for you.
- If you have this issue, make the design frame less complex or simplify Components which reference other Components.
- For any help and support please go to the dedicated thread for this plug-in on the [BabylonJS forums](https://forum.babylonjs.com/t/figma-to-babyonjs-plugin/37187).