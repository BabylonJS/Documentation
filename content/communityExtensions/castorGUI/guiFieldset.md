---
title: GUIFieldset
image:  
description: Creates a new GUIFieldset
keywords: Castor, GUI, plugin, extension, GUIFieldset
further-reading:
video-overview: 
video-content:
---

## new GUIFieldset(id, options, guimanager, append)
Creates a new GUIFieldset

### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**append** | bool | is added to the &lt;body&gt;. =&gt; True by default (optional)
---

## Options

* **w**: width of fieldset (in pixel)
* **h**: height of fieldset (in pixel)
* **x**: position left of fieldset (in pixel)
* **y**: position top of fieldset (in pixel)
* **legend**: value legend od the fieldset (string)
* **zIndex**: depth of the element (int) =&gt; 1 by default

## Methods

### add(element) → void
add element in the GUIFieldset

### setVisible(bool, fade) → void
Set this GUI element to visible or invisible

### isVisible() → void
Returns element if is visible or no

### dispose() → void
Dispose the GUIFieldset, and delete element.
