---
title: Selector
image: 
description: Learn about the selector in Babylon.js.
keywords: welcome, babylon.js, diving deeper, GUI, selector
further-reading:
    - title: How To Use Babylon GUI
      url: /divingDeeper/gui/gui
    - title: How To Use Babylon GUI Scroll Viewer
      url: /divingDeeper/gui/scrollViewer
    - title: How To Use Babylon GUI Xml Loader
      url: /divingDeeper/gui/xmlLoader
    - title: How To Use Babylon GUI3D
      url: /divingDeeper/gui/gui3D
video-overview:
video-content:
---

## The Selection Panel Helper

A `SelectionPanel` contains groups of checkboxes, radio buttons and sliders. Though not as versatile as as building your own interface with your own custom arrangement of controls it can be a quick way to construct a method of changing scene parameters for objects within your scene.

![selection panel](/img/gui/selectPanel1.jpg)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 1

## Referencing a Selection Panel

As you can see in **Fig 1** a selection panel rectangle contains a vertical organisation of groups numbered from the top starting at 0. Each groups contains a header and a variable number of selectors. Each selector consists of a (or button) and a label. Within any one group all the selectors must be of the same type. You can refer to a selector by its group number and then the position of the selector within the group. So the checkbox labelled _High_ has reference 0, 1, ie. group 0, selector 1.

**NOTE** Adding or removing groups or selectors with change the reference number. The reference number always refers to the current positioning of the group and of the selector.

## Creating a Selection Panel

As usual with GUI containers you will need to create an advanced dynamic texture to add the selection panel to. You can set the dimensions and position of the selection panel. The format to construct a blank selection panel is

```javascript
new BABYLON.GUI.SelectionPanel(name);
```

After construction you can add groups of selectors, each newly added group is placed below any already added groups. For example

```javascript
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
  "UI"
);

var selectBox = new BABYLON.GUI.SelectionPanel("selectBox");
selectBox.width = 0.25;
selectBox.height = 0.52;
selectBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
selectBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

advancedTexture.addControl(selectBox);

selectBox.addGroup(rotateGroup);
selectBox.addGroup(transformGroup);
selectBox.addGroup(colorGroup);
```

- <Playground id="#9M6M2I" title="Selection Panel with Added Groups" description="Simple example showing how to add a selection panel with added groups to your scene." image="/img/playgroundsAndNMEs/divingDeeperSelector1.jpg"/>

In addition if you have already constructed selector groups then you can then pass them in an array when you create the selection panel. The format for this is

```javascript
new BABYLON.GUI.SelectionPanel(name, [selector groups])
```

Example

```javascript
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
  "UI"
);

var selectBox = new BABYLON.GUI.SelectionPanel("selectBox", [
  transformGroup,
  colorGroup,
  rotateGroup
]);
selectBox.width = 0.25;
selectBox.height = 0.52;
selectBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
selectBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

advancedTexture.addControl(selectBox);
```

- <Playground id="#BXMTCD" title="Selection Panel and Groups on Creation" description="Simple example showing how to add a selection panel with added groups on creation." image="/img/playgroundsAndNMEs/divingDeeperSelector1.jpg"/>
- <Playground id="#BXMTCD#1" title="Selection Panel with Both Approaches" description="Simple example showing how to add a selection panel with both approaches." image="/img/playgroundsAndNMEs/divingDeeperSelector1.jpg"/>

## Creating Groups

There are three types of groups, a checkbox group, a radio group and a slider group, which are created using the structure

```javascript
new BABYLON.GUI.<Type>Group(header)
```

For example

```javascript
var transformGroup = new BABYLON.GUI.CheckboxGroup("Transformation");
var colorGroup = new BABYLON.GUI.RadioGroup("Color");
var rotateGroup = new BABYLON.GUI.SliderGroup("Rotation");
```

## Creating Selectors

Naturally there are three types of selectors and each can only be added to the appropriate group. External functions for each selector refer any changes in the value to properties of scene objects.

Checkbox and radio selectors are simply added to their group using two parameters, a label name and the external function reference. An optional third parameter can set the initial checked state of the selector to true (default value is false).

A slider selector is added to its group with a number of parameters, the first two being as before a label name and a reference to the external function. Due to the nature of a slider the following optional parameters can be set

| Parameter     | Description                                              | Default |
| ------------- | -------------------------------------------------------- | ------- |
| unit          | a string describing the units used, eg degrees or metres | "Unit"  |
| min           | the minimum value for the slider                         | 0       |
| max           | the maximum value for the slider                         | 100     |
| value         | the start value for the Slider between min and max       | 0       |
| onValueChange | the function used to format the value displayed          | void    |

New selectors are added below those already added.

Example usage

```javascript
transformGroup.addCheckbox("Small", toSize);
transformGroup.addCheckbox("High", toPlace);

colorGroup.addRadio("Blue", setColor, true);
colorGroup.addRadio("Red", setColor);

rotateGroup.addSlider(
  "Angle Y",
  orientateY,
  "degs",
  0,
  2 * Math.PI,
  0,
  displayValue
);
rotateGroup.addSlider(
  "Angle X",
  orientateX,
  "degs",
  0,
  2 * Math.PI,
  Math.PI,
  displayValue
);
```

