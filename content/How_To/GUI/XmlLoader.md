---
title: XML Loader
image: 
description: Learn about the Babylon.js XML Loader.
keywords: welcome, babylon.js, diving deeper, GUI, XML Loader
further-reading:
    - title: How To Use the Selection Panel Helper
      url: /how_to/selector
    - title: How To Use Babylon GUI
      url: /how_to/gui
    - title: How To Use Babylon GUI Scroll Viewer
      url: /how_to/ScrollViewer
    - title: How To Use Babylon GUI3D
      url: /how_to/gui3d
video-overview:
video-content:
---

When you want to create GUI layouts in an easy and structured way you may want to take a look at the Xml Loader.

## Creating the Xml Loader

The xml Loader is able to load Babylon GUI layouts directly from xml. You create it with

```javascript
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
var xmlLoader = new BABYLON.GUI.XmlLoader();
```

The XmlLoader might be used as part of a javascript class or function. In order for the class to correctly map observables and dynamic attributes with the class methods and attributes, it is necessary to provide the class object in the constructor. This would be how the XmlLoader would be initialized inside a class.

```javascript
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
var xmlLoader = new BABYLON.GUI.XmlLoader(this);
```

You can then proceed to load a layout using the **loadLayout** method.

```javascript
xmlLoader.loadLayout("layouts/testgui.xml", advancedTexture);
```

This is what is needed to initialize and load a layout. There may be cases when you may need to load a layout without attaching it to the advancedTexture. In this case, it suffices to set the second paramenter null like the following.

```javascript
xmlLoader.loadLayout("layouts/testgui.xml", null);
```

The third parameter in the loadLayout function, is a callback which is called once the layout has been parsed. Inside the callback, it is possible to retrieve elements and add events to them. This would be an example of how it would be used.

```javascript
xmlLoader.loadLayout("layouts/testgui.xml", advancedTexture, function() {
    xmlLoader.getNodeById("helloButton").onPointerClickObservable.add(clickEvent);
});
```

After the layout has been loaded there is a couple of methods available to you.

```javascript
xmlLoader.getNodeById("helloButton"); // Gets a node by ID. Similar to how DOM elements are retrieved.
xmlLoader.getNodes(); // Gets all parsed nodes.
xmlLoader.isLoaded(); // Returns true or false depending whether the layout has finished loading.
```

If you need to detach a container from the scene

```javascript
var node = xmlLoader.getNodeById("firstContainer"); 
advancedTexture.removeControl(node);
```
Then attach it again
```javascript
var node = xmlLoader.getNodeById("firstContainer"); 
advancedTexture.addControl(node);
```
## XML Layouts

The structure for an XML layout is very straightforward. This is what a simple XML layout would look like

```xml
<?xml version="1.0"?>
<root>
    <Rectangle id="firstContainer" verticalAlignment="Control.HORIZONTAL_ALIGNMENT_TOP" background="yellow" width=".8" height=".4" color="Orange">
        <Button id="imageButton" name="imageButton" width="0.2" background="red" height="0.3">
                <Image id="image" source="assets/icon.png" width="1" height="1" name="image" stretch="Image.STRETCH_FILL" horizontalAlignment="Control.HORIZONTAL_ALIGNMENT_LEFT" />
        </Button>
    </Rectangle>
</root>
```

The Controls names in the layouts follow rigorously the names in the BABYLON.GUI library. The same stands for the attributes as well. The only usecase when this differs, is in the Grid element. This is what a Grid element looks like in the layout.

```xml
<Grid id="grid" name="grid" top="50px" background="black" height="200px" width="200px">
        <Row height="0.5" >
            <Column width="0.2">
            </Column>
            <Column width="0.5">
                <Rectangle id="1rect" thickness="0" name="1rect" background="green"></Rectangle>
            </Column>
        </Row>
        <Row height="0.5">
            <Column>
            </Column>
            <Column>
                <Rectangle id="2rect" thickness="0" name="2rect" background="red" ></Rectangle>
            </Column>
        </Row>
</Grid>
```

