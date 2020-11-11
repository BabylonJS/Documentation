---
title: GUIManager
image:  
description: Creates a new GUIManager
keywords: Castor, GUI, plugin, extension, GUIManager
further-reading:
video-overview: 
video-content:
---

## new GUIManager(canvas, css)
Creates a new GUIManager

### Parameters
Name | Type | Description
---|---|---
**canvas** | object | The element canvas
**css** | string | The css GUI for all element
**options** | object | The option of theme GUI for all element
---

# Options

## themeRoot
Root of file css of theme

## themeGUI
file css of theme

# Methods

## addStyle(string:css) → void
Add style on GUI

## getElementById(string) → [GUIElement]()
Returns the element corresponding.

## getCanvasOrigine() → void
Returns the origine canvas (x,y)

## getCanvasWidth(string) → void
Returns the size canvas (width, height)

## fadeIn(element) → void
Set fade in element

## fadeOut(element) → void
Set fade out element

## setVisible(bool, fade) → void
Set this GUI all element to visible or invisible

## isVisible() → void
Returns all element if is visible or no

## dispose() → void
Dispose the GUIManager, and delete all elements.
