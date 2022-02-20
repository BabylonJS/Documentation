---
title: Introduction - Chapter 1 - Enhancing Your Website
image: 
description: Continue your first steps into Babylon.js by enhancing your first website.
keywords: getting started, start, chapter 1, first site
further-reading: 
video-overview:
video-content:
---

# Introduction - Enhancing Your Website

## First Model on a Web Page.
Provided the file type is one recognized by Babylon.js then you can use the Babylon.js [Viewer](/extensions/babylonViewer) to display your scene or model on a web page using the *&lt;babylon&gt;* element. Examples of suitable file types are *.babylon*, *.gltf* and *glb* with *.glb* recommended. It makes no difference whether the scene was built with Babylon.js or created with your favorite design software. The *&lt;babylon&gt;* element will be sized to fit its container.

In order to use the Viewer you need to add its code to your HTML page in a *&lt;script&gt;* element

```javascript
<script src="https://cdn.babylonjs.com/viewer/babylon.viewer.js"></script>
```

Once this is added you place the *&lt;babylon&gt;* element in an appropriate container and points its *model* attribute to the file source.


```javascript
<babylon model="Path to File"></babylon>
```

[Example Web Page](/webpages/page1.html)

![Page 1](/img/getstarted/view1.png)

When you want to use your models for a game or application on a web page you need first to know how to import them. 
