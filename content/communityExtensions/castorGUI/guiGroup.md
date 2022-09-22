---
title: GUIGroup
image:
description: Creates a new GUIGroup.
keywords: Castor, GUI, plugin, extension, GUIGroup
further-reading:
video-overview:
video-content:
---

## new GUIGroup(id, options, guimanager)

Creates a new GUIGroup

### Parameters

| Name           | Type       | Description        |
| -------------- | ---------- | ------------------ |
| **name**       | string     | The name element   |
| **options**    | json       | Options of element |
| **guimanager** | GUIManager | The gui manager    |

---

## Options

- **x**: position left of group (in pixel)
- **y**: position top of group (in pixel)

## Methods

### add(GUIElement) → void

add element in the GUIGroup

### setVisible(bool) → void

Set this GUI element to visible or invisible

### isVisible() → void

Returns element if is visible or no

### dispose() → void

Dispose the GUIGroup, and delete all elements of group.
