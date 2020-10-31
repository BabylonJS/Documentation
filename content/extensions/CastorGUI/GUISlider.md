# GUISlider

# new GUISlider(id, options, guimanager, callback, append)
Creates a new GUISlider

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

* **w**: width of slider (in pixel)
* **h**: height of slider (in pixel)
* **x**: position left of slider (in pixel)
* **y**: position top of slider (in pixel)
* **min**: min value slider =&gt; 0 by default (optional)
* **max**: max value slider =&gt; 100 by default (optional)
* **step**: graduation of slider =&gt; 1 by default (optional)
* **value**: Current value of the slider =&gt; 50 by default (optional)
* **orient**: orientation of the slider =&gt; "horizontal" by default (optional)
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **tabindex**: Tab order of the field.

# Methods

## setVisible(bool, fade) → void
Set this GUI element to visible or invisible

## isVisible() → void
Returns element if is visible or no

## dispose() → void
Dispose the GUISlider, and delete element.
