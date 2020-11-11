---
title: GUICheckbox
image:  
description: Creates a new GUICheckbox.
keywords: Castor, GUI, plugin, extension, GUICheckbox
further-reading:
video-overview: 
video-content:
---

## new GUICheckbox(id, options, guimanager, callback, append)
Creates a new GUICheckbox

### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**callback** | function | Trigger function by click (optional)
**append** | bool | is added to the &lt;body&gt;. =&gt; True by default (optional)
---

# Options

* **x**: position left of checkbox (in pixel)
* **y**: position top of checkbox (in pixel)
* **size**: size of checkbox (float) =&gt; "1.0" by default
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **tabindex**: Tab order of the field.

# Methods

## isChecked() → void
return if element is checked

## setChecked(value) → void
check element

## setVisible(bool, fade) → void
Set this GUI element to visible or invisible

## isVisible() → void
Returns element if is visible or no

## dispose() → void
Dispose the GUICheckbox, and delete element.
