# GUIButton

## new GUIButton(id, options, guimanager, callback, append)
Creates a new GUIButton

#### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**callback** | function | Trigger function by click (optional)
**append** | bool | is added to the &lt;body&gt;. =&gt; True by default (optional)
---

## Options

* **w**: width of button (in pixel)
* **h**: height of button (in pixel)
* **x**: position left of button (in pixel)
* **y**: position top of button (in pixel)
* **value**: value text button (string) =&gt; "Ok" by default
* **backgroundImage**: image background of button (string) =&gt; null by default
* **backgroundColor**: color background of button (string) =&gt; "rgba(0.5, 0.5, 0.5, 0.6)" by default
* **borderRadiusButton**: radius border of button (string)  =&gt; "10px" by default
* **borderButton**: border of button (string)  =&gt; "2px solid black" by default
* **colorText**: color text of button (string)  =&gt; "black" by default
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **tabindex**: Tab order of the field.

## Methods

### setVisible(bool, fade) → void
Set this GUI element to visible or invisible

### isVisible() → void
Returns element if is visible or no

### dispose() → void
Dispose the GUIButton, and delete element.