## Selector Called Functions

### Checkbox Selector

One function for each selector. Each requires a Boolean parameter with actions depending whether the control is checked or not

Examples

```javascript
var toSize = function(isChecked) {
  if (isChecked) {
    box.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
  } else {
    box.scaling = new BABYLON.Vector3(1, 1, 1);
  }
};

var toPlace = function(isChecked) {
  if (isChecked) {
    box.position.y = 1.5;
  } else {
    box.position.y = 0.5;
  }
};
```

### Radio Selector

Within a radio group the same function is used for all selectors. The function requires a number parameter which will match the selector position with actions for each selector

Examples

```javascript
var setColor = function(but) {
  switch (but) {
    case 0:
      box.material = blueMat;
      break;
    case 1:
      box.material = redMat;
      break;
  }
};
```

### Slider Selector

Each slider selector requires two functions, one to change scene object properties and one to set the display format within the slider label.

Examples

```javascript
// Change mesh
var orientateY = function(angle) {
  box.rotation.y = angle;
};

var orientateX = function(angle) {
  box.rotation.x = angle;
};

//Format value
var displayValue = function(value) {
  return BABYLON.Tools.ToDegrees(value) | 0;
};
```

## Customise the Selection Panel

### Colors and Font

For consistency of appearance you can only change the overall font and color of all headers, all labels and all selector buttons.

- <Playground id="#BXMTCD#4" title="Selection Panel with Font Change" description="Simple example showing how to add a selection panel with a font change." image="/img/playgroundsAndNMEs/divingDeeperSelector2.jpg"/>

Without any direct setting, the color of labels follows that of the selection panel.

It is possible to set the color of all headers, labels, separator bars and selector buttons and the background color of all selector buttons.

```javascript
selectBox.color = "blue";
selectBox.background = "#FFFF99";
selectBox.barColor = "#4F7DF2";
selectBox.headerColor = "blue";
selectBox.buttonColor = "orange";
selectBox.buttonBackground = "#684502";
selectBox.labelColor = "brown";
```

- <Playground id="#BXMTCD#2" title="Selection Panel with Color Changes no labels" description="Simple example showing how to add a selection panel with color changes apart from labels." image="/img/playgroundsAndNMEs/divingDeeperSelector3.jpg"/>
- <Playground id="#BXMTCD#3" title="Selection Panel with Color Changes" description="Simple example showing how to add a selection panel with a color change." image="/img/playgroundsAndNMEs/divingDeeperSelector4.jpg"/>

Individual headers and labels can have their text changed.

```javascript
selectBox.setHeaderName("Move", 0);
selectBox.relabel("Theta", 2, 0);
```

- <Playground id="#BXMTCD#5" title="Selection Panel Change Group Header" description="Simple example showing how to add a selection panel and change the group header." image="/img/playgroundsAndNMEs/divingDeeperSelector5.jpg"/>
- <Playground id="#BXMTCD#6" title="Selection Panel Change Selector Label" description="Simple example showing how to add a selection panel and change the selector label." image="/img/playgroundsAndNMEs/divingDeeperSelector5.jpg"/>

### Groups and Selectors

As stated earlier you can add groups at the bottom of the selection panel at any time. You can also remove a group by reference to its position in the list, eg

```javascript
selectBox.removeGroup(2);
```

**Note** Groups below the removed group will have new positions and so need to be referenced by their new position.

In the same way a selector of the correct type can be added to the bottom of a group at any time using the `add<Type>` method.

```javascript
transformGroup.addCheckbox("Across", toLeft);
```

- <Playground id="#BXMTCD#7" title="Selector Group Add Selector" description="Simple example showing how to add a selector group and add a selector to your scene." image="/img/playgroundsAndNMEs/divingDeeperSelector6.jpg"/>

A selector can be removed from a group at any time using its position in the group, eg

```javascript
transformGroup.removeSelector(1);
colorGroup.removeSelector(0);
rotationGroup.removeSelector(0);
```

- <Playground id="#BXMTCD#8" title="Selector Group Add Selector" description="Simple example showing how to add a selector group and remove a selector from your scene." image="/img/playgroundsAndNMEs/divingDeeperSelector6.jpg"/>

For a selector within a group that is contained within a selection panel you can add a selector by use of the group position and correct parameters, eg

```javascript
selectBox.addToGroupSlider(
  2,
  "Angle X",
  orientateX,
  "degs",
  0,
  2 * Math.PI,
  Math.PI,
  displayValue
);
```

- <Playground id="#BXMTCD#9" title="Selector Panel Add Selector" description="Simple example showing how to add a selector panel and add a selector to your scene." image="/img/playgroundsAndNMEs/divingDeeperSelector6.jpg"/>

and remove a selector by using its reference position, ie. group and selector position in the group. For example

```javascript
selectBox.removeFromGroupSelector(0, 0);
```

- <Playground id="#BXMTCD#10" title="Selector Group Remove Selector" description="Simple example showing how to add a selector group and remove a selector from your scene." image="/img/playgroundsAndNMEs/divingDeeperSelector6.jpg"/>