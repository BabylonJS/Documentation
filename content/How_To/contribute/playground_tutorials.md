# Playground Based Tutorials
This type of playground takes a student step by step through a feature of Babylon.js at the same time as higlighting the code used by that feature. The whole of the code exists in the playground editor but any distracting code can be hidden from the user. Generally the student should not be given the facility to edit the code or to use all features of the playground since doing so would destroy the tutorial they are trying to follow. 

Below are three PBT examples to give you an idea of what is possible.

* [Playground Tutorial - .rotation v .rotate](https://www.babylonjs-playground.com/#KNSQD7)
* [Playground Tutorial - Sliders](https://www.babylonjs-playground.com/#UL6BCD)
* [Playground Tutorial - Hiding Lines](https://www.babylonjs-playground.com/#4HA2KK)
* [Playground Tutorial - Camera Collisions and Input Customization](https://www.babylonjs-playground.com/#U825TZ)

However since they are uneditable it is not possible to see how they are written. Links to guides on writing them are:

[Starter Guide](/resources/hiding_editor_lines)  
[Slider Guide](/resources/PBT_slider)  
[Intermediate Guide](/resources/PBT_Writing)  
[Advanced Guide](/resources/PBT_previous_and_next)


# Creating a PBT
To help in the coding of a PBT several functions are provided to manipulate the text in the playground editor and to create basic dialogue boxes using the Babylon.GUI. While editor manipulation needs the functions provided any method of writing a user interface that works with Babylon.js is possible. 

The other important thing to consider is where to write the PBT code. Once the code is in the playground editor and 'Run' or 'Save'd the text of the code will be amended by its own code. For this reason it is better to write it externally to the playground. More on this later.

## First Step
Think about the playground code you want to demonstrate and write it in the usual way

```javascript
var createScene = function() {

    //Usual PG code
    
    return scene;
}    
```
To start a new tutorial you need a 'new PBT()'

```javascript
var createScene = function() {

    //Usual PG code

    var pbt = new PBT();
    
    return scene;
}    
```
In the rest of this section consider pbt as the newly created PBT.

## Playground Amending Methods

_hideMenu_ removes all the menu items from the menu bar except the title and the drop down choices of example playgrounds.
```javascript
pbt.hideMenu()
```
_editOff_ makes any code in the playground uneditable
```javascript
pbt.editOff();
```

_editOn_ allows the code in the playground editor to be edited. This is needed when any line changes need to be made by the code itself. When left on a user can also edit the text in the playground tutorial.
```javascript
pbt.editOff();
```

## Editor Amending Methods

### Line Decoration
_clearDecorLines_ clears all decorations on all lines and will lighten all text.

```javascript
pbt.clearDecorLines() 
```

_setDecorLines_ emphasises lines by adding decoration to them and darkening text. Lines to be decorated are passed as start line, end line pairs in an array.

```javascript
pbt.setDecorLines([27, 27]); //decorates line 27 only
pbt.setDecorLines([3, 15]); //decorates lines 3 to 15 inclusive
pbt.setDecorLines([10, 17, 25, 31]); //decorates lines 10 to 17 and lines 25 to 3 
```
### Line Changes
_replaceLines_ replaces the text in the given line range with the given new text. Only one range of lines is possible which is passed as an array pair.

```javascript
pbt.replaceLines([13, 13], "mesh.rotation.x = Math.PI/4"); //replaces line 13 with one line of text
pbt.replaceLines([15, 15]), "mesh.position.x = 4;\r\nmesh.position.y = 6;\r\nmesh.position.z = -2;"); // replaces line 15 with multiple lines
pbt.replaceLines([23,28], "//All Gone"); //replaces lines 23 to 28 with a single line
```

_replaceText_ inserts text in the given line from the start to end position.
```javascript
pbt.replaceText(12, 3, 8, "WORLD"); // On line 12 replaces the characters from 3 to 8 with WORD
```
_hideLines_ hides the lines passed as start and end pairs in an array. Each call to _hideLines_ only hides those lines given in the array all other lines become shown. 
```javascript
pbt.hideLines([27, 27]); //hides line 27 only, all other lines are displayed
pbt.hideLines([3, 15]); //hides lines 3 to 15 inclusive only, all other lines are displayed
pbt.hideLines([10, 17, 25, 31]); //hides lines 10 to 17 and lines 25 to 31 only, all other lines are displayed
```
_hideRange_ hides the range of lines passed as start and end pairs in an array. The method _hideRange_ adds the range of lines given to lines already hidden.  
```javascript
pbt.hideRange([27, 27]); //hides line 27 together with already hidden lines
pbt.hideRange([3, 15]); //hides lines 3 to 15 together with already hidden lines
pbt.hideRange([10, 17, 25, 31]); //hides lines 10 to 17 and lines 25  to 31 together with already hidden lines
```
_showRange_ displays the range of lines passed as start and end pairs in an array. The method _showRange_ only affects the given line range if previously hidden using _hideRange_ with the same line range.
```javascript
pbt.showRange([27, 27]); //displays line 27 together with already displayed lines
pbt.showRange([3, 15]); //displays lines 3 to 15 inclusive together with already displayed lines
pbt.showRange([10, 17, 25, 31]); //displays lines 10 to 17 and lines 25 to 31 together with already displayed lines
```
### Line Fetch

_getLineText_ returns the text on the given line number.

```javascript
var lineText = pbt.getLineText();
```

## GUI Dialogue Methods

There are two dialogue boxes that can be created for a PBT.

### Informative Dialogue Box

This consists of an image area, a text area and 'Prev' and 'Next' buttons.

![Standard Dialogue](/img/how_to/playground-tutorials/informative-dialogue-box.jpg)

Whilst a 'Prev' button is available the difficulty of undoing any actions already done means that this can usually be hidden.

```javascript
var dialog = new PBT.StandardDialog(options)
```
There are a number of options available on creation

option|value|default value
--------|-----|-------------
text|_(String)_ |"Playground Based Tutorial"
width|_(string)_|"50%"
height|_(string)_|"25%"
top|_(string)_|"0px"
left|_(string)_|"0px"
verticalAlignment|_(number)_|BABYLON.GUI.Control.VERTICAL\_ALIGNMENT\_TOP
horizontalAlignment|_(number)_|BABYLON.GUI.Control.HORIZONTAL\_ALIGNMENT\_LEFT
useImage|_(boolean)_|true
imageUrl|_(string)_|path to BJS PBT logo

```javascript
options = {
    left: "0.5%",
    top: "0.2%",
    text: "Read on for the difference between .rotation and .rotate and follow to the end for examples."
}
var dialog = new pbt.StandardDialog(option);  
dialog.hidePrev();
```

Setting 'useImage' to 'false' extends the width of the text area.

There are a number of methods available to change an informative dialogue box after construction.

```javascript
dialog.setText("More Information");
dialog.setWidth("20%");
dialog.setHeight("45px");
dialog.setTop("5px");
dialog.setLeft("15%");
dialog.setHorizontalAlignment(BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER);
dialog.setVerticalAlignment(BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM);
dialog.show(); //information box visible
dialog.hide(); //information box hidden
dialog.showNext(); //next button visible
dialog.hideNext(); //next button hidden
dialog.showPrev(); //prev button visible
dialog.hidePrev(); //prev button hidden
```
Two further methods _getNextButton_ and _getPrevButton_ allow functions to be added to the 'Next' and 'Prev' buttons.

```javascript
dialog.getNextButton().onPointerUpObservable.add(function() {       
    tutorIndex++;   
    tutorial.setText(tutorTexts[tutorIndex]);
    nextAction(tutorIndex);
});
```
### Selection Dialogue Box

This selection dialogue box contains _button groups_ of 'radio', 'checkbox' or 'slider' buttons. Each group can contain only one type of button but you can mix and match the types of groups in one box if you wish.

![Selection Dialog](/img/how_to/pbt5.png)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 1. 

Button groups are constructed using the `ButtonGroup` function

```javascript
var myRadioGroup = new PBT.ButtonGroup("Name for Radio Group", "R");

var myCheckboxGroup = new PBT.ButtonGroup("Name for Checkbox Group", "C");

var mySliderGroup = new PBT.ButtonGroup("Name for Slider Group", "S");
```

The first parameter is the name of the group which will appear as the group header in the selection box. The second optional parameter gives the type of button, "radio" or "R" for a `radio` button, "checkbox" or "C" for a `checkbox` or "slider" or "S" for a `slider`. The default is "checkbox" so can be missed out if this is the type of button you want. In the case of 'radio' buttons the button group also places together those buttons that react together. For "checkbox" and "slider" buttons the grouping is just cosmetic.

The `buttonGroup` object has two methods `addButton` for adding a "radio" or "checkbox" button and `addSlider` to add a slider.

#### addButton
The `addButton` method takes three parameters and creates the appropriate radio or checkbox button. 

```javascript
myRadioGroup.addButton("Radio Button Name", function, false)

myCheckboxGroup.addButton("Checkbox Button Name", function, true);
```

The first two parameters are required and the third optional. 

* Name: string, the name of the button, which will appear as the text for the button;
* Function: function, to be called when selected;
* Checked: boolean,  defaults to _false_ and when set to _true_ means that button is selected or checked.

For the above Fig 1. the code for the button groups could be 

```javascript
var boxGroup = new pbt.ButtonGroup("Box Code");
boxGroup.addButton("Hide", hideBoxCode, true);

var animGroup = new pbt.ButtonGroup("Anim Code");
animGroup.addButton("Hide", hideAnimCode, true);

var spaceGroup = new pbt.ButtonGroup("Space", "radio");    
spaceGroup.addButton("WORLD", worldSpace, true);
spaceGroup.addButton("LOCAL", localSpace);
```
#### addSlider
![Slider](/img/how_to/pbt6.png)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fig 2.


The `addSlider` method takes seven parameters

```javascript
mySliderGroup.addSlider("Slider Name", function, "units", label function, minimum, maximum, start);
```
* Name string, appears as text for the slider, this is followed by the slider value;
* Function: function, to be called when slider moves;
* Units: string, unit of measurement appears after slider value;
* Label Function: function, also to be called when slider moves, used to update the slider value in the dialogue;
* Minimum: number, the minimum value for the slider;
* Maximum: number, the maximum value of the slider;
* Start: number, the initial value of the slider.

For Fig 2. the code could be

```javascript
var slider = new pbt.ButtonGroup("Angle", "S");
slider.addSlider("X axis", boxAboutX, "degs", updateLabelX, 0, 2 * Math.PI, 0);
slider.addSlider("Y axis", boxAboutY, "degs", updateLabelY, 0, 2 * Math.PI, 0);
slider.addSlider("Z axis", boxAboutZ, "degs", updateLabelZ, 0, 2 * Math.PI, 0);
```

#### Options
These groups can then be added to a new `SelectionDialog` box in the `groups` option.

```javascript
var selector = new SelectionDialog(options);
```
The options for a selection dialogue box are

option|value|default value
--------|-----|-------------
width|_(string)_|"50%"
height|_(string)_|"25%"
top|_(string)_|"0px"
left|_(string)_|"0px"
verticalAlignment|_(number)_|BABYLON.GUI.Control.VERTICA\L_ALIGNMENT\_BOTTOM;
horizontalAlignment|_(number)_|BABYLON.GUI.Control.HORIZONTAL\_ALIGNMENT\_LEFT
groups|_(array)_ REQUIRED|   
 

```javascript
var selector = new pbt.SelectionDialog({groups:[boxGroup, animGroup, spaceGroup]});
```

or

```javascript
var sliderSelector = new pbt.SelectionDialog({groups: [slider]});
```

or possibly

```javascript
var options = {
    width: "40%",
    height: "10%",
    top: "20%",
    groups: [boxGroup, animGroup, spaceGroup, slider]
}

var selector = new pbt.SelectionDialog(options);
```


## Where to Write The Code
To repeat an earlier statement; while it is possible to write a PBT directly into the playground editor it is not a good idea. Running and saving your code in the playground changes the code and you are likely not to bele to get the original text back.

The simplest way is to use your favourite text editor and save as a text file. When you think it is ready to try copy the text and paste it into the playground. Click the RUN button to test, avoiding the SAVE button until you are sure all is working well. You will probably find it needs many adjustments until it is correct. More than anything is getting the line numbers correct. As you find you need to add and edit your code these line numbers keep changing.

For those of you familiar with Node.js, git and npm there is another way that avoids the copying and pasting part until you have a finished working copy. For this you will need to run a version of the playground locally. 

Clone Babylon.js

```javascript
git clone https://github.com/BabylonJS/Babylon.js.git
```

In the Babylon.js directory install gulp globally  
![gulp install](/img/how_to/pbt1.png)

Change to the Playground directory and npm install  
![monaco install](/img/how_to/pbt2.png)

Change to the Tools/Gulp directory and npm install  
![npm install](/img/how_to/pbt3.png)

To write a tutorial use your favourite IDE (VSCode for example) to open the Playground directory. Inside this there is a `scripts` folder, save your Javascript tutorial code in this folder. Also in this folder is a `scripts.txt` file that lists all the files in the `scripts` folder and makes then accessible to the *Scenes* drop down list at the top right of the playground. Add your file name to the list. Now you can write and edit your file, run a local version of the playground and by choosing it from the list test it. 

To run a local version of the playground make sure you are in the Tools/Gulp directory of your copy of Babylon.js and npm run start
![gulp run](/img/how_to/pbt4.png)

Once the server is running in your browser type address http://localhost:1338/Playground/index.html to run the playground.

# Further Reading

[Starter Guide](/resources/hiding_editor_lines)  
[Slider Guide](/resources/PBT_slider)  
[Intermediate Guide](/resources/PBT_Writing)  
[Advanced Guide](/resources/PBT_previous_and_next)

