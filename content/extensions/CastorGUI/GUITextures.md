---
title: GUITexture
image:  
description: Creates a new GUITexture.
keywords: Castor, GUI, plugin, extension, GUITexture
further-reading:
video-overview: 
video-content:
---

## new GUITexture(id, imageUrl, options, guimanager, callback, append)
Creates a new GUITexture

### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**imageUrl** | string | The image with path relative or absolute
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**callback** | function | Trigger function by click (optional)
**append** | bool | is added to the &lt;body&gt;. =&gt; True by default (optional)
---

# Options

* **w**: width of image (in pixel)
* **h**: height of image (in pixel)
* **x**: position left of image (in pixel)
* **y**: position top of image (in pixel)
* **zIndex**: depth of the element (int) =&gt; 1 by default

# Methods

## setVisible(bool, fade) → void
Set this GUI element to visible or invisible

## isVisible() → void
Returns element if is visible or no

## dispose() → void
Dispose the GUITexture, and delete element.
