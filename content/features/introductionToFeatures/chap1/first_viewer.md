---
title: Getting Started - Chapter 1 - Enhancing Your Website
image:
description: Continue your first steps into Babylon.js by enhancing your first website.
keywords: getting started, start, chapter 1, first site
further-reading:
video-overview:
video-content:
---

# Getting Started - Enhancing Your Website

## First Model on a Web Page.

Provided the file type is one recognized by Babylon.js then you can use the Babylon.js [Viewer](/features/featuresDeepDive/babylonViewer) to display your scene or model on a web page using the _&lt;babylon&gt;_ element. Examples of suitable file types are _.babylon_, _.gltf_ and _glb_ with _.glb_ recommended. It makes no difference whether the scene was built with Babylon.js or created with your favorite design software. The _&lt;babylon&gt;_ element will be sized to fit its container.

In order to use the Viewer you need to add its code to your HTML page in a _&lt;script&gt;_ element

```javascript
<script src="https://cdn.babylonjs.com/viewer/babylon.viewer.js"></script>
```

Once this is added you place the _&lt;babylon&gt;_ element in an appropriate container and points its _model_ attribute to the file source.

```javascript
<babylon model="Path to File"></babylon>
```

[Example Web Page](/webpages/page1.html)

![Page 1](/img/getstarted/view1.png)

When you want to use your models for a game or application on a web page you need first to know how to import them.
