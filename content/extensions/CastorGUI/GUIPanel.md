---
title: GUIPanel
image:  
description: Creates a new GUIPanel.
keywords: Castor, GUI, plugin, extension, GUIPanel
further-reading:
video-overview: 
video-content:
---

## new GUIPanel(id, options, guimanager, append)
Creates a new GUIPanel

### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
**callback** | function | Trigger function by click (optional)
---

# Options

* **w**: width of panel (in pixel)
* **h**: height of panel (in pixel)
* **x**: position left of panel (in pixel)
* **y**: position top of panel (in pixel)
* **backgroundImage**: image background of panel (string) =&gt; null by default
* **backgroundColor**: color background of panel (string) =&gt; "black" by default
* **borderRadiusPanel**: radius border of panel (string)  =&gt; "10px" by default
* **borderPanel**: border of panel (string)  =&gt; "2px solid black" by default
* **zIndex**: depth of the element (int) =&gt; 1 by default
* **overflow**: overflow auto or hidden (auto by default)

# Methods

## add(element) → void
add element in the GUIPanel

## setVisible(bool, fade) → void
Set this GUI element to visible or invisible (false by default)

## isVisible() → void
Returns element if is visible or no

## dispose() → void
Dispose the GUIPanel, and delete element.
