---
title: Getting Started - Chapter 2 - The Viewer
image:
description: Continue your Babylon.js learning by using the Babylon.js viewer to view a model.
keywords: getting started, start, chapter 2, viewer
further-reading:
video-overview:
video-content:
---

# Getting Started - The Viewer

## Changing the Viewer's Camera

What happens when we put the **Village** as a model in the viewer?

[Example Viewer - Village](/webpages/page2.html) using the default Viewer.

![View 2](/img/getstarted/view2.png)

We see that the ground flickers. Why is that? This is because by default the Viewer already adds a ground and where they overlap they 'fight' for supremacy.

How do we overcome this? We use the _extends_ attribute in the &lt;babylon&gt; element and set it to minimal.

```javascript
<babylon extends="minimal" model="path to model file"></babylon>
```

This removes the default ground along with other aspects such as the Babylon.js link and the full screen icon giving

[Example Viewer - Village](/webpages/page3.html) using the minimal Viewer.

![view3](/img/getstarted/view3.png)

Removing the default ground has stopped the flickering. However the default Viewer calculates the extent of the model and adjusts the camera accordingly. By using _minimal_ the camera just defaults to close to the center of the model village.

When you want the camera further away you have to get your hands dirty with some code, which of course you can just copy and paste as needed.

To move the camera we have to adjust its _radius_ property. This has to be done before the model is loaded. Properties cannot be changed once the model is loaded in the Viewer. We need to remove the _model_ attribute from the &lt;babylon&gt; element to prevent the model loading before the camera radius can be changed. The &lt;babylon&gt; element must also be given an _id_ which is referenced by the script that will alter the camera properties.

```html
<babylon id="myViewer" extends="minimal"></babylon>
```

The following code sets the camera radius (and in this case its angle of depression) and then load the model using

```javascript
<script>
    BabylonViewer.viewerManager.getViewerPromiseById('myViewer').then((viewer) => {
        viewer.onSceneInitObservable.add(() => {
            viewer.sceneManager.camera.radius = 15; //set camera radius
            viewer.sceneManager.camera.beta = Math.PI / 2.2; //angle of depression
        });
        viewer.onEngineInitObservable.add((scene) => {
            viewer.loadModel({
                url: "path to model file"
            });
        });
    });
</script>
```

[Example Viewer - Village](/webpages/page4.html) adjusting the camera

When you are developing a web game or app you probably want more flexibility than the Viewer can give. Let's take another look at using the HTML template.
