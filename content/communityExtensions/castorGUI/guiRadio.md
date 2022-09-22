---
title: GUIRadio
image:
description: Creates a new GUIRadio.
keywords: Castor, GUI, plugin, extension, GUIRadio
further-reading:
video-overview:
video-content:
---

## new GUIRadio(id, options, guimanager, callback, append)

Creates a new GUIRadio

### Parameters

| Name           | Type       | Description                                                    |
| -------------- | ---------- | -------------------------------------------------------------- |
| **id**         | string     | The id and name element                                        |
| **options**    | json       | Options of element                                             |
| **guimanager** | GUIManager | The gui manager                                                |
| **callback**   | function   | Trigger function by click (optional)                           |
| **append**     | bool       | is added to the &lt;body&gt;. =&gt; True by default (optional) |

---

## Options

- **name**: Name to group radio buttons
- **x**: Position left of radio button (in pixel)
- **y**: Position top of radio button (in pixel)
- **size**: Size of radio button (float) =&gt; "1.0" by default
- **zIndex**: Depth of the element (int) =&gt; 1 by default
- **tabindex**: Tab order of the field.

## Methods

### isChecked() → void

return if element is checked

## setChecked(value) → void

check element

### setVisible(bool, fade) → void

Set this GUI element to visible or invisible

### isVisible() → void

Returns element if is visible or no

### dispose() → void

Dispose the GUIRadio, and delete element.
