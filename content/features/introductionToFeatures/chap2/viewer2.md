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

<CodePen pen="pvzaPBV" tab="result" title="Babylon Viewer Basics" />

By default the Viewer calculates the extent of the model and adjusts the camera accordingly.

If you want to get the camera closer to the model, you can use the `camera-orbit` attribute. Camera orbit is specified as `alpha beta radius`, and any of these values can be set to `auto` to use the default value. Therefore, if you just want to move the camera closer to the village, you can set `camera-orbit="auto auto 15"`.

<CodePen pen="EaYQmzJ" tab="html,result" title="Babylon Viewer Basics" />

When you are developing a web game or app you probably want more flexibility than the Viewer can give. Let's take another look at using the HTML template.
