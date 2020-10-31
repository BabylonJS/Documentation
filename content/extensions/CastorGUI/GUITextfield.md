# GUITextfield

# new GUITextfield(id, options, guimanager, append)
Creates a new GUITextfield

### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**append** | bool | is added to the &lt;body&gt;. =&gt; True by default (optional)
---

# Options

* **x**: position left of textfield (in pixel)
* **y**: position top of textfield (in pixel)
* **size**: size the textfield (int) =&gt; 30 by default (optional)
* **color**: color the textfield (string) =&gt; "white" by default (optional)
* **value**: value of textfield (string)
* **placeholder**: value by default of textfield (string)
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **tabindex**: Tab order of the field.

# Methods

## getValue() → void
Get the value element

## setValue() → void
Set the value element

## setVisible(bool, fade) → void
Set this GUI element to visible or invisible

## isVisible() → void
Returns element if is visible or no

## dispose() → void
Dispose the GUITextfield, and delete element.
