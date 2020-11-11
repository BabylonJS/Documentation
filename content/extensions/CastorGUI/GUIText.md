---
title: GUIText
image:  
description: Library extension for displaying Castor GUI elements as a layer on top of the canvas.
keywords: Castor, GUI, plugin, extension, GUIText
further-reading:
video-overview: 
video-content:
---

## new GUIText(id, options, guimanager, append)
Creates a new GUIText

### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**append** | bool | is added to the &lt;body&gt;. =&gt; True by default (optional)
---

# Options

* **x**: position left of text (in pixel)
* **y**: position top of text (in pixel)
* **position**: set position "absolute" or "relative"
* **size**: size the text (int) =&gt; 30 by default (optional)
* **color**: color the text (string) =&gt; "white" by default (optional)
* **police**: police font of text (string) =&gt; "Segoe UI" by default (optional)
* **text**: value text label (string) =&gt; "CastorGUI" by default
* **bold**: text bold or no =&gt; "none" by default else "bold"
* **italic**: text italic or no =&gt; "none" by default else "italic"
* **centerVertical**: text align center vertical (string) =&gt; "false" by default (optional)
* **centerHorizontal**: text align center horizontal (string) =&gt; "false" by default (optional)
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **inline**: text inline or no. false by default.

# Methods

## updateText(string:text) → void
Updates the text of the GUI element

## getTextWidth(string:text, string:font) → void : static
Get size the text of the GUI element

## setVisible(bool, fad) → void
Set this GUI element to visible or invisible

## isVisible(e) → void
Returns element if is visible or no

## dispose() → void
Dispose the GUIText Manager, and delete element.
