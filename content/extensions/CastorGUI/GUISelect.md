# GUISelect

## new GUISelect(id, options, guimanager, callback, append)
Creates a new GUISelect

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

* **w**: width of select (in pixel)
* **h**: height of select (in pixel)
* **x**: position left of select (in pixel)
* **y**: position top of select (in pixel)
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **tabindex**: Tab order of the field.

## Methods

### addOptions(value, text) → void
Add option in the GUISelect

### findOptionSelected(bool: withIndex) → void
Find option selected in the GUISelect

### removeOption(value) → void
Delete option value in the GUISelect

### changeItem(oldValue, newValue) → void
Change old value by new value

### selectedItem(item) → void
Add atribute selected item

### setVisible(bool, fade) → void
Set this GUI element to visible or invisible

### isVisible() → void
Returns element if is visible or no

### dispose() → void
Dispose the GUISelect, and delete element.
