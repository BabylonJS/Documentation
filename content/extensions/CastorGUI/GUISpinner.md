# GUISpinner

# new GUISpinner(id, options, guimanager, callback, append)
Creates a new GUISpinner

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

* **w**: width of input number (in pixel)
* **h**: height of input number (in pixel)
* **x**: position left of input number (in pixel)
* **y**: position top of input number (in pixel)
* **min**: min value input number =&gt; 0 by default (optional)
* **max**: max value input number =&gt; 100 by default (optional)
* **step**: graduation of input number =&gt; 1 by default (optional)
* **value**: Current value of the input number =&gt; 50 by default (optional)
* **orient**: orientation of the input number =&gt; "horizontal" by default (optional)
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **tabindex**: Tab order of the field.

# Methods

## getNumber() → void
Get the number value of element

## setVisible(bool, fade) → void
Set this GUI element to visible or invisible

## isVisible() → void
Returns element if is visible or no

## dispose() → void
Dispose the GUISpinner, and delete element.
