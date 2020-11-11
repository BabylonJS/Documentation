---
title: GUIProgress
image:  
description: Creates a new GUIProgress.
keywords: Castor, GUI, plugin, extension, GUIProgress
further-reading:
video-overview: 
video-content:
---

## new GUIProgress(id, options, guimanager, callback, append)
Creates a new GUIProgress

### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**callback** | function | Trigger function by change (optional)
**append** | bool | is added to the &lt;body&gt;. =&gt; True by default (optional)
---

# Options

* **w**: Width of progress bar (in pixel)
* **h**: Height of progress bar (in pixel)
* **x**: Position left of progress bar (in pixel)
* **y**: Position top of progress bar (in pixel)
* **min**: Min value progress bar =&gt; 0 by default (optional)
* **max**: Max value progress bar =&gt; 100 by default (optional)
* **value**: Current value of the progress bar =&gt; 0 by default (optional)
* **border**: Border of element =&gt; 0 by default (optional)
* **borderRadius**: Radius border of element =&gt; 5 by default (optional)
* **background**: Background progress bar  =&gt; "rgba(0, 0, 0, 0.2)" by default (optional)
* **backgroundValue**: Background value progress bar  =&gt; "#0f4fff" by default (optional)
* **orient**: Orientation of the progress bar =&gt; "horizontal" by default (optional)
* **zIndex**: Depth of the element (int) =&gt; 1 by default
* **tabindex**: Tab order of the field.

# Methods

## updateValue(int) → void
Set this progress value GUI element 

## getValue(int) → void
Get value progress GUI element

## setVisible(bool, fade) → void
Set this GUI element to visible or invisible

## isVisible() → void
Returns element if is visible or no

## dispose() → void
Dispose the GUIProgress, and delete element.
