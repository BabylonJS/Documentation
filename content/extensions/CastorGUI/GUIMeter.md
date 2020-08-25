# GUIMeter

## new GUIMeter(id, options, guimanager, callback, append)
Creates a new GUIMeter

#### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**callback** | function | Trigger function by change (optional)
**append** | bool | is added to the &lt;body&gt;. =&gt; True by default (optional)
---

## Options

* **w**: width of meter (in pixel)
* **h**: height of meter (in pixel)
* **x**: position left of meter (in pixel)
* **y**: position top of meter (in pixel)
* **min**: min value meter =&gt; 0 by default (optional)
* **max**: max value meter =&gt; 100 by default (optional)
* **border**: border of element =&gt; 0 by default (optional)
* **borderRadius**: radius border of element =&gt; 5 by default (optional)
* **background**: background meter bar  =&gt; "rgba(0, 0, 0, 0.2)" by default (optional)
* **backgroundValue**:  background value meter  =&gt; "#1e9100" by default (optional)
* **value**: current value of the meter =&gt; 0 by default (optional)
* **orient**: orientation of the meter =&gt; "horizontal" by default (optional)
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **tabindex**: Tab order of the field.

## Methods

### updateValue(int) → void
Set this progress value GUI element 

### setVisible(bool, fade) → void
Set this GUI element to visible or invisible

### isVisible() → void
Returns element if is visible or no

### dispose() → void
Dispose the GUIMeter, and delete element.
