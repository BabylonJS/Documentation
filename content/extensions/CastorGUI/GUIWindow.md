# GUIWindow

## new GUIWindow(id, imageUrl, options, guimanager)
Creates a new GUIWindow

#### Parameters
Name | Type | Description
---|---|---
**id** | string | The id and name element
**imageUrl** | string | The image with path
**options** | json | Options of element
**guimanager** | GUIManager | The gui manager
---

## Options

* **w**: Width of image (in pixel)
* **h**: Height of image (in pixel)
* **x**: Position left of image (in pixel)
* **y**: Position top of image (in pixel)
* **backgroundColor**: Color background of window (string) =&gt; "rgba(0, 0, 0, 0.5)" by default
* **backgroundImage**: Image background of window (string) =&gt; "null" by default
* **colorContent**: Color background of content window (string) =&gt; "rgba(0.5, 0.5, 0.5, 0.1)" by default
* **imageContent**: Image background of content window (string) =&gt; "null" by default
* **borderWindow**: border of window (string) =&gt; "2px solid black" by default
* **borderTitle**: Border of window (string) =&gt; "1px solid black" by default
* **radiusWindow**: Radius border of dialog (int)  =&gt; 8 by default
* **colorTitle**: Color background title window (string) =&gt; "rgba(0, 0, 0, 0.4)" by default
* **imageTitle**: Image background title window (string) =&gt; "null" by default
* **heightTitle**: Height the title element (int) =&gt; 30 by default
* **titleTextAlign**: Allignment of the title text (string) =&gt; "center" by default
* **titleColor**: Color of the title text (string) =&gt; "white" by default
* **titleFontSize**: size title (int)  =&gt; 12 by default
* **textTitle**: Text of title (string)  =&gt; true by default
* **draggable**: Window draggable (bool)
* **closeButton**: Button window display (bool)
* **zIndex**: Depth of the element (int) =&gt; 1 by default
* **overflow**: overflow auto or hidden (auto by default)

## Methods

### add(element) → void
add element in the GUIWindow

### setVisible(bool, fade) → void
Set this GUI element to visible or invisible (false by default)

### isVisible() → void
Returns element if is visible or no

### dispose() → void
Dispose the GUIWindow, and delete element.
