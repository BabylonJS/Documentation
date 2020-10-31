# GUIColor

# new GUIColor(id, options, guimanager, callback, append)

Creates a new GUIColor

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
* **value**: Current value of the slider =&gt; "red" by default (optional)
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **tabindex**: Tab order of the field.

# Methods

## getColor(bool: rgb) → void
Get the color value of element in rgb (true by default) or hex (false by default)

## setVisible(bool: fade) → void
Set this GUI element to visible or invisible

## isVisible() → void
Returns element if is visible or no

## dispose() → void
Dispose the GUIColor, and delete element.