In the Grid's case, the rows and the columns are not controls in the babylon GUI. It is important to add the maximum number of columns in the first row as all the subsequent rows will have the same number of columns. This is because the xml loader creates the column definitions of the Grid from the first row. However, after the first row, it is possible to add less columns to the subsequent rows. The width and height attributes for Rows and the Columns of the first row are mandatory, for the columns of the subsequent rows the value will not be taken into consideration by the loader. The isPixel attribute is mandatory if the width and height is in Pixels.

## Dynamic Attributes

It is possible to add dynamic attributes to your XML layouts. These attributes can either be class attributes or global variables. The following is how to set a value in your xml layout referencing a class attributes or a global variable.

```xml
<?xml version="1.0"?>
<root>
    <Rectangle name="firstContainer" id="firstContainer" verticalAlignment="Control.HORIZONTAL_ALIGNMENT_TOP" background="blue" id="popupContainer" width=".8" height=".4" color="Orange" >
        <InputText id="inputText1" width="{{textWidth}}" maxWidth="0.3"  height="40px" color="white"/>
        <Button id="helloButton" width="0.2" verticalAlignment="Control.VERTICAL_ALIGNMENT_BOTTOM" height="0.2" name="helloButton" background="green" onPointerUpObservable="storeUsernameEvent" >
            <TextBlock  text="Store Input" color = "white" />
        </Button>
    </Rectangle>
</root>
```

By wrapping the attributes value with double curly brackets `{{}}`, it is given the value of the class attribute or global variable with that name.

## Linking Control to Mesh

It is possible to link a control to a mesh directly from Xml. This can be very easily done by setting the attribute `linkWithMesh="meshName"` to the Control you want to add. Even though the curly brackets are not needed, this is also a dynamic attribute. If the xml loader has been initiated with a class / function context it will use that context to retrieve the mesh, otherwise it will look for it globally.

## Dynamic Array and Object source

It is also possible to connect a structure like an Array or Object directly to XML. This would be handy in a case when we may need to fill a StackPanel from an array of values or object of key value pairs. However, this can be used whenever we need to repeat a specific xml block by filling in values from An Array or an Object. The only not implemented usecase would be the Grid.

Let's suppose we have the following object in your javascript :

```javascript
var objTexts = {
        first: {
            name: "john",
            surname: "smith"
        },
        second: {
            name: "ben",
            surname: "Stiller"
        }
};
```

Let's also suppose the following list retains the users of your application and you may want to show them listed in the GUI. This would be possible JS side but this would mean copying the control over and over again. XmlLoader makes it much more easier and cleaner directly from XML. This would be how you iterate the aforementioned structure :

```xml
<StackPanel background="#ffffff" width="300px" top="100px" left="200px" id="panel" dataSource="text in {objTexts}">
       <Container  width="1" height="40px" >
           <TextBlock id="myImage" height="1" text="{{text.name}}" color="red" resizeToFit="true" fontSize="24"/>
           <TextBlock left="50px" height="1" text="{{text.surname}}" color="black" resizeToFit="true" fontSize="24"/>
       </Container>
</StackPanel>
```
Or
```javascript
xmlLoader.getNodeById("myName").text = "john";
xmlLoader.getNodeById("mySurname").text = "smith";
```

```xml
<StackPanel background="#ffffff" width="300px" top="100px" left="200px" id="panel" dataSource="text in {objTexts}">
       <Container  width="1" height="40px" >
           <TextBlock id="myName"  height="1" text="{{text.name}}" color="red" resizeToFit="true" fontSize="24"/>
           <TextBlock id="mySurname" left="50px" height="1" text="{{text.surname}}" color="black" resizeToFit="true" fontSize="24"/>
       </Container>
</StackPanel>
```

The source is associated to the StackPanel by using the dataSource attribute. The dataSource attribute should always have 3 values in it, the variable name, the keyword `in` and structure name. For an object structure the name must be wrapped in curly brackets `{}` like the example above. For an array structure the name can be wrapped up in normal brackets but it is not mandatory. When the dataSource is an array it can be written as `dataSource="text in [objTexts]` or simply `dataSource="text in objTexts"`

The variable part of the dataSource attribute is how you access the source values. Notice in the above example the section `text="{{text.surname}}"` is how you set a value from the source to your XML.