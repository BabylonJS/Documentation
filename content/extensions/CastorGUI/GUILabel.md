---
title: GUILabel
image:  
description: Creates a new GUILabel
keywords: Castor, GUI, plugin, extension, GUILabel
further-reading:
video-overview: 
video-content:
---

## new GUILabel(id, options, guimanager, append)
Creates a new GUILabel

### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**append** | bool | is added to the &lt;body&gt;. =&gt; True by default (optional)
---

## Options

* **w**: width of label (in pixel)
* **h**: height of label (in pixel)
* **x**: position left of label (in pixel)
* **y**: position top of label (in pixel)
* **text**: value text label (string)
* **zIndex**: depth of the element (int) =&gt; 1 by default

## Methods

### setVisible(bool, fade) → void
Set this GUI element to visible or invisible

### isVisible() → void
Returns element if is visible or no

### dispose() → void
Dispose the GUILabel, and delete element.
