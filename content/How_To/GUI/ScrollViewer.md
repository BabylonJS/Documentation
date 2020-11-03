# The Scroll Viewer

When you want to keep your user interface small and the information to present large you can use the **ScrollViewer** to contain the information.

![ScrollViewer](/img/gui/scroll1.jpg).

It consists of vertical and horizontal scroll bars and a viewing area. The information you want to present is created as a control that you add to your scroll viewer and is shown in the viewing area. If all the information control fits inside the scroll viewer no scroll bars will be shown.

From Babylon.js version 4.1 onwards it is possible to use an image for the thumb control and in the bars

![ScrollViewer with Image Bars](/img/gui/scroll4.jpg).

# Creating the Scroll Viewer

The scroll viewer base is a rectangle container holding the scroll bars and the viewing area. You create it with or without a name.

```javascript
var myScrollViewer = new BABYLON.GUI.ScrollViewer();
var myScrollViewer = new BABYLON.GUI.ScrollViewer("name");
```

and add it to an advanced texture as usual.

```javascript
var myAdvancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
  "UI"
);
myAdvancedTexture.addControl(myScollViewer);
```

You can then create your control or container of controls to add to the scroll viewer using the **addControl** method.

```javascript
myScrollViewer.addControl(myControl);
```

- [Playground Example - Scroll Viewer](https://www.babylonjs-playground.com/#13CF95#1)

The default setting for width and depth of the scroll viewer is 100% of the parent control.

The following table shows the additional properties of a scroll viewer.

| Property      | Type   | Default     | Comments                                                     |
| ------------- | ------ | ----------- | ------------------------------------------------------------ |
| barColor      | string | grey        | Foreground color of the scroll bar and color of the thumb    |
| barBackground | string | transparent | Background color of the scroll bar and bottom right square   |
| thumbLength   | number | 0.5         | Proportion of thumb compared to scroll bar length (0 to 0.9) |
| barSize       | number | 20          | Height of scroll bar                                         |

**NOTE** All the padding values for the scroll viewer are set as 0. Any padding should be set on the control added to the scroll viewer.

- [Playground Example - Scroll Viewer of Fixed Size with Grid of Images](https://www.babylonjs-playground.com/#C3RDBS#3)
- [Playground Example - Scroll Viewer of Relative Size with Grid of Images](https://www.babylonjs-playground.com/#C3RDBS#2)

# Scrollbars

Both scrollbars can be reached with:

- horizontalBar
- verticalBar

You can then set the scrollbar position with `scrollViewer.horizontalBar.value`. This value must be between 0 and 1.

# Image Scrollbars

In order to have images in the scroll bar you need to pass a name (can be empty string) and a parameter of true when creating the scroll viewer.

```javascript
var myScrollViewer = new BABYLON.GUI.ScrollViewer("", true);
```

Additional properties are available

| Property                                                 | Type      | Default | Comments                                                                                                         |
| -------------------------------------------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| thumbImage<br/>horizontalThumbImage<br/>verticalThumbImage | GUI Image | none    | Image used for the thumb; required for image scroll bars                                                         |
| barImage<br/>horizontalBarImage<br/>verticalBarImage       | GUI Image | none    | Image for the scroll bars                                                                                        |
| thumbHeight                                              | number    | 1       | Proportion of thumb compared to bar height (0 to 1)                                                              |
| barImageHeight                                           | number    | 1       | Proportion of barImage compared to bar height (0 to 1)                                                           |
| scrollBackground                                         | string    | grey    | background color of scroll bars excluding the bottom right square; useful behind a thin or transparent bar image |

You do not have to have a barImage.

The images for the vertical bar and thumb are by default rotated copies of those used for the horizontal bar and thumb. You may want to keep the image sizes small if memory is an issue in your project.

You can also choose to have different images for the vertical and horizontal bar / thumb. In that case, use `horizontalThumbImage` / `verticalThumbImage` instead of `thumbImage` and `horizontalBarImage` / `verticalBarImage` instead of `barImage`.

- [Playground Example - Image Scroll Bars](https://www.babylonjs-playground.com/#4ZC0G4#2)
- [Playground Example - Image Scroll Bars in a Grid](https://www.babylonjs-playground.com/#4ZC0G4#1)

# Adding an Adjustable TextBlock Window

When you add a TextBlock of a given size to a scroll viewer both horizontal and vertical scroll bars are shown as needed.

![Contained TextBlock](/img/gui/scroll3.jpg)

- [Playground Example - Scroll Viewer with Fixed TextBlock](https://www.babylonjs-playground.com/#FX6KVK#3)

However quite often you need to present text fitting the width of the viewing window and scrolling for the height. This is achieved by setting the `textWrapping` and `reSizeToFit` as follows

```javascript
myTextBlock.textWrapping = BABYLON.GUI.TextWrapping.WordWrap;
myTextBlock.resizeToFit = true;
```

![Adjusting TextBlock](/img/gui/scroll2.jpg)

- [Playground Example - Scroll Viewer with Adjusting TextBlock](https://www.babylonjs-playground.com/#3EF49E#5)

# Live-Updating and Child Containers

The ScrollViewer accepts only ONE child control. If that single child is a textBlock, then you can modify its _.text_ property (including \\n linebreaks), to add/remove text content to/from that single textBlock.

The ScrollViewer also accepts a single CONTAINER (such as a stackpanel) for its single child. In that container, you may add/remove any type of control(s). For certain types of containers, you might choose to add `container.ignoreLayoutWarnings = true;`, and you might need to set a non-percentage _height_ value to certain children within the container(s).

# Rendering optimization

If you have a lot of controls in your scroll viewer window, you may notice a slow down in the rendering time.

To help improving your fps, you can set `myScrollViewer.freezeControls = true`. This will "freeze" the controls in their current position (in the window) and will make their rendering faster when the window is scrolled. When controls are frozen, a change in their position/size may not work, so if you must do it, first set `freezeControls` to `false`, do your changes then revert `freezeControls` back to `true`.

You can further improve the rendering time by using the `setBucketSizes` method:

```javascript
myScrollViewer.setBucketSizes(100, 40);
```

When `freezeControls` is true, setting a non-zero bucket size will improve performances by updating only controls that are visible. The bucket sizes is used to subdivide (internally) the window area to smaller areas into which controls are dispatched. So, the size should be roughly equals to the average size of all the controls inside the window. To disable the usage of buckets, sets either width or height (or both) to 0.

Please note that using this option will raise the memory usage (the higher the bucket sizes, the less memory used), that's why it is not enabled by default.

You can also use the `ScrollViewer.forceHorizontalBar` and `ScrollViewer.forceVerticalBar` properties.

When set to true, they force the display of the corresponding bars. When you know your scroll viewer will end up with visible bars, you can set those properties to true to save some initialization time, as if it is the scroll viewer control that makes a bar visible in the course of the initialization, it will trigger a children layout rebuild, adding more time to the initialization process.

[Playground Example - Rendering Optimization](https://playground.babylonjs.com/#KPLW9F)

# Further reading

[How To Use the Selection Panel Helper](/how_to/selector)  
[How To Use Babylon GUI](/how_to/gui)  
[How To Use Babylon GUI Xml Loader](/how_to/XmlLoader)  
[How To Use Babylon GUI3D](/how_to/gui3d)
